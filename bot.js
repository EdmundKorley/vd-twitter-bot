var Twit = require('twit');
var T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret:process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

var Ritetag = require('ritetag');
var rt = new Ritetag({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  oauthToken: process.env.oauthToken,
  oauthSecret: process.env.oauthSecret,
});

var activeTracks = 'mikebrown';

//Upon call, listen for statuses with hastag
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

function getTrends() {
  rt.hashtagDirectory('blacklivesmatter', function(error, results) {
    if (error) { return console.error(error) };
    // activeTracks = [ (results.data[1].tag), (results.data[1].tag), (results.data[2].tag) ]; // Get hashtag triplet from RiteTag. Table till better content filtering
    activeTracks.push('tamirrice', 'mariowoods', 'sandrabland', 'laquanmcdonald', 'kendrickjohnson', 'BrandonTateBrown', 'freddiegray', 'VonDerritMyers', 'portertrial', 'williamporter') // Manual patch till NLP
    console.log(activeTracks + ' HAS BEEN SET AS THE ACTIVE TRACKS');
  });

  setTimeout(getTrends, 30 * 60 * 1000); // Update active tracks every half hour
}

getTrends();
streamHastag();
