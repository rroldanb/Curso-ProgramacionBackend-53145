const Stripe = require('stripe')
const { objectConfig } = require('../config/config')

class PaymentService{
    constructor(){
        this.stripe = new Stripe(objectConfig.stripe_secret_key)
    }

    createPaymentIntent = async data =>{
        const paymentIntent = await this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}

module.exports = {PaymentService}