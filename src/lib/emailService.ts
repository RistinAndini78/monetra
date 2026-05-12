/**
 * Email Service - Menggunakan Supabase Edge Function sebagai perantara
 * agar email bisa terkirim tanpa masalah CORS dari browser.
 */

import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

class EmailService {
  private static async sendViaEdgeFunction(to: string, subject: string, html: string) {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: { to, subject, html },
      });

      if (error) throw error;
      console.log("✅ Email terkirim via Edge Function:", data);
      return { success: true, data };
    } catch (err) {
      console.error("❌ Gagal kirim email:", err);
      return { success: false, error: err };
    }
  }

  /**
   * Kirim email konfirmasi pembayaran tagihan
   */
  static async sendPaymentConfirmation(to: string, data: { billName: string; amount: number; date: string }) {
    const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">💜 Monetra</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Manajemen Keuangan Pribadi</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1f2937; margin-top: 0;">✅ Pembayaran Berhasil!</h2>
          <p style="color: #6b7280;">Berikut adalah detail pembayaran tagihan Anda:</p>
          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Nama Tagihan</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #111827;">${data.billName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Jumlah</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #ef4444; font-size: 18px;">
                  ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.amount)}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Tanggal Bayar</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #111827;">${data.date}</td>
              </tr>
            </table>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">Email ini dikirim otomatis oleh Monetra. Mohon tidak membalas email ini.</p>
        </div>
      </div>
    `;
    return this.sendViaEdgeFunction(to, `✅ Pembayaran Berhasil: ${data.billName}`, html);
  }

  /**
   * Kirim email pengingat tagihan jatuh tempo
   */
  static async sendBillReminder(to: string, data: { billName: string; dueDate: string; amount: number }) {
    const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fde68a; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">⚠️ Monetra</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Pengingat Tagihan Jatuh Tempo</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #92400e; margin-top: 0;">Tagihan Anda Jatuh Tempo ${data.dueDate}!</h2>
          <p style="color: #6b7280;">Jangan lupa untuk segera melakukan pembayaran:</p>
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Nama Tagihan</p>
            <p style="margin: 0 0 16px; font-size: 22px; font-weight: 900; color: #1f2937;">${data.billName}</p>
            <p style="margin: 0 0 8px; font-size: 14px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Jumlah</p>
            <p style="margin: 0; font-size: 28px; font-weight: 900; color: #d97706;">
              ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.amount)}
            </p>
          </div>
          <a href="https://monetra-ten.vercel.app" 
             style="display: block; background: #7c3aed; color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">
            Buka Monetra & Bayar Sekarang →
          </a>
        </div>
      </div>
    `;
    return this.sendViaEdgeFunction(to, `⚠️ Tagihan "${data.billName}" Jatuh Tempo ${data.dueDate}!`, html);
  }
}

export default EmailService;
