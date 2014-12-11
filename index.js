var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

// Function for decrypt
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
function decrypt(text, password){
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

var fs = require('fs');

/*
 * GET /
 */
app.get('/', function(req, res) {
  res.render('index');
});

/*
 * GET /code
 */
app.get('/code', function(req, res) {
  var password = req.query.password;
  var encrypted = fs.readFileSync('./encrypted').toString();
  var decrypted = decrypt(encrypted, password);
  var tokens = decrypted.split(" ");

  var id = tokens.splice(0, 1);

  var codes = [];
  for(i = 0; i < 30; ++i) {
    codes[i] = tokens[i*2] + " " + tokens[i*2 + 1];
  }

  res.render('code', { id:id, codes: codes });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
