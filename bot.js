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

var activeHashtag = '#blacklivesmatter'; // Set a default hashtag value that is passed to Ritetag API

//Upon call, listen for statuses with hastag
function streamHastag() {
  var stream = T.stream('statuses/filter', { track: activeHashtag, language: 'en' });

  stream.on('tweet', function(tweet) {

    if (isOriginalMedia(tweet)) {
      console.log(tweet.text);
      setTimeout(function() {
        retweetThis(tweet.id_str);
      }, 10000);

      // Stop and start streamHastag again recursively after a minute (to maintain a max rate of ~1 tweet/min)
      stream.stop();
      console.log('PACING TWEET RATE');
      setTimeout(streamHastag, 1000);
    } else {
      console.log('TWEET ' + tweet.id +  ' WAS REJECTED');
    }

  });
}

function isOriginalMedia(data) {
  if (data['extended_entities']) { if (data['extended_entities']['media']) { if (data['extended_entities']['media'][0]) { return data['extended_entities']['media'][0]['video_info'] } } }
}

function retweetThis(toTweetID) {
  T.post('statuses/retweet/:id', { id: toTweetID }, function(err, data, response) {
    console.log('TWEET ' + toTweetID + ' HAS BEEN RETWEETED');
  });
}

function getTrends() {
  rt.hashtagDirectory('blacklivesmatter', function(error, results) {
    if (error) { return console.error(error) };
    activeHashtag = [ (results.data[0].tag), (results.data[1].tag) ]; // Get hashtag tuple
    activeHashtag.push('mariowoods', 'sandrabland', 'laquanmcdonald', 'kendrickjohnson', 'freddiegray') // Manual patch till NLP
    console.log(activeHashtag + ' HAS BEEN SET AS THE ACTIVE HASHTAG');
  });

  setTimeout(getTrends, 30 * 60 * 1000); // Update active hashtag every half hour
}

getTrends();
streamHastag();
