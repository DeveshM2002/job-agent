const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeGreenhouse(company) {
    const url = `https://boards.greenhouse.io/${company}`;
    let jobs = [];

    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept-Language": "en-US,en;q=0.9"
            },
            timeout: 10000
        });

        const $ = cheerio.load(data);

        // 🔥 Robust extraction (instead of broken .opening selector)
        $("a").each((_, el) => {
            const href = $(el).attr("href");
            const title = $(el).text().trim();

            if (
                href &&
                href.includes("/jobs/") &&
                title &&
                title.length > 3
            ) {
                jobs.push({
                    title,
                    link: "https://boards.greenhouse.io" + href,
                    location: "", // location extraction is unreliable here
                    company,
                    description: "", // skip for now (stability)
                    posted_at: null,
                    source: "greenhouse"
                });
            }
        });

        // 🔥 Remove duplicates inside same page
        const seen = new Set();
        jobs = jobs.filter(job => {
            if (seen.has(job.link)) return false;
            seen.add(job.link);
            return true;
        });

        console.log(`Greenhouse: ${company} → ${jobs.length}`);
        return jobs;

    } catch (err) {
        console.log(`Greenhouse error: ${company}`, err.message);
        return [];
    }
}

module.exports = scrapeGreenhouse;