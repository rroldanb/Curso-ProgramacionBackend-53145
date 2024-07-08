const { Router } = require('express');
const { sendEmail } = require('../../utils/sendMail');
const { authorization } = require('../../middlewares/auth.middleware')

const mailRouter = Router();

mailRouter.get('/', authorization(['admin']), async (req, res) => {
    
    try {
        await sendEmail();
        res.status(200).send('Email enviado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al enviar el email');
    }
});

module.exports = mailRouter;
