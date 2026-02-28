import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isBot) {
                return res.status(403).json({ message: "Forbidden: Bot detected" });
            } else
                if (decision.reason.isRateLimit()) {
                    return res.status(429).json({ message: "Rate limit has been exceeded. Please try again later." });
                }
                else {
                    return res.status(403).json({ message: "Forbidden: Request blocked due to security reasons" });
                }
        }

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected. Request blocked due to security reasons"
            })
        }

        next();
    } catch (error) {
        console.log("Error in arcjet middleware", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}