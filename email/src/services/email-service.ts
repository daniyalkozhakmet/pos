import { Mailer } from "../config/email-transporter";

export class EmailService {
  mailer: Mailer;
  constructor() {
    this.mailer = new Mailer();
  }
  async VerifyEmail(data: { email: string; verification_code: number }) {
    const { email, verification_code } = data;
    await this.mailer.SendVerificationCode(email, verification_code);
  }
  async ForgotPassword(data: { email: string; verification_code: number }) {
    const { email, verification_code } = data;
    await this.mailer.SendVerificationCode(email, verification_code);
  }
  async SubscribeEvents(payload: any) {
    console.log("Triggering.... User Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    switch (event) {
      case "VERIFY_EMAIL":
        this.VerifyEmail(data);
        break;
      case "FORGOT_PASSWORD":
        this.ForgotPassword(data);
        break;
    }
  }
}
