// import axios from "axios";
// import { useState } from "react";
// import "./App.css";

// function App() {
// 	const [book, setBook] = useState({
// 		name: "The Fault In Our Stars",
// 		author: "John Green",
// 		img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
// 		price: 250,
// 	});

// 	const initPayment = (data) => {
// 		const options = {
// 			key: "rzp_test_se97nzvcOAsG4F",
// 			amount: data.amount,
// 			currency: data.currency,
// 			name: book.name,
// 			description: "Test Transaction",
// 			image: book.img,
// 			order_id: data.id,
// 			handler: async (response) => {
// 				try {
// 					const verifyUrl = "http://localhost:8082/api/payment/verify";
// 					const { data } = await axios.post(verifyUrl, response, {
// 						headers: {
// 							'Access-Control-Allow-Origin': '*',
// 							'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
// 							'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
// 						},
// 					});
// 					console.log(data);
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			},
// 			theme: {
// 				color: "#3399cc",
// 			},
// 		};
// 		const rzp1 = new window.Razorpay(options);
// 		rzp1.open();
// 	};

// 	const handlePayment = async () => {
// 		try {
// 			const orderUrl = "http://localhost:8082/api/payment/orders";
// 			const { data } = await axios.post(
// 				orderUrl,
// 				{ amount: book.price },
// 				{
// 					headers: {
// 						'Access-Control-Allow-Origin': '*',
// 						'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
// 						'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
// 					},
// 				}
// 			);
// 			console.log(data);
// 			initPayment(data.data);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

// 	return (
// 		<div className="App">
// 			<div className="book_container">
// 				<img src={book.img} alt="book_img" className="book_img" />
// 				<p className="book_name">{book.name}</p>
// 				<p className="book_author">By {book.author}</p>
// 				<p className="book_price">
// 					Price : <span>&#x20B9; {book.price}</span>
// 				</p>
// 				<button onClick={handlePayment} className="buy_btn">
// 					buy now
// 				</button>
// 			</div>
// 		</div>
// 	);
// }

// export default App;


import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
	const [book, setBook] = useState({
		name: "The Fault In Our Stars",
		author: "John Green",
		img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
		price: 250,
	});

	const initPayment = (data) => {
		const options = {
			key: "rzp_test_se97nzvcOAsG4F", // Ensure this is your correct Razorpay key
			amount: data.amount,
			currency: data.currency,
			name: book.name,
			description: "Test Transaction",
			image: book.img,
			order_id: data.id,
			handler: async (response) => {
				try {
					const verifyUrl = "http://localhost:8082/api/payment/verify";
					const { data } = await axios.post(verifyUrl, {
						razorpay_order_id: response.razorpay_order_id,
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_signature: response.razorpay_signature
					});
					console.log("Payment verification response:", data);
				} catch (error) {
					console.error("Payment verification error:", error);
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async () => {
		try {
			const orderUrl = "http://localhost:8082/api/payment/orders";
			const { data } = await axios.post(orderUrl, {
				amount: book.price * 100, // Ensure amount is in paise (sub-units of currency)
			});
			console.log("Order response:", data);
			initPayment(data.data);
		} catch (error) {
			console.error("Payment initiation error:", error);
		}
	};

	return (
		<div className="App">
			<div className="book_container">
				<img src={book.img} alt="book_img" className="book_img" />
				<p className="book_name">{book.name}</p>
				<p className="book_author">By {book.author}</p>
				<p className="book_price">
					Price : <span>&#x20B9; {book.price}</span>
				</p>
				<button onClick={handlePayment} className="buy_btn">
					buy now
				</button>
			</div>
		</div>
	);
}

export default App;

