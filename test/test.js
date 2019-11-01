const assert = require("assert");
const OTP = require("../");

const main_test = async () => {
    const otp = new OTP(`Listen, Morty, I hate to break it to you but what people call "love" is just a chemical 
    reaction that compels animals to breed. It hits hard, Morty, then it slowly fades, 
    leaving you stranded in a failing marriage. I did it. Your parents are gonna do it. 
    Break the cycle, Morty. Rise above. Focus on science`);

    const plaintext1 = 'Weddings are basically funerals with cake.';
    const ciphertext1 = await otp.encryptString(plaintext1, 3, 2);
    assert(ciphertext1 === 'VwBlAGQAZABpAG4AZwBzACAAYQByAGUAIABiAGEAcwBpAGMAYQBsAGwAeQAgAGYAdQBuAGUAcgBhAGwAcwAgAHcAaQB0AGgAIABjAGEAawBlAC4A');

    const plaintext2 = 'What about the reality where Hitler cured cancer, Morty? The answer is: Don\'t think about it.';
    const ciphertext2 = await otp.encryptString(plaintext2, 5, 1);
    assert(ciphertext2 === 'V3RoZWFudCwgIGFNYm9vcnV0dHkgLHQgaEllICBocmFldGFlbCBpdHRveSAgYndyaGVlYXJrZSAgaUh0aSB0dGxvZSByeSBvY3V1IHJiZXVkdCAgY3dhaG5hY3RlIHJwLGUgb01wb2xyZXQgeWM/YSBsVGxoIGUiIGxhb252c2V3ImUgcmkgc2kgc2o6dSBzRHRvIG5hJyB0YyBodGVobWlpbmNrYSBsYSBiCm8gdSB0ICAgaXJ0ZS5h');

    const plaintext3 = 'I turned myself into a pickle. I\'m Pickle Riiiiick.';
    const ciphertext3 = await otp.encryptString(plaintext3, 10, 2);
    const decrypteed_plaintext = await otp.decryptString(ciphertext3, 10, 2);
    assert(decrypteed_plaintext === plaintext3);

    const plaintext4 = 'They’re just robots, Morty! It’s OK to shoot them! They’re robots!';
    const ciphertext4 = await otp.encryptString(plaintext4, 5,1);
    const incorrectly_decrypted_text = await otp.decryptString(ciphertext4, 3, 2);
    assert(plaintext4 !== incorrectly_decrypted_text);
};

main_test().then(() => console.log("All tests pass!")).catch(err => console.log(err));