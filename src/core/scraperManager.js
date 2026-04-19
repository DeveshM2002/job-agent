const fs = require("fs");
const path = require("path");

const scrapeGreenhouse = require("../scrapers/greenhouse");
const normalizeJob = require("./normalizer");
const insertJob = require("./deduplicator");
const { rateLimitedLoop } = require("./rateLimiter");

const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../config/companies.json"))
);

async function runScrapers() {
    if (config.greenhouse && config.greenhouse.length > 0) {
        await rateLimitedLoop(config.greenhouse, async (company) => {

            const jobs = await scrapeGreenhouse(company);

            if (!jobs || jobs.length === 0) {
                console.log(`No jobs for ${company}`);
                return;
            }

            for (const job of jobs) {
                if (!job.title || job.title.length < 5) continue;
                if (!job.link || !job.link.startsWith("http")) continue;

                const normalized = normalizeJob(job);
                await insertJob(normalized);
            }
        });
    }

    console.log("Scraping complete");
}

module.exports = runScrapers;