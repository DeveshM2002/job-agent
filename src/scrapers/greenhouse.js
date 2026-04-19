const { chromium } = require("playwright");

async function scrapeGreenhouse(company) {
    const url = `https://boards.greenhouse.io/${company}`;
    let jobs = [];

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000
        });

        // wait a bit to ensure page loads fully
        await page.waitForTimeout(3000);

        // 🔥 universal selector (works across most greenhouse boards)
        const elements = await page.$$eval("a[href*='/jobs/']", links =>
            links.map(link => ({
                title: link.innerText.trim(),
                href: link.getAttribute("href")
            }))
        );

        // filter + clean
        jobs = elements
            .filter(job =>
                job.href &&
                job.href.startsWith("/jobs/") &&
                job.title &&
                job.title.length > 5
            )
            .map(job => ({
                title: job.title,
                link: "https://boards.greenhouse.io" + job.href,
                location: "",
                company,
                description: "",
                posted_at: null,
                source: "greenhouse"
            }));

        // remove duplicates
        const seen = new Set();
        jobs = jobs.filter(job => {
            if (seen.has(job.link)) return false;
            seen.add(job.link);
            return true;
        });

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