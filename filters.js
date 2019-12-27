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

bot.get('search/tweets', {q: 'dance', lang: 'es', count: 5}, (err, data, response) =>{
  if (err){
    console.log(err);
  } else {
    data.statuses.forEach(function(s){
      console.log(s.text);
      console.log(s.user.screen_name);
      console.log('\n');
    });
  }
});
