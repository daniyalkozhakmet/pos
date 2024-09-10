import * as Mailjet from "node-mailjet";
import { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC } from ".";

export class Mailer {
  mailjet: Mailjet.Email.Client;

  constructor() {
    // Use Mailjet.apiConnect() to create the client instance
    this.mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  }

  async SendVerificationCode(to: string, code: number) {
    const request = this.mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "daniyalkozhakmetov@gmail.com", // Your verified sender email
            Name: "STORE",
          },
          To: [
            {
              Email: to, // Recipient email
              Name: "Hey",
            },
          ],
          Subject: `Your Verification Code: ${code}`, // Subject of the email
          HTMLPart: `<h1>Your Verification Code is: ${code}</h1>`, // HTML content with code
        },
      ],
    });

    try {
      const response = await request;
      console.log(response.body);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error.response.body);
    }
  }
}
