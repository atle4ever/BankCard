var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

function encrypt(text, password){
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text, password){
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

// Read not-encrypted code
var fs = require('fs');
var code = fs.readFileSync('./code');

// Get password from user
var prompt = require('prompt');
prompt.start();
prompt.get(['password'], function(err, result) {
  encrypted = encrypt(code, result.password);
  decrypted = decrypt(encrypted, result.password);

  var assert = require('assert');
  assert.equal(code, decrypted);

  fs.writeFileSync('./encrypted', encrypted);
});
