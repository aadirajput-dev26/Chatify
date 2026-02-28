import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js"

export const sendWelcomeEmail = async (name, email) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatify",
        html: createWelcomeEmailTemplate(name),
    });

    if (error) {
        console.log("Error sending emails", error);
        throw new Error("Failed to send welcome email");

    }

    console.log("Welcome mail sent successfully", data);
}  