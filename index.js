var Twit = require('twit');

var bot = new Twit({
  consumer_key: 'vFyISqc6m7I0jvHZge2gHhraQ',
  consumer_secret: 'NDm5425zIJxI2eOxBn64sYdwwIzN42cIkDeLoEjKVFctL2MOVX',
  access_token: '286510428-81HSZkCCPcKpaVIak9JWQ9xofsIMG2OBrgSXU04w',
  access_token_secret: 'IlqUKWo82mfcxQddn5U0gdlMqE6jkrFasf4e4Yi9pgAez',
  timeout_ms: 60*1000
});

// Make a tweet with code
bot.post('statuses/update', {status: 'Hello world'}, function(_err, data, response) {
  if(_err) {
    console.error('[Error]-', _err);
  } else {
    console.log(data.text + ' was tweeted.');
  }
});


// Get info related with our folowwers
//bot.get('followers/list', {scren_name: 'seto bot 🤖'}, function(_err, data, response) {
bot.get('followers/ids', {scren_name: 'seto bot 🤖'}, function(_err, data, response) {
  if(_err) {
    console.error('[Error]-', _err);
  } else {
    console.log(data);
  }
});
