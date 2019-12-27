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

function getBotTimeline(){
  bot.get('statuses/home_timeline', {count: 5}, (err, data, response) => {
    if (err){
      console.log(err);
    } else {
      data.forEach((d) => {
        console.log(d.text);
        console.log(d.user.screen_name);
        console.log(d.id_str);
        console.log('\n');
      });
    }
  });
}

//GET HOME TIMELINE
function getBotTimeline(){
    bot.get('statuses/home_timeline', {count: 25},  (err, data, response) => {
            if (err){
                console.log(err);
            } else {
                data.forEach(function(d){
                  console.log(d.text);
                  console.log(d.id_str);
                });
            }
        });
}

//RETWEET
function retweet(idString){
    bot.post('statuses/retweet/:id', { id: idString }, function (err, data, response) {
          if (err){
              console.log(err);
          } else {
              data.forEach(function(d){
                  console.log(d.text + " has been retweeted.");
              });
          }
      });
}

//UNRETWEET
function unretweet(idString){
    bot.post('statuses/unretweet/:id', { id: idString }, function (err, data, response) {
          if (err){
              console.log(err);
          } else {
              data.forEach(function(d){
                  console.log(d.text + " has been unretweeted.");
              });
          }
      });
}

//REPLY TO TWEET
function replyToTweet(screenName, idString, replyString){
    const reply = '@'+screenName+' '+replyString;
    bot.post('statuses/update', { status: reply, in_reply_to_status_id: idString }, function (err, data, response) {
      if (err){
        console.log(err);
      } else {
        console.log(reply+ " has been replied.");
      }
    });
}


//DELETE TWEET
function deleteTweet(idString){
    bot.post('statuses/destroy/:id', { id: idString }, function (err, data, response) {
      if (err){
        console.log(err);
      } else {
        console.log(data.text + " has been deleted.");
      }
    });
}

//LIKE TWEET
function likeTweet(idString){
  bot.post('favorites/create', { id: idString }, function (err, data, response){
    if (err){
      console.log(err);
    } else {
      console.log(data.text + " has been liked.");
    }
  });
}

//UNLIKE TWEET
function unlikeTweet(idString){
  bot.post('favorites/destroy', { id: idString }, function (err, data, response){
    if (err){
      console.log(err);
    } else {
      console.log(data.text + " has been unliked.");
    }
  });
}

replyToTweet('bots_with_han', '827636974852923392', 'yay!');
