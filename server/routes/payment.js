// const router = require("express").Router();
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// router.post("/orders", async (req, res) => {
// 	try {
// 		const instance = new Razorpay({
// 			key_id: process.env.KEY_ID,
// 			key_secret: process.env.KEY_SECRET,
// 		});

// 		const options = {
// 			amount: req.body.amount * 100,
// 			currency: "INR",
// 			receipt: crypto.randomBytes(10).toString("hex"),
// 		};

// 		instance.orders.create(options, (error, order) => {
// 			if (error) {
// 				console.log(error);
// 				return res.status(500).json({ message: "Something Went Wrong!" });
// 			}
// 			res.status(200).json({ data: order });
// 		});
// 	} catch (error) {
// 		res.status(500).json({ message: "Internal Server Error!" });
// 		console.log(error);
// 	}
// });

// router.post("/verify", async (req, res) => {
// 	try {
// 		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
// 			req.body;
// 		const sign = razorpay_order_id + "|" + razorpay_payment_id;
// 		const expectedSign = crypto
// 			.createHmac("sha256", process.env.KEY_SECRET)
// 			.update(sign.toString())
// 			.digest("hex");

// 		if (razorpay_signature === expectedSign) {
// 			return res.status(200).json({ message: "Payment verified successfully" });
// 		} else {
// 			return res.status(400).json({ message: "Invalid signature sent!" });
// 		}
// 	} catch (error) {
// 		res.status(500).json({ message: "Internal Server Error!" });
// 		console.log(error);
// 	}
// });

// module.exports = router;


const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentSchema"); // Import the Payment model

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // Amount in paise (INR)
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful, save the payment details in MongoDB
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: req.body.amount,
        currency: "INR",
        status: "Success",
      });

      await payment.save(); // Save the payment record to MongoDB

      return res.status(200).json({ message: "Payment verified and saved successfully!" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
