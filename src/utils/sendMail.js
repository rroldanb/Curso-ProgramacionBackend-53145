
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const {objectConfig} = require('../config/config');

const { gmail_user, gmail_pass } = objectConfig;

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: gmail_user,
        pass: gmail_pass
    }
});
 
const testEmail = async () => {
    return await transport.sendMail({
        from: 'Coder test <ruben.roldan.b@gmail.com>',
        // to: 'projectodigitalgen@gmail.com',
        to: gmail_user,
        subject: 'Test email',
        html: `<div>
        <h1> Email de prueba </h1>
        </div>`,
        attachments: [{
            filename: 'nike.ar.jpeg',
            path: './src/public/images/nike.ar.jpeg',
            cid: 'nike'
        }]
    });
};

const sendResetEmail = async (userEmail, token) => {
    const resetUrl = `http://localhost:8080/reset-password?token=${token}`;
    return await transport.sendMail({
      from: 'RR_Ecommerce <ruben.roldan.b@gmail.com>',
      to: userEmail,
      subject: 'Restablecimiento de Contraseña',
      html: `<div>
        <h1>Restablecimiento de Contraseña</h1>
        <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
        <a href="${resetUrl}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      </div>`,
    });
  };

module.exports = { transport, testEmail, sendResetEmail };
