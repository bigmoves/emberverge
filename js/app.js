//var feed = "http://www.theverge.com/rss/index.xml";

(function () {

  var getRSS = function(link) {

    var promise = new Ember.RSVP.Promise(function(resolve, reject){
      google.load("feeds", "1", {"callback" : handler});

      function handler() {
        var feed = new google.feeds.Feed(link);
        feed.includeHistoricalEntries();
        feed.setNumEntries(30);

        feed.load(function(result) {
          if (!result.error) {
            var links = [];

            result.feed.entries.forEach(function (entry) {
              links.push(entry);
            });

            resolve(links);
          }
        });
      }
    });

    return promise;
  }

  EmberVerge = Ember.Application.create();

  EmberVerge.Hubs = Ember.Object.extend();

  EmberVerge.Hubs.reopenClass({

    findAll: function(hub){
      return getRSS("http://www.theverge.com/rss/index.xml");
    },

    findByHub: function(hub){
      return getRSS("http://www.theverge.com/" + hub + "/rss/index.xml");
    }

  })

  // Routes below
  EmberVerge.Router.map(function() {
    this.resource("links", { path: "/" });
  });

  EmberVerge.LinksRoute = Ember.Route.extend({
    model: function() {
      return EmberVerge.Hubs.findAll();
    }
  });

  EmberVerge.LoadingRoute = Ember.Route.extend({});

  Ember.Handlebars.registerBoundHelper('getImageSrc', function(content) {
    //var src = content.match(/src="([^\"]*)"/gim);
    //src.toString().replace(/src=|"/gim, "");
    var result = '<img class="media-object" ' + content.match(/src="([^\"]*)"/gim) + ' width="100"/>';
    return new Handlebars.SafeString(result);
  });

})();