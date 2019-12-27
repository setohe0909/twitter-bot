/**
 * NOTE: With this bot, we’ll find the number of faces in a photo that is tweeted at us, and respond back with what emotions the faces are expressing, 
 * using the Google Cloud Vision API.
 */

const Twit = require('twit');
const fs = require('fs');
const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const vision = require('@google-cloud/vision')({
  projectId: 'twitterbot',
  keyFilename: './keyfile.json'
});

const bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function downloadPhoto(url, replyToName, tweetId){
    const parameters = {
        url: url,
        encoding: 'binary'
    };
    request.get(parameters, (err, response, body) => {
        const filename = 'photo'+Date.now()+'.jpg';
        fs.writeFile(filename, body, 'binary', function(err){
            console.log('Downloaded photo.');
            analyzePhoto(filename, replyToName, tweetId);
        });
    });
}

function analyzePhoto(filename, replyToName, tweetId){
    vision.detectFaces(filename, (err, faces) => {
        const allEmotions = [];
        faces.forEach(function(face){
            extractFaceEmotions(face).forEach((emotion) =>{
                if (allEmotions.indexOf(emotion) === -1){
                    allEmotions.push(emotion);
                }
            });
        });
        postStatus(allEmotions, replyToName, tweetId);
    });
}

function extractFaceEmotions(face){
    const emotions = ['joy', 'anger', 'sorrow', 'surprise'];
    return emotions.filter((emotion) => {
        return face[emotion];
    });
}

function postStatus(allEmotions, replyToName, tweetId){
    const status = formatStatus(allEmotions, replyToName);
    bot.post('statuses/update', {status: status, in_reply_to_status_id: tweetId}, (err, data, response) => {
        if (err){
            console.log(err);
        }else{
            console.log('Bot has tweeted ' + status);
        }
    });
}

function formatStatus(allEmotions, replyToName){
    const reformatEmotions = {
        joy: 'happy',
        anger: 'angry',
        surprise: 'surprised',
        sorrow: 'sad'
    };
    const status = '@'+replyToName+' Looking ';
    if (allEmotions.length>0){
        allEmotions.forEach((emotion, i) => {
            if (i === 0){
                status = status + reformatEmotions[emotion];
            }else{
                status = status + ' and ' + reformatEmotions[emotion];
            }
        });
        status = status + '!';
    }else{
        status = status + 'neutral!';
    }
    return status;
}

const stream = bot.stream('statuses/filter', {track: '@bots_with_han'});

stream.on('connecting', (response) => {
    console.log('connecting...');
});

stream.on('connected', (response) => {
    console.log('connected!');
});

stream.on('error', (err) => {
    console.log(err);
});

stream.on('tweet', (tweet) => {
    if (tweet.entities.media){
        downloadPhoto(tweet.entities.media[0].media_url, tweet.user.screen_name, tweet.id_str);
    }
});
