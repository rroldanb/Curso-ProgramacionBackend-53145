
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

const resetEmail = async (userEmail, token) => {
    const resetUrl = `${objectConfig.app_url}/reset-password?token=${token}`;

    return await transport.sendMail({
      from: 'RR_Ecommerce <ruben.roldan.b@gmail.com>',
      to: userEmail,
      subject: 'Restablecimiento de Contraseña',
      html: `<div>
        <h1 style="color: blue;">Restablecimiento de Contraseña</h1>
        <p>Hemos recibido tu solicitud de restablecimiento de contraseña</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">Restablecer Contraseña</a>
        <p style="color: red;">Este enlace expirará en 1 hora.</p>
        <p>Si ya no necesitas restablecer tu contraseña o no lo solicitaste puedes ignorar este mensaje</p>
      </div>`,
    });
  };

  const deleteProductEmail = async (userEmail, product) => {
    return await transport.sendMail({
      from: 'RR_Ecommerce <ruben.roldan.b@gmail.com>',
      to: userEmail,
      subject: 'Producto Eliminado',
      html: `
        <div>
          <h1 style="color: blue;">Notificación de eliminación de producto</h1>
          <p >
          El administrador del ecommerce ha eliminado un producto del cual eras el propietario</p>
          <p >
          El producto eliminado fue el siguiente:</p>
          <h3 >
          <strong style="color: green;">Nombre:</strong> ${product.title}</h3>
          <p >
          <strong style="color: green;">Descripción:</strong> ${product.description}</p>
          <p >
          <strong style="color: green;">Código:</strong> ${product.code}</p>
          <p >
          <strong style="color: green;">Categoría:</strong> ${product.category}</p>
        </div>
      `,
    });
  };

  const purchaseSuccess = async (userEmail, ticket) => {
    return await transport.sendMail({
      from: 'RR_Ecommerce <ruben.roldan.b@gmail.com>',
      to: userEmail,
      subject: 'Compra exitosa',
      html: `
        <div>
          <h1 style="color: blue;">Felicitaciones por tu compra en nuestro e-commerce</h1>
          <p >A continucaión el detalle de tu compra</p>
          <h3 >
          <strong style="color: green;">Código del ticket:</strong> 
          ${ticket.code}</h3>
          //aqui deberia agregar un for each, pero en html? como hago para inyectarle js aqui?
          <p >
          <strong style="color: green;">Nombre:</strong> 
          ${product.title}</p>
          <p >
          <strong style="color: green;">Descripción:</strong> 
          ${product.description}</p>
          <p >
          <strong style="color: green;">Código:</strong> 
          ${product.code}</p>
          <p >
          <strong style="color: green;">Categoría:</strong> 
          ${product.category}</p>
          <h3 >
          <strong style="color: green;">Total de tu compra:</strong> 
          ${ticket.amount}</h3>
        </div>
      `,
    });
  };
  
  

module.exports = { transport, testEmail, resetEmail , deleteProductEmail, purchaseSuccess};
