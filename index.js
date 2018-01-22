var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , SparkPost = require('sparkpost')
  , sp = new SparkPost(process.env.SPARKPOST_API_KEY);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// routes
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/send', function(request, response) {
  var recipients = request.body.recipients
    , message = request.body.message;

  recipients.forEach(function(val, index) {
    recipients[index] = { address: val };
  });

  sp.transmissions.send({
    transmissionBody: {
      content: {
        from: 'heroku-node-js-example@sparkpostbox.com',
        subject: 'Heroku Node.js Example',
        html: '<html><body>' + message + '</body></html>'
      },
      options: {
        sandbox: true
      },
      recipients: recipients
    }
  }, function(err, apiResponse) {
    if(err) {
      response.json(err);
    } else {
      response.json(apiResponse.body);
    }
  });
});

// start the app
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
