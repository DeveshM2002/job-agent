const axios = require("axios");
const cheerio = require("cheerio");

async function fetchDescription(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let desc = $(".content, .description, #content").text();

        return desc.replace(/\s+/g, " ").trim().slice(0, 5000);
    } catch {
        return "";
    }
}

module.exports = fetchDescription;