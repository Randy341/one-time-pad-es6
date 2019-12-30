const ab2b64 = require("ab2b64");

class OneTimePad {

    constructor(key, options=null) {
        //helper functions to convert Array Buffer to String and vice versa, for encrypting and decrypting string
        this.ab2str = this.ab2str.bind(this);
        this.str2ab = this.str2ab.bind(this);

        this.key = null;

        //Main encryption function
        this.pad = this.pad.bind(this);

        //Main string encryption functions
        this.encryptString = this.encryptString.bind(this);
        this.decryptString = this.decryptString.bind(this);

        //Accept key as both string and array buffer
        if(typeof(key) == 'string') {
            this.key = this.str2ab(key);
        } else if(key instanceof ArrayBuffer) {
            this.key = key;
        } else {
            throw new Error("key has to be either string or ArrayBuffer");
        }

        //encryption options, unused at the moment
        this.options = options;
    }

    //Main padding function
    //offset is the starting character of the key for encryption
    //step is the number of characters in the key to step through for each character at plaintext
    pad(payloadBuffer, offset=0, step=1) {
        return new Promise((resolve, reject) => {
            if(payloadBuffer.byteLength > (this.key.byteLength * step + offset)) {
                reject("Text size is bigger than usable key size!  Key size has to be equal or greater than (Text size * step + offset)")
            } else {
                let keyView = new Uint8Array(this.key);
                let textView = new Uint8Array(payloadBuffer);
                let encodedBuffer = new ArrayBuffer(payloadBuffer.byteLength);
                let encodedView = new Uint8Array(encodedBuffer);

                for(let index = 0; index < textView.length; index++) {
                    encodedView[index] = keyView[index * step + offset] ^ textView[index];
                }
                resolve(encodedBuffer)
            }
        });
    }

    encryptString(str, offset=0, step=1) {
        return new Promise((resolve, reject) => {
            let buffer = this.str2ab(str);

            this.pad(buffer, offset, step).then(encodedBuffer => {
                resolve(ab2b64.ab2b64(encodedBuffer));
            }).catch(err => {
                reject(err);
            });
        });
    }

    decryptString(str, offset=0, step=1) {
        return new Promise((resolve, reject) => {
            let buffer = ab2b64.b642ab(str);

            this.pad(buffer, offset, step).then(encodedBuffer => {
                resolve(this.ab2str(encodedBuffer));
            }).catch(err => {
                reject(err);
            });
        });
    }

    //functions taken from Renato Mangini on Google developer forum
    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }
    str2ab(str) {
        let buf = new ArrayBuffer(str.length*2); //2 bytes for each char for 16 bits, supporting UTF-16
        let bufView = new Uint16Array(buf);
        for (let i=0, strLen=str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}

module.exports = OneTimePad;

//🔥🔥🔥🔥🔥🔥🔥🔥✨✨⚠️