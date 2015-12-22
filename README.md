### December 5th, 2015

Visual Decolonization :fist:
=============

### Visual Decolonization would involve a network of open-source technologies that empower young people who inspire change through the *#BlackLivesMatter* and other social justice movements. The VD Twitter bot and VD_Map web application are examples of such technologies.

### As of now, the Visual Decolonization Twitter bot patches into the Ritetag API to poll for highest correlated hashtags to *#BlackLivesMatter*, then streams media-rich Tweets from the Twitter Streaming API with these hashtag. The end goal is a stream of pictures, videos, vines, and other media that is delivered from people on the ground and independent of traditional news sources. Right now, it simply retweets matched tweets but ultimately we want it to extract and transform location data so as feed that data to the VD_Map API. Other features to ship:

* #### Discerns if a protest event is occurring by analyzing conversational and general Tweet text in bulk.

* #### Streams social media content from strictly from these live protest location(s).

* #### Bots for combing [Instagram](https://www.instagram.com/developer/), [Facebook](https://developers.facebook.com/docs/graph-api/using-graph-api/v2.5) (Graph and Public Feed APIs) and [Periscope](https://medium.com/@matteocontrini/how-to-use-the-public-periscope-stream-api-8dfedc7fe872#.c4luyaxwc) so as to write data to VD_Map API (either locations or original content).

* #### A live dashboard that aggregates data and media from bot-curated social media streams. It is composed mainly of real-time data visualizations that attempt to situate events in larger policy and socioeconomic contexts:

  * A map of the United States live-plotted (like the [Norse Attack Map](http://map.norsecorp.com/)) with coordinates of location data scraped by suite of social media data collection bots. Each coordinate point shown is embedded with Tweet or Instagram content.
  * Overlay heat-map of US with interactive data characteristics of that location. Similar to these political [US maps](http://www.nytimes.com/interactive/2014/11/04/upshot/senate-maps.html?_r=0).
  * Live-updated and interactive charts and graphs of analysis of data scraped by bots.
  * Textual analysis: summarizes what people are talking about in respect to given events.
  * Node to the past: visualize interactive timelines of key civil rights wins and losses.

The VD_Map stack :wrench:
===============

### We may be able to achieve most of these goals by having bots all write a homogenous JSON object with broad metadata to the VD_Map API. Then implement a separations of concerns to deal with different domains in the JSON object. For example, location metadata goes to the VD_Map US map to be live-plotted, text content to the natural-language processing factory to generate insights like sentiments, subject matter around given hashtags, and so on.

### Thus, the specific technologies to code up this project can involve:

* Building out of a RESTful VD API that bots are able to POST to.
* Using D3.js to power data-visualizations, including topoJSON to create maps.
* NaturalNode for natural language processing, results feed into data-visualizations.
* MongoDB to provide persistence.
* SASS and React.js for implementing views.
