const fs = require("fs");
const path = require("path");

const scrapeGreenhouse = require("../scrapers/greenhouse");
const scrapeLever = require("../scrapers/lever");

const normalizeJob = require("./normalizer");
const insertJob = require("./deduplicator");
const { rateLimitedLoop } = require("./rateLimiter");

const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../config/companies.json"))
);

async function runScrapers() {
    // Greenhouse
    await rateLimitedLoop(config.greenhouse, async (company) => {
        const jobs = await scrapeGreenhouse(company);
        if (!jobs || jobs.length === 0) return;

        for (const job of jobs) {
            const normalized = normalizeJob(job);
            await insertJob(normalized);
        }
    });

    // Lever
    if (config.lever && config.lever.length > 0) {
        await rateLimitedLoop(config.lever, async (company) => {
            const jobs = await scrapeLever(company);

            for (const job of jobs) {
                const normalized = normalizeJob(job);
                await insertJob(normalized);
            }
        });
    }

    console.log("Scraping complete");
}

module.exports = runScrapers;