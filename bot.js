var natural = require('natural');

var Twit = require('twit');
var keys = require('./keys');

var T = new Twit({
    consumer_key: process.env.consumer_key || keys.consumer_key,
    consumer_secret: process.env.consumer_secret || keys.consumer_secret,
    access_token: process.env.access_token || keys.access_token,
    access_token_secret: process.env.access_token_secret || keys.access_token_secret,
});

var activeTracks = [
    'protest', 'tamirrice', 'mariowoods', 'trumprally', 'sandrabland', 'laquanmcdonald', 'kendrickjohnson', 'BrandonTateBrown', 'freddiegray', 'VonDerritMyers', 'portertrial', 'williamporter', 'bettiejones', 'quintoniolegrier', 'cedrickchatman', 'emmetttill', 'gynnyamcmillen', 'anthonyhill'
];

// Upon call, listen for statuses with hastag
function streamHastag() {
    var stream = T.stream('statuses/filter', {
        track: activeTracks,
        language: 'en'
    });

    stream.on('tweet', function(tweet) {
        var video = isOriginalMedia(tweet);
        if (video) {
            // Retweet
            retweetThis(tweet.id_str);

            // Stop and start streamHastag again recursively after a minute
            // to maintain a max rate of ~1 tweet/min
            stream.stop();
            setTimeout(streamHastag, 60000);
        }
    });
}

function isOriginalMedia(data) {
    if (data['extended_entities']) {
        var mediaArr = data['extended_entities']['media'];
        if (mediaArr) {
            mediaArr.forEach(function(mediaObj) {
                if (mediaObj.type === 'video') {
                    console.log(mediaObj);
                    return true;
                }
            });
        }
    }
}

function retweetThis(toTweetID) {
    T.post('statuses/retweet/:id', { id: toTweetID }, function(err, data, response) {
        if (err) console.warn(err);
        console.log('RETWEETED: ' + toTweetID);
    });
}

streamHastag();
