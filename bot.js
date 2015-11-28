var Twit = require('twit');
var T = new Twit(require('./twitter_config'));

var Ritetag = require('ritetag');
var rt = new Ritetag(require('./ritetag_config'));

var activeHashtag = '#blacklivesmatter';
var toTweet;

//upon call, listen for statuses with hastag
function streamHastag() {
  var stream = T.stream('statuses/filter', { track: activeHashtag, language: 'en' });

  stream.on('tweet', function(tweet) {

    if (isOriginalMedia(tweet)) {
      console.log('\n\n' + tweet.text + '\n\n');
      toTweet = tweet.id_str;
      setTimeout(retweetThis, 10000);

      // stop and start streamHastag again recursively after a minute (to maintain a max rate of ~1 tweet/min)
      stream.stop();
      console.log('PACING TWEET RATE');
      setTimeout(streamHastag, 60000);
    } else {
      console.log('TWEET ' + tweet.id +  ' WAS REJECTED');
    }
  });
}

function isOriginalMedia(data) {
  return ((data.text.substring(0, 2) != 'RT' || data.text.substring(0, 1) != '@') && (data.entities.media));
}

function retweetThis() {
  T.post('statuses/retweet/:id', { id: toTweet }, function(err, data, response) {
    console.log('TWEET ' + toTweet + ' HAS BEEN RETWETED');
  });
}

function getTrends() {
  rt.hashtagDirectory('blacklivesmatter', function(error, results) {
    if (error) return console.error(error);
    activeHashtag = '#' + results.data[1].tag; // get most hashtag with highest correlation to #blacklivesmatter
    console.log(activeHashtag + ' HAS BEEN SET AS THE ACTIVE HASHTAG');
  });

  setTimeout(getTrends, 30 * 60 * 1000); // update active hashtag every hour
}

getTrends();

streamHastag();
