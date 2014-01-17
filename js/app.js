(function () {

  var defaultHubs= [
    'google',
    'apple',
    'apps',
    'gaming',
    'mobile',
    'policy'
  ];

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
    
    find: function(hub){
      if (hub) {
        return getRSS("http://www.theverge.com/" + hub + "/rss/index.xml");
      } else {
        return getRSS("http://www.theverge.com/rss/index.xml");
      }
    },

    listHubs: function(){
      var hubs = Em.A();
      defaultHubs.forEach(function (id) {
        hubs.pushObject(id);
      });
      return hubs;
    }

  })

  // Routes 
  EmberVerge.Router.map(function() {
    this.resource("links", { path: "/:hub_id" });
  });

  EmberVerge.LinksRoute = Ember.Route.extend({
    model: function(params) {
      return EmberVerge.Hubs.find(params.hub_id);
    }
  });

  EmberVerge.ApplicationRoute = Ember.Route.extend({
    setupController: function(applicationController) {
      applicationController.set('hubs', EmberVerge.Hubs.listHubs());
    }
  });

  EmberVerge.IndexRoute = Ember.Route.extend({
    redirect: function() {
      this.transitionTo('links', '');
    }
  });

  EmberVerge.LoadingRoute = Ember.Route.extend({});

  Ember.Handlebars.registerBoundHelper('getImageSrc', function(content) {
    var result = '<img class="media-object" ' + content.match(/src="([^\"]*)"/gim) + ' width="100"/>';
    return new Handlebars.SafeString(result);
  });

})();