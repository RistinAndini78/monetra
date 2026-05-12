/**
 * Email Service using Resend API
 * To make this fully functional, add VITE_RESEND_API_KEY to your .env file
 */

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

class EmailService {
  /**
   * Send a payment confirmation email
   */
  static async sendPaymentConfirmation(to: string, data: { billName: string; amount: number; date: string }) {
    if (!RESEND_API_KEY) {
      console.warn("Email tidak terkirim: VITE_RESEND_API_KEY belum diatur di .env");
      return { success: false, message: "API Key missing" };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Monetra <onboarding@resend.dev>',
          to: [to],
          subject: `✅ Pembayaran Berhasil: ${data.billName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #7c3aed; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Monetra</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #1f2937;">Konfirmasi Pembayaran</h2>
                <p>Halo,</p>
                <p>Pembayaran tagihan Anda telah berhasil dicatat oleh sistem.</p>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%;">
                    <tr>
                      <td style="color: #6b7280; font-size: 14px;">Tagihan</td>
                      <td style="text-align: right; font-weight: bold;">${data.billName}</td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px;">Jumlah</td>
                      <td style="text-align: right; font-weight: bold; color: #ef4444;">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}</td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px;">Tanggal</td>
                      <td style="text-align: right; font-weight: bold;">${data.date}</td>
                    </tr>
                  </table>
                </div>
                <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
                  Email ini dikirim secara otomatis, mohon tidak membalas email ini.
                </p>
              </div>
            </div>
          `,
        }),
      });

      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      console.error("Gagal mengirim email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send a bill reminder email
   */
  static async sendBillReminder(to: string, data: { billName: string; dueDate: string; amount: number }) {
    if (!RESEND_API_KEY) return;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Monetra <onboarding@resend.dev>',
          to: [to],
          subject: `⚠️ Pengingat Tagihan: ${data.billName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Jangan Lupa Bayar Tagihan Anda!</h2>
              <p>Tagihan <strong>${data.billName}</strong> akan jatuh tempo pada <strong>${data.dueDate}</strong>.</p>
              <p>Segera lakukan pembayaran untuk menghindari denda atau gangguan layanan.</p>
              <br/>
              <a href="https://monetra.id" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Buka Aplikasi</a>
            </div>
          `,
        }),
      });
    } catch (err) {
       console.error("Reminder email failed", err);
    }
  }
}

export default EmailService;
