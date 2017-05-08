const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY_SECRET);

const createTestAccount = () => {
    const email = 'bob@bookenda.com';

    console.log(`creating an account for ${email}`);

    return stripe.account.create({
        managed: true,
        country: 'CA',
        email,
    });
};

const createCustomer = (token) => {
    console.log(`creating a customer with this token: ${token}`);

    return stripe.customers.create({
        source: token,
        description: 'restaurant customer',
    });
};

const chargeCustomer = (customer, amount) => {
    console.log(`charging customer ${customer.id}`);

    return createTestAccount()
    .then(account => {
        return stripe.charges.create({
            amount,
            currency: 'cad',
            customer: customer.id,
            destination: account.id,
            application_fee: 299,
            source: customer.default_source,
            description: 'example charge',
        });
    });
};

module.exports.createCustomer = createCustomer;
module.exports.chargeCustomer = chargeCustomer;

