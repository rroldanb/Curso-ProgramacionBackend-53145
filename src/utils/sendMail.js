
const nodemailer = require('nodemailer');
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
 
const sendEmail = async () => {
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

module.exports = { transport, sendEmail };
