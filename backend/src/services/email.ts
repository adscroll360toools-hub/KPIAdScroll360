import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.titan.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendTaskNotification = async (to: string, taskTitle: string, action: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("SMTP credentials not set. Mocking email delivery.");
        return;
    }

    const htmlTemplate = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
        <div style="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800;">AdScroll360</h1>
            <p style="color: #6b7280; margin-top: 5px; font-size: 14px;">WorkHub Notification</p>
          </div>
          
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <p style="margin: 0 0 10px 0; color: #374151; font-weight: 600;">A task requires your attention:</p>
            <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">${taskTitle}</h2>
            <div style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;">
              ${action}
            </div>
          </div>

          <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin-bottom: 30px;">
            Please log in to your dashboard to view more details, accept assignments, or modify the statuses for the project workflow.
          </p>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 6px;">Open Dashboard</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} AdScroll360. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
        from: `"AdScroll360" <noreply@adscroll360.com>`,
        to,
        subject: `Task Update: ${taskTitle}`,
        html: htmlTemplate,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending HTML email:', error);
    }
};
