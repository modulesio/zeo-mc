const url = require('url');

const config = require('../lib/config/index.js').get();
const SiteImporter  = require('../lib/site-importer');

const siteImporter = new SiteImporter({
  dataDirectory: config.dataDirectory
});

const routes = [
  {
    path: '/',
    handler: function(req, res) {
      const parsedUrl = url.parse(req.url, true);
      const query = parsedUrl.query;
      const url = query.url;

      if (url) {
        const name = rng.generate();
        siteImporter.import({url, name}, function(err) {
          if (!err) {
            res.json({
              world: name
            });
          } else {
            res.send(500);

            console.warn(err);
          }
        });
      } else {
        res.send(400);
      }
    }
  }
];

module.exports = routes;