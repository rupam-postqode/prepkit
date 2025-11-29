import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailData) {
  try {
    const fromEmail = from || 'PrepKit <welcome@prepkit.app>';

    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    });

    console.log('Email sent successfully:', result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Email Templates
export const emailTemplates = {
  welcome: (userName: string, pathTitle?: string) => ({
    subject: `Welcome to PrepKit, ${userName}! 🎯`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PrepKit</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; }
            .emoji { font-size: 2em; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="emoji">🎯</div>
            <h1>Welcome to PrepKit!</h1>
            <p>Your interview preparation journey starts now</p>
          </div>

          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Thank you for joining PrepKit! You're about to embark on an amazing journey to land your dream job at top tech companies.</p>

            ${pathTitle ? `
            <p><strong>You've enrolled in: ${pathTitle}</strong></p>
            <p>This structured learning path will guide you through everything you need to know for technical interviews.</p>
            ` : `
            <p>You can now access our comprehensive interview preparation content, including:</p>
            <ul>
              <li>📚 Data Structures & Algorithms</li>
              <li>🎯 Machine Coding Practice</li>
              <li>🏗️ System Design</li>
              <li>💬 Behavioral Interview Skills</li>
            </ul>
            `}

            <p>Ready to start learning? Your first lesson is waiting!</p>

            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Start Learning →</a>
          </div>

          <div class="footer">
            <p>Questions? Reply to this email or visit our <a href="${process.env.NEXTAUTH_URL}/support">help center</a>.</p>
            <p>© 2025 PrepKit. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  }),

  progressReminder: (userName: string, pathTitle: string, currentWeek: number, totalWeeks: number, completedLessons: number, totalLessons: number) => ({
    subject: `Keep going, ${userName}! Your progress is amazing 🚀`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Progress Update</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
            .progress-bar { background: #e5e7eb; border-radius: 10px; height: 20px; margin: 20px 0; overflow: hidden; }
            .progress-fill { background: linear-gradient(90deg, #10b981, #059669); height: 100%; border-radius: 10px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-number { font-size: 2em; font-weight: bold; color: #059669; }
            .stat-label { color: #666; font-size: 0.9em; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; }
            .emoji { font-size: 2em; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="emoji">🚀</div>
            <h1>Amazing Progress!</h1>
            <p>Keep up the great work, ${userName}!</p>
          </div>

          <div class="content">
            <h2>Your Learning Journey</h2>
            <p><strong>${pathTitle}</strong> - Week ${currentWeek} of ${totalWeeks}</p>

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(completedLessons / totalLessons * 100).toFixed(1)}%"></div>
            </div>

            <div class="stats">
              <div class="stat">
                <div class="stat-number">${completedLessons}</div>
                <div class="stat-label">Lessons Completed</div>
              </div>
              <div class="stat">
                <div class="stat-number">${Math.round(completedLessons / totalLessons * 100)}%</div>
                <div class="stat-label">Progress</div>
              </div>
              <div class="stat">
                <div class="stat-number">${totalLessons - completedLessons}</div>
                <div class="stat-label">Lessons Left</div>
              </div>
            </div>

            <p>You're doing fantastic! Consistency is key to interview success. Keep this momentum going!</p>

            <p><strong>Next steps:</strong></p>
            <ul>
              <li>Complete your current week's lessons</li>
              <li>Practice the recommended LeetCode problems</li>
              <li>Review your weak areas</li>
            </ul>

            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Continue Learning →</a>
          </div>

          <div class="footer">
            <p>Need help? Reply to this email or visit our <a href="${process.env.NEXTAUTH_URL}/support">help center</a>.</p>
            <p>© 2025 PrepKit. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  }),

  milestoneCelebration: (userName: string, milestone: string, pathTitle: string) => ({
    subject: `Congratulations, ${userName}! ${milestone} 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Milestone Achieved!</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
            .celebration { font-size: 4em; margin-bottom: 20px; }
            .button { display: inline-block; background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="celebration">🎉</div>
            <h1>Milestone Achieved!</h1>
          </div>

          <div class="content">
            <h2>Congratulations, ${userName}!</h2>
            <p>You've reached an amazing milestone:</p>
            <h3 style="color: #d97706; font-size: 1.5em; margin: 20px 0;">${milestone}</h3>
            <p>in your <strong>${pathTitle}</strong> learning journey!</p>

            <p>This is a significant achievement that brings you closer to your dream job. Keep up the incredible work!</p>

            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Continue Your Journey →</a>
          </div>

          <div class="footer">
            <p>Share your success with friends! #PrepKitJourney</p>
            <p>© 2025 PrepKit. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  }),
};

// Email sending functions
export async function sendWelcomeEmail(email: string, userName: string, pathTitle?: string) {
  const template = emailTemplates.welcome(userName, pathTitle);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendProgressReminder(email: string, userName: string, pathTitle: string, currentWeek: number, totalWeeks: number, completedLessons: number, totalLessons: number) {
  const template = emailTemplates.progressReminder(userName, pathTitle, currentWeek, totalWeeks, completedLessons, totalLessons);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendMilestoneCelebration(email: string, userName: string, milestone: string, pathTitle: string) {
  const template = emailTemplates.milestoneCelebration(userName, milestone, pathTitle);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}
