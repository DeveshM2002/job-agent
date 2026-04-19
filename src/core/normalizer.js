function normalizeJob(job) {
    return {
        ...job,
        title: job.title?.trim(),
        company: job.company?.toLowerCase(),
        location: job.location?.trim(),
        description: job.description?.replace(/\s+/g, " ").trim()
    };
}

module.exports = normalizeJob;