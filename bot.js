var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret:process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

var activeTracks = ['tamirrice', 'mariowoods', 'sandrabland', 'laquanmcdonald', 'kendrickjohnson', 'BrandonTateBrown', 'freddiegray', 'VonDerritMyers', 'portertrial', 'williamporter', 'bettiejones', 'quintoniolegrier'];

// Upon call, listen for statuses with hastag
function streamHastag() {
  var stream = T.stream('statuses/filter', { track: activeTracks, language: 'en' });

  stream.on('tweet', function(tweet) {

    if (isOriginalMedia(tweet)) {
      console.log(tweet);
      setTimeout(function() {
        retweetThis(tweet.id_str);
      }, 10000);

      // Stop and start streamHastag again recursively after a minute (to maintain a max rate of ~1 tweet/min)
      stream.stop();
      console.log('...PACING TWEET RATE...');
      setTimeout(streamHastag, 60000);
    } else {
      console.log('TWEET ' + tweet.id +  ' WAS REJECTED. CONTENT WAS:\n' + tweet.text + '\nWAITING FOR NEXT TWEET.');
    }

  });
}

function isOriginalMedia(data) {
  if (data['extended_entities']) { if (data['extended_entities']['media']) { if (data['extended_entities']['media'][0]) { return data.entities.media } } }
}

function retweetThis(toTweetID) {
  T.post('statuses/retweet/:id', { id: toTweetID }, function(err, data, response) {
    console.log('TWEET ' + toTweetID + ' HAS BEEN RETWEETED');
  });
}

streamHastag();
