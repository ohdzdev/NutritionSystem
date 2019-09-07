const start = new Date();

const { parse } = require("url");
const next = require("next");

const backend = require("./zoo_api");

const dev = process.env.NODE_ENV !== "production";

const frontend = next({ dev: false, dir: "./zoo_frontend" });

const handle = frontend.getRequestHandler();

const router = backend.loopback.Router();

frontend.prepare().then(() => {
  // Custom routes
  router.get(/^\/((?!api).)*(\/.*)?$/, (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  backend.use(router);

  backend.start();
});
