//  key_id: 'rzp_test_73fFNe1fHnCy3d',
//     key_secret: 'V2U0zsZ8i45VO9QA1hUsPix9'

const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const razorpay = new Razorpay({
    key_id: 'rzp_test_73fFNe1fHnCy3d',
    key_secret: 'V2U0zsZ8i45VO9QA1hUsPix9'
});

app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt } = req.body;
    try {
        const order = await razorpay.orders.create({ amount, currency, receipt });
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto.createHmac('sha256', 'V2U0zsZ8i45VO9QA1hUsPix9')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        res.send('Payment verification successful');
    } else {
        res.status(400).send('Payment verification failed');
    }
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
