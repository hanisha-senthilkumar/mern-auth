const fs = require('fs');
console.log('Test Simple Running');
try {
    fs.writeFileSync('c:\\Users\\home\\Desktop\\backend\\server\\simple_out.txt', 'Hello from simple test');
    console.log('File written');
} catch (e) {
    console.error('Error writing file', e);
}
