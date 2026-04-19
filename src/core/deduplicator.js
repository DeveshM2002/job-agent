const db = require("../db/db");

function insertJob(job) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT OR IGNORE INTO jobs
            (title, company, location, link, description, posted_at, source)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                job.title,
                job.company,
                job.location,
                job.link,
                job.description,
                job.posted_at,
                job.source
            ],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

module.exports = insertJob;