const runScrapers = require("./core/scraperManager");

(async () => {
    console.log("Starting job fetch...");
    await runScrapers();
    console.log("Done.");
})();