const express = require('express');
const bodyParser = require ("body-parser");
const cors = require("cors")
const Razorpay= require("razorpay")
const app = express();
const port = 3000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.get("/", (req, res)=>{
  res.send("integration")
})

app.post('/oredrs',async(req, res)=>{
  const razorpay = new Razorpay({
  key_id :"rzp_test_3Fr570cprLauMD",
  key_secret:"m96ZGfEeobappicb90uZnCPI"
  })
  const options = {
 amount: req.body.amount,
 currency:req.body.currency,
 receipt:"receipt",
 payment_capture:1
  }
  try{
    const response= await razorpay.orders.create(options)
    res.json({
      order_id:response.id,
      currency:response.currency,
      amount:response.amount
    })
  }catch (error){
    res.status(500).send("internal server error")
  }
})

app.get("/payment/:paymentId",async(req, res)=>{
  const {paymentId} = req.params;
  const razorpay = new Razorpay({
     key_id :"rzp_test_3Fr570cprLauMD",
  key_secret:"m96ZGfEeobappicb90uZnCPI"
  })
  try{
    const payment = await razorpay.payments.fetch(paymentId)
    if(!payment){
      return res.status(500).json("error at razorpay loading")
    }
  res.json({
    status:payment.status,
    method:payment.method,
    amount:payment.amount,
    currency:payment.currency
  })
  } catch(error){
    res.status(500).json("error fetching paymnet")
  }
})

app.listen(port, ()=>{
  console.log("app is running")
})



