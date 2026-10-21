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
      subject: `Pesan Baru dari Portfolio - ${contactData.name}`,
      html: `
        <h2>Pesan Baru dari Portfolio</h2>
        <p><strong>Nama:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>WhatsApp:</strong> ${contactData.whatsapp || 'Tidak diisi'}</p>
        <p><strong>Layanan:</strong> ${contactData.service || 'Tidak diisi'}</p>
        <p><strong>Pesan:</strong></p>
        <p>${contactData.message}</p>
      `
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
