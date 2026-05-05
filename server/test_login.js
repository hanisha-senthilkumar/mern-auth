import http from 'http';
import fs from 'fs';

const logFile = 'test_result.txt';
// Clear previous log
fs.writeFileSync(logFile, '');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: '/api/auth' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve(parsed);
                } catch (e) {
                    log('Raw response: ' + responseData);
                    resolve({ success: false, message: 'Invalid JSON response' });
                }
            });
        });

        req.on('error', (e) => {
            log(`Problem with request: ${e.message}`);
            reject(e);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

const TEST_USER = {
    name: 'Test Manual',
    email: `testmanual${Date.now()}@example.com`,
    password: 'password123'
};

const run = async () => {
    log('--- Testing Registration ---');
    try {
        const regData = await makeRequest('/register', 'POST', JSON.stringify(TEST_USER));
        log('Register Response: ' + JSON.stringify(regData, null, 2));

        if (regData.success) {
            log('\n--- Testing Login ---');
            const loginData = await makeRequest('/login', 'POST', JSON.stringify({
                email: TEST_USER.email,
                password: TEST_USER.password
            }));
            log('Login Response: ' + JSON.stringify(loginData, null, 2));
        } else {
            if (regData.message === 'User already exists') {
                log('\n--- User exists, Testing Login ---');
                const loginData = await makeRequest('/login', 'POST', JSON.stringify({
                    email: TEST_USER.email,
                    password: TEST_USER.password
                }));
                log('Login Response: ' + JSON.stringify(loginData, null, 2));
            }
        }
    } catch (err) {
        log('Test failed: ' + err);
    }
};

run();
