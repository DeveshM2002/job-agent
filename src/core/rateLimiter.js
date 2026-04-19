function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rateLimitedLoop(items, fn, delayMs = 1000) {
    for (const item of items) {
        await fn(item);
        await delay(delayMs);
    }
}

module.exports = { rateLimitedLoop };