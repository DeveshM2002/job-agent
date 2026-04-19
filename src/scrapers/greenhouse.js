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

        $(".opening a").each((_, el) => {
            const title = $(el).text().trim();
            const href = $(el).attr("href");

            if (
                href &&
                title &&
                title.length > 5 &&
                href.startsWith("/jobs/")
            ) {
                jobs.push({
                    title,
                    link: "https://boards.greenhouse.io" + href,
                    location: "",
                    company,
                    description: "",
                    posted_at: null,
                    source: "greenhouse"
                });
            }
        });

        console.log(`Greenhouse: ${company} → ${jobs.length}`);
        return jobs;

    } catch (err) {
        console.log(`Greenhouse error: ${company}`, err.message);
        return [];
    }
}

module.exports = scrapeGreenhouse;