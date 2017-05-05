const express = require('express');
const hbs = require('hbs');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY_SECRET);
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index', {
        stripePublicSecret: process.env.STRIPE_PUBLIC_KEY_SECRET,
    });
});

app.get('/paysuccess', (req, res) => {
    res.send('success');
});

app.post('/charge', (req, res) => {
    const token = req.body.stripeToken;
    const chargeAmount = 2000;

    const charge = stripe.charges.create({
        amount: chargeAmount,
        currency: 'cad',
        source: token,
    }, (err, charge) => {
        if(err !== undefined && err !== null) {
            if(err.type === 'StripeCardError') {
                console.log('Card declined');
            }
            else {
                console.log(err);
            }
        }
        else {
            console.log('Payment processed successfully');
            res.redirect('/paysuccess');
        }
    });
});

app.listen(3000, () => {
    console.log('Stripe is running');
});
