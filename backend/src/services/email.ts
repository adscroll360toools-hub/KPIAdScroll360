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

    const mailOptions = {
        from: `"AdScroll360" <noreply@adscroll360.com>`,
        to,
        subject: `Task Update: ${taskTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">WorkHub Task Notification</h2>
        <p>This is to inform you about a recent update on your task.</p>
        <p><strong>Task:</strong> ${taskTitle}</p>
        <p><strong>Action:</strong> ${action}</p>
        <p>Please log in to your dashboard to view more details.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>AdScroll360 Team</strong></p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
