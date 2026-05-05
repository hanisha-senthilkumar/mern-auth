import http from 'http';
import fs from 'fs';

const BASE_PATH = '/api/auth';
const LOG_FILE = 'backend_test_flow.log';

// Reset log file
fs.writeFileSync(LOG_FILE, '');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

function makeRequest(endpoint, method, body, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: BASE_PATH + endpoint,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            // Test both Cookie and Authorization header, though middleware checks both.
            // But usually client sends cookie. We will simulate cookie here if we could, 
            // but standard http client doesn't manage cookies automatically. 
            // The middleware `req.cookies.token` expects a cookie. 
            // The middleware ALSO checks `req.headers.authorization`.
            options.headers['Authorization'] = `Bearer ${token}`;
            options.headers['Cookie'] = `token=${token}`;
        }

        const dataStr = body ? JSON.stringify(body) : '';
        if (dataStr) {
            options.headers['Content-Length'] = Buffer.byteLength(dataStr);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                // Check if response set a cookie
                let receivedToken = null;
                if (res.headers['set-cookie']) {
                    res.headers['set-cookie'].forEach(cookie => {
                        if (cookie.startsWith('token=')) {
                            receivedToken = cookie.split(';')[0].split('=')[1];
                        }
                    });
                }

                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, body: parsed, token: receivedToken });
                } catch (e) {
                    log(`[${endpoint}] Invalid JSON: ${responseData}`);
                    resolve({ status: res.statusCode, body: null, token: receivedToken });
                }
            });
        });

        req.on('error', (e) => {
            log(`[${endpoint}] Request Error: ${e.message}`);
            reject(e);
        });

        if (dataStr) req.write(dataStr);
        req.end();
    });
}

// Helper to read server log and find OTP
function findOtpInServerLog(email, type) {
    try {
        const content = fs.readFileSync('server.log', 'utf8');
        const lines = content.split('\n').reverse(); // Search from end
        const searchStr = type === 'verify'
            ? `Generated Verify OTP for ${email}:`
            : `Generated Reset OTP for ${email}:`;

        for (const line of lines) {
            if (line.includes(searchStr)) {
                return line.split(':').pop().trim();
            }
        }
    } catch (e) {
        log('Error reading server log: ' + e.message);
    }
    return null;
}

async function runTest() {
    const TEST_USER = {
        name: 'Flow User',
        email: `flow${Date.now()}@example.com`,
        password: 'password123'
    };

    log(`Starting Full Backend Flow Test for ${TEST_USER.email}`);

    try {
        // 1. REGISTER
        log('\n--- 1. Registering ---');
        const regRes = await makeRequest('/register', 'POST', TEST_USER);
        log(`Status: ${regRes.status}, Response: ${JSON.stringify(regRes.body)}`);

        if (!regRes.body || !regRes.body.success) {
            log('Registration Failed. Aborting.');
            return;
        }

        let authToken = regRes.token; // Usually register logs you in
        log(`Token from Register: ${authToken ? 'Yes' : 'No'}`);

        // 2. LOGOUT
        log('\n--- 2. Logout ---');
        const logoutRes = await makeRequest('/logout', 'POST', {}, authToken);
        log(`Status: ${logoutRes.status}, Response: ${JSON.stringify(logoutRes.body)}`);

        // 3. LOGIN (Should succeed)
        log('\n--- 3. Login ---');
        const loginRes = await makeRequest('/login', 'POST', {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        log(`Status: ${loginRes.status}, Response: ${JSON.stringify(loginRes.body)}`);

        if (loginRes.body && loginRes.body.success) {
            authToken = loginRes.token;
            log(`Token from Login: ${authToken ? 'Yes' : 'No'}`);
        } else {
            log('Login Failed. Aborting.');
            return;
        }

        // 4. CHECK AUTH (is-auth)
        log('\n--- 4. Check Auth Status ---');
        const authRes = await makeRequest('/is-auth', 'GET', null, authToken);
        log(`Status: ${authRes.status}, Response: ${JSON.stringify(authRes.body)}`);

        // 5. GET USER DATA (Protected User Route)
        log('\n--- 5. Get User Data (Protected) ---');
        // Note: The mock request function handles the double header (Cookie + Authorization)
        // We'll use a raw request to the user endpoint
        const userDataRes = await new Promise((resolve) => {
            const options = {
                hostname: 'localhost',
                port: 4000,
                path: '/api/user/data', // Different base path
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Cookie': `token=${authToken}`
                }
            };
            const req = http.request(options, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
            });
            req.end();
        });
        log(`Status: ${userDataRes.status}, Response: ${JSON.stringify(userDataRes.body)}`);


        // 6. SEND VERIFY OTP
        log('\n--- 6. Send Verify OTP ---');
        const sendVerifyRes = await makeRequest('/send-verify-otp', 'POST', {}, authToken); // Middleware requires auth to know WHO to verify
        log(`Status: ${sendVerifyRes.status}, Response: ${JSON.stringify(sendVerifyRes.body)}`);

        // Wait a bit for log to be written
        await new Promise(r => setTimeout(r, 1000));

        // 7. VERIFY EMAIL
        log('\n--- 7. Verify Email ---');
        const verifyOtp = findOtpInServerLog(TEST_USER.email, 'verify');
        if (verifyOtp) {
            log(`Found OTP in logs: ${verifyOtp}`);
            // Note: Verify endpoint usually needs userId. Let's check authController.
            // verifyEmail implementation: const { userId, otp } = req.body;
            // But wait, it doesn't use the userAuth middleware? 
            // In routes/authRoutes.js: authRouter.post('/verify-account', userAuth, verifyEmail);
            // So it DOES use userAuth. userAuth adds userId to req.body.
            // So we just send OTP.
            const verifyRes = await makeRequest('/verify-account', 'POST', { otp: verifyOtp }, authToken);
            log(`Status: ${verifyRes.status}, Response: ${JSON.stringify(verifyRes.body)}`);
        } else {
            log('Could not find Verify OTP in server logs.');
        }

        // 8. FORGOT PASSWORD (SEND OTP)
        log('\n--- 8. Send Password Reset OTP ---');
        const sendResetRes = await makeRequest('/send-reset-otp', 'POST', { email: TEST_USER.email });
        log(`Status: ${sendResetRes.status}, Response: ${JSON.stringify(sendResetRes.body)}`);

        await new Promise(r => setTimeout(r, 1000));

        // 9. RESET PASSWORD
        log('\n--- 9. Reset Password ---');
        const resetOtp = findOtpInServerLog(TEST_USER.email, 'reset');
        if (resetOtp) {
            log(`Found Reset OTP in logs: ${resetOtp}`);
            const newPassword = 'newpassword456';
            const resetPwdRes = await makeRequest('/reset-password', 'POST', {
                email: TEST_USER.email,
                otp: resetOtp,
                newPassword: newPassword
            });
            log(`Status: ${resetPwdRes.status}, Response: ${JSON.stringify(resetPwdRes.body)}`);

            if (resetPwdRes.body && resetPwdRes.body.success) {
                // 10. LOGIN WITH NEW PASSWORD
                log('\n--- 10. Login with New Password ---');
                const reloginRes = await makeRequest('/login', 'POST', {
                    email: TEST_USER.email,
                    password: newPassword
                });
                log(`Status: ${reloginRes.status}, Response: ${JSON.stringify(reloginRes.body)}`);
            }
        } else {
            log('Could not find Reset OTP in server logs.');
        }

    } catch (e) {
        log('Test Crash: ' + e);
    }
}

runTest();
