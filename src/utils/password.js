import crypto from "crypto";


export function generatePasswordHash(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const iterations = 10000; // Number of iterations
    const keylen = 64; // Output key length

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                const hashedPassword = derivedKey.toString('hex');
                resolve(salt + ":" + hashedPassword);
            }
        });
    });
}

// Function to match a password with the stored hash and salt
export function matchPassword(password, hashed) {
    const [ salt, hashedPassword ] = hashed.split(":");
    const iterations = 10000; // Number of iterations
    const keylen = 64; // Output key length

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                const inputHashedPassword = derivedKey.toString('hex');
                resolve(inputHashedPassword === hashedPassword);
            }
        });
    });
}