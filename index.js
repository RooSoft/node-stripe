const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const path = require('path');

const stripe = require('./lib/stripe');

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

app.post('/chargeExistingCustomer', (req, res) => {
    const amount = 2000;
    const customerId = 'cus_AcSLxr53OLTKCD';

    stripe.loadCustomer(customerId)
    .then(customer => {
        console.log(`customer loaded: ${customer.id}`);
        return stripe.chargeCustomer(customer, amount);
    })
    .then(charge => {
        console.log(`charge applied ${charge.id}`);
        res.redirect('/paysuccess');
    })
    .catch(error => {
        console.log(error);
    });
});

app.post('/chargeNewCustomer', (req, res) => {
    const amount = 2000;

    console.log('------body------');
    console.dir(req.body);

    stripe.createCustomer(req.body.stripeToken)
    .then(customer => {
        console.log(`customer created: ${customer.id}`);
        return stripe.chargeCustomer(customer, amount);
    })
    .then(charge => {
        console.log(`charge applied ${charge.id}`);
        res.redirect('/paysuccess');
    })
    .catch(error => {
        console.log(error);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Stripe is running on port ${port}`);
});

