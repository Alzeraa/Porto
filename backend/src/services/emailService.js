const { Resend } = require('resend');

// Initialize Resend client only if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Send notification email to admin
exports.sendContactNotification = async (contactData) => {
  if (!resend) {
    console.log('[EmailService] RESEND_API_KEY belum disetel di .env, notifikasi email dilewati.');
    return false;
  }
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'vaerann@gmail.com';
    
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Project Inquiry — ${contactData.name}`,
      html: `
        <h2>New Project Inquiry from ALZERA Contact Form</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Name</td><td style="padding:6px 12px;">${contactData.name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Business / Org</td><td style="padding:6px 12px;">${contactData.businessOrg || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Email</td><td style="padding:6px 12px;">${contactData.email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">WhatsApp</td><td style="padding:6px 12px;">${contactData.whatsapp || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Service Needed</td><td style="padding:6px 12px;">${contactData.service || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Budget Range</td><td style="padding:6px 12px;">${contactData.budgetRange || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Timeline</td><td style="padding:6px 12px;">${contactData.timeline || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;">Reference URL</td><td style="padding:6px 12px;">${contactData.referenceUrl || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;background:#f1f5f9;vertical-align:top;">Description</td><td style="padding:6px 12px;">${contactData.message}</td></tr>
        </table>
      `,
    });
    
    console.log('Notification email sent');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send thank you email to user
exports.sendThankYouEmail = async (userEmail, userName) => {
  if (!resend) {
    return false;
  }
  try {
    await resend.emails.send({
      from: 'Alvaeryn Portfolio <onboarding@resend.dev>',
      to: userEmail,
      subject: 'Terima Kasih Telah Menghubungi Kami',
      html: `
        <h2>Halo ${userName},</h2>
        <p>Terima kasih telah menghubungi saya! Pesan Anda telah saya terima.</p>
        <p>Saya akan segera menghubungi Anda kembali secepatnya.</p>
        <p>Salam hangat,<br>Alvaeryn</p>
      `
    });
    
    console.log('Thank you email sent');
    return true;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return false;
  }
};
