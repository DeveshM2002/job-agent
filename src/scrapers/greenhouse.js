const { chromium } = require("playwright");

async function scrapeGreenhouse(company) {
    const url = `https://boards.greenhouse.io/${company}`;
    let jobs = [];

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30000
        });

        // scroll to load lazy content
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await page.waitForTimeout(2000);

        // extract ALL links
        const elements = await page.$$eval("a", links =>
            links.map(link => ({
                title: link.innerText.trim(),
                href: link.getAttribute("href")
            }))
        );

        // filter only real job links
        jobs = elements
            .filter(job => {
                if (!job.href || !job.title) return false;

                const href = job.href.toLowerCase();
                const title = job.title.toLowerCase();

                // must be actual job link
                if (!href.includes("/jobs/")) return false;

                // remove navigation / garbage
                if (title.includes("department")) return false;
                if (title.includes("office")) return false;
                if (title.includes("team")) return false;
                if (title.length < 5) return false;

                return true;
            })
            .map(job => ({
                title: job.title,
                link: job.href.startsWith("http")
                    ? job.href
                    : "https://boards.greenhouse.io" + job.href,
                location: "",
                company,
                description: "",
                posted_at: null,
                source: "greenhouse"
            }));
        jobs = jobs.slice(0, 60);
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