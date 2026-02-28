import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: process.env.ARCJET_API_KEY,
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
        // Create a bot detection rule
        detectBot({
            mode: "DRY_RUN", // Log bot detections without blocking
            // Block all bots except the following (allow search engines)
            allow: [
                "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
                // Uncomment to allow other categories if needed
                //"CATEGORY:MONITOR", // Uptime monitoring services
                //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        // Token bucket rate limit – enforce limits in production
        slidingWindow({
            mode: "LIVE", // Enforce rate limiting
            // Tracked by IP address by default; customize via fingerprints if needed
            //characteristics: ["ip.src"],
            max: 5, // Allow 5 requests per interval
            interval: 30, // Interval in seconds (10‑second refill)
        }),
    ],
});

export default aj;