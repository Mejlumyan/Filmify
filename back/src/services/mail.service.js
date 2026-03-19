const transporter = require('../config/mail')
const env = require('../config/env');

const sendWelcomeEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: env.mail.from,
      to: to,
      subject: 'Բարի գալուստ Cinematic!',
      html: `
        <div style="background-color: #141414; color: white; padding: 20px; font-family: sans-serif; text-align: center;">
          <h1 style="color: #e50914;">CinemaTic</h1>
          <h2>Ողջույն, ${name}</h2>
          <p>Շնորհակալություն գրանցվելու համար։ Այժմ կարող եք դիտել լավագույն ֆիլմերը մեր հարթակում։</p>
          <a href="${env.clientUrl}" style="background-color: #e50914; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Անցնել կայք</a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Նամակը հաջողությամբ ուղարկվեց: ${to}`);
  } catch (error) {
    console.error('❌ Նամակի սխալ:', error.message);
  }
};

const sendPasswordResetEmail = async (to, name, resetCode) => {
  try {
    const mailOptions = {
      from: env.mail.from,
      to: to,
      subject: 'Գաղտնաբառ վերակայել - Filmify',
      html: `
        <div style="background-color: #141414; color: white; padding: 30px; font-family: Arial, sans-serif; text-align: center; border-radius: 10px;">
          <h1 style="color: #f5f505; margin-bottom: 20px;">FILMIFY</h1>
          <h2 style="color: white;">Գաղտնաբառի վերակայում</h2>
          <p style="font-size: 16px; margin: 20px 0;">Ողջույն, ${name}</p>
          <p style="font-size: 14px; color: #ccc; margin: 20px 0;">Եթե դուք հայտնի չեք այս요청ը, խնդրում ենք անտեսել այս նամակը:</p>
          
          <div style="background-color: #f5f505; color: #111; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="font-size: 12px; margin: 0;">Ձեր վերակայման կոդ:</p>
            <p style="font-size: 32px; font-weight: bold; margin: 10px 0; letter-spacing: 3px;">${resetCode}</p>
          </div>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">Այս կոդը կգործում է 30 րոպե:</p>
          <p style="font-size: 12px; color: #999;">Եթե ունեք հարցեր, գրեք support@filmify.am</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Գաղտնաբառի վերակայման նամակ ուղարկվեց: ${to}`);
  } catch (error) {
    console.error('❌ Նամակի սխալ:', error.message);
    throw error;
  }
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };