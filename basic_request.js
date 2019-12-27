const Twit = require('twit');
const dotenv = require('dotenv');

dotenv.config();

/**
* Generate consumer key and access token in 
* https://twitter.com/apps
*/
const bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
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
bot.get('followers/ids', {scren_name: 'seto bot 🤖'}, (_err, data, response)  => {
  if(_err) {
    console.error('[Error]-', _err);
  } else {
    console.log(data);
  }
});

bot.get('followers/list', {scren_name: 'seto bot 🤖'}, (_err, data, response) => {
  if(_err) {
    console.error('[Error]-', _err);
  } else {
    data.users.forEach((user) => {
      console.log(user.scren_name);
    });
    console.log(data);
  }
});


// Send direct message
bot.post('direct_messages/events/new', {screen_name: 'setoohe', text: 'Hello'}, (_err, data, response) => {
  if(_err) {
    console.error('[Error] -', _err);
  } else {
    console.log(data);
  }
});
