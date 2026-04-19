const axios = require("axios");

async function scrapeLever(company) {
    const url = `https://api.lever.co/v0/postings/${company}?mode=json`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const jobs = data.map(job => ({
            title: job.text,
            company,
            location: job.categories?.location || "",
            link: job.hostedUrl,
            description: job.descriptionPlain || "",
            posted_at: job.createdAt || null,
            source: "lever"
        }));

        console.log(`Lever: ${company} → ${jobs.length}`);
        return jobs;

    } catch (err) {
          console.log(`Greenhouse error: ${company}`, err.message);
          return [];
      }
}

module.exports = scrapeLever;