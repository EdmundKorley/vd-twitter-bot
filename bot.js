var Twit = require('twit');

var T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
});

var activeTracks = [ 'WalterScott', 'Trump' ];

// Upon call, listen for statuses with hastag
function streamHastag() {
    var stream = T.stream('statuses/filter', {
        track: activeTracks,
        language: 'en'
    });

    stream.on('tweet', function(tweet) {
        // Perform network analysis routines here:
        // Key people to anchor network: @deray, @shaunking, @nettaaaaaaaa
        // Follow up with neural net routine for deauthorizing shitposters.
        // Persist in DB with meta-data.
        // Retweet 👍
        if (isOriginalMedia(tweet)) {
            // Retweet
            console.log('TRYING TO RETWEET 😬');
            setTimeout(function() {
                retweetThis(tweet.id_str);
            }, 10000);

            // Stop and start streamHastag again recursively after a minute
            // to maintain a max rate of ~1 tweet/min
            stream.stop();
            setTimeout(streamHastag, 60000);
        } else {
            console.log('REJECTED 🔇: ', tweet.id_str);
        }
    });
}

function isOriginalMedia(data) {
    var seen = false;
    if (data['extended_entities']) {
        var mediaArr = data['extended_entities']['media'];
        if (mediaArr) {
            mediaArr.forEach(function(mediaObj) {
                if (mediaObj.type === 'video') {
                    console.log('HIT 👊🏾: ', data.id_str);
                    seen = true;
                }
            });
        }
    }
    return seen;
}

function retweetThis(toTweetID) {
    T.post('statuses/retweet/:id', { id: toTweetID }, function(err, data, response) {
        console.log('RETWEETED 😝: ' + toTweetID);
    });
}

streamHastag();
