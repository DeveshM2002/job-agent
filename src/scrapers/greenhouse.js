const { chromium } = require("playwright");

async function scrapeGreenhouse(company) {
    const url = `https://boards.greenhouse.io/${company}`;
    let jobs = [];

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

        // wait for jobs to load
        await page.waitForSelector(".opening a", { timeout: 10000 });

        const elements = await page.$$eval(".opening a", links =>
            links.map(link => ({
                title: link.innerText.trim(),
                href: link.getAttribute("href")
            }))
        );

        jobs = elements
            .filter(job => job.href && job.title.length > 5)
            .map(job => ({
                title: job.title,
                link: "https://boards.greenhouse.io" + job.href,
                location: "",
                company,
                description: "",
                posted_at: null,
                source: "greenhouse"
            }));

        console.log(`Greenhouse: ${company} → ${jobs.length}`);

        await browser.close();
        return jobs;

    } catch (err) {
        console.log(`Greenhouse error: ${company}`, err.message);
        await browser.close();
        return [];
    }
}

module.exports = scrapeGreenhouse;