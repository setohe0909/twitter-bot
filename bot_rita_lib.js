const Twit = require('twit');
const fs = require('fs');
const csvparse = require('csv-parse');
const rita = require('rita');
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

const inputText = '';
const filePath = './twitter_archive/tweets.csv';

const tweetData = fs.createReadStream(filePath)
  .pipe(csvparse({delimiter: ','}))
  .on('data', (row) => {
    inputText = inputText + ' ' + cleanText(row[5]);
  })
  .on('end', () => {
    const markov = new rita.RiMarkov(2);
    markov.loadText(inputText);
    
    const sentence = markov.generateSentences(1);
    bot.post('statuses/update', {status: sentence}, (err, data, response) => {
      if (err){
        console.log(err);
      }else{
        console.log('Status tweeted.');
      }
    });
});

function hasNoStopwords(token){
  const stopwords = ['@', 'http', 'RT'];

  return stopwords.every((sw) =>  !token.includes(sw));
}

function cleanText(text){
  return rita.RiTa.tokenize(text, ' ')
    .filter(hasNoStopwords)
    .join(' ')
    .trim();
}
