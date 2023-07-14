const express = require('express');
const router = express.Router();
const Courses = require("../models/courses")
const User = require('../models/users');
const cors = require('cors')
const middleware = require("../Middleware/Middleware");
require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_KEY)

router.use(cors({
  origin:"*"
}))


router.post('/create-checkout-session', async (req, res) => {
  const porductId = req.body.cartItems?.map((_id)=>(_id._id));
    const customer = await stripe.customers.create({
        metadata: {
          userId: req.body.userId,
          cart: JSON.stringify(porductId),
        },
      });
    const line_items = req.body?.cartItems.map((course)=>{
        return{
     price_data: {
          currency: 'INR',
          product_data: {
            name: course.name,
            images:[course.image],
            description:course.category,
            metadata:{
                id:course._id,
            }
          },
          unit_amount: (course.price)*100,
        },
        quantity: 1,
    }
    })
  const session = await stripe.checkout.sessions.create({
    customer:customer.id,
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });
  if(!session.payment_status == 'unpaid'){
  console.log('Data logged after clicking "Pay":');
  }
  res.send({url:session.url});
 
});





//webhook authentification

let endpointSecret;

 endpointSecret = "whsec_rmKe27ktOBaBcHhDILv0wbZZ8edYZ927";
 

 

router.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
 
     const user = await User.findOne({ _id: stripe.customers.metadata.userId });
    
  const sig = request.headers['stripe-signature'];
  let data;
  let eventType;
if(endpointSecret){
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  data = event.data.object;
  eventType = event.type;
}else{
   data = request.body.data.object;
   eventType = request.body.type;
}


if(eventType === "checkout.session.completed"){
 stripe.customers
    .retrieve(data.customer)
    .then(async (customer) => {
      try {
    const user= await User.findById(customer.metadata.userId)
    await  (JSON.parse(customer.metadata.cart)).map( (cartItem)=> {
      user.purchasedcourses?.push(cartItem);
       user.cartcourses =[];
      user.cartprice = 0});
  user.save()
  } catch (err) {
       console.log(err);
      }
    })
    .catch((err) => console.log(err.message));
}
 
  response.send().end();
});




module.exports = router