const cartContainer = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-no-item");
const closeCartBtn = document.querySelector(".close-cart");
const cartStructure = document.querySelector(".cart");
const cartOpenBtn = document.querySelector(".cart-btn");
const cartBadge = document.querySelector(".badgeCart");
const total = document.querySelector(".total-price");
const totalCont = document.querySelector(".cart-total")
let cart = [];


const updateBadge = function () {
	cartBadge.textContent = cart.length;
	console.log(cartBadge);
};

if (localStorage.getItem("cart")) {
	cart = JSON.parse(localStorage.getItem("cart"));
	console.log(cart);
}

const handleCart1 = function (e) {
	if (!e.target.classList.contains("add-to-cart")) return;

	const id = e.target.closest(".plant-card").dataset.id;
	const obj = plantDataArr.find((data) => data.id === id);
	console.log(obj);
	addToCart(obj);
};

const handleCart2 = function (e) {
	if (!e.target.classList.contains("add-to-cart")) return;

	const id = e.target.closest(".modal-content").dataset.id;
	const obj = plantDataArr.find((data) => data.id === id);
	addToCart(obj);
};

const cartItem = function ({
	image_url: image,
	name: nam,
	price: pric,
	id: i,
}) {
	return {
		name: nam,
		image_url: image,
		id: i,
		number: 1,
		OGprice: pric,
		price: pric,
	};
};
const renderTotal = function () {
	let totalC = 0;
	cart.forEach((c) => {
		totalC += c.price;
	});
	total.textContent = `$${totalC.toFixed(2)}`;
};
const addToCart = function (obj) {
	const cartObj =
		cart.find((c) => {
			if (c.id === obj.id) {
				c.number++;
				c.price = c.OGprice * c.number;
				return true;
			}
		}) ?? cartItem(obj);

	if (cartObj.number === 1) {
		cart.push(cartObj);
	}
	localStorage.setItem("cart", JSON.stringify(cart));

	renderCartContent(cart, cartContainer);
	updateBadge();
};

const renderCartContent = function (cartArr, cartContainer) {
	if (cart.length === 0) {
		cartEmpty.classList.remove("hidden");
		cartContainer.classList.add("hidden");
		totalCont.classList.add("hidden");
		return;
	}
	console.log(cart.length);
	cartContainer.classList.remove("hidden");
	totalCont.classList.remove("hidden")
	cartContainer.innerHTML = "";
	cartArr.forEach((cart) => {
		const markup = `<div class="cart-item" data-id="${cart.id}">
		<div class="img-cont">
			<img src="${cart.image_url}" alt="${cart.name}" />
		</div>
		<div class="name-cont">
			<p class="name">${cart.name}</p>
		</div>
		<div class="number-cont">
			<div class="add-subtract">
				<div class="add operation" role="button">+</div>
				<div class="value">${cart.number}</div>
				<div class="subtract operation" role="button">-</div>
			</div>
		</div>
		<div class="price-cont">
			<div class="price">
				$${cart.price.toFixed(2)}
				<div class="remove" role="button">Remove</div>
			</div>
		</div>
	</div>`;

		cartContainer.insertAdjacentHTML("beforeend", markup);
	});
	renderTotal();
	cartEmpty.classList.add("hidden");
};

const subFromCart = function (obj) {
	cart.find((c) => {
		if (c.id === obj.id) {
			c.number--;
			c.price = obj.OGprice * c.number;
			console.log(c.price, c.number);
			return true;
		}
	});

	localStorage.setItem("cart", JSON.stringify(cart));
	renderCartContent(cart, cartContainer);
};

const modifyCart = function (e) {
	if (!e.target.classList.contains("operation")) return;
	const element = e.target.closest(".operation");
	const id = e.target.closest(".cart-item").dataset.id;
	const cartObj = cart.find((c) => c.id === id);
	if (element.classList.contains("add")) {
		addToCart(cartObj);
	}

	if (element.classList.contains("subtract") && cartObj.number > 1) {
		subFromCart(cartObj);
	}
};

const deleteCart = function (e) {
	if (!e.target.classList.contains("remove")) return;
	// const element = e.target.closest(".remove");
	const id = e.target.closest(".cart-item").dataset.id;
	const cartIndex = cart.findIndex((c) => c.id === id);
	console.log(cartIndex);
	cart.splice(cartIndex, 1);
	console.log("Ehll");
	renderCartContent(cart, cartContainer);
	localStorage.setItem("cart", JSON.stringify(cart));
	updateBadge();
};

const closeCart = function () {
	cartStructure.classList.add("hidden");
	overlay.classList.add("hidden");
};

const openCart = function () {
	cartStructure.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

cartContainer.addEventListener("click", deleteCart);
cartContainer.addEventListener("click", modifyCart);
closeCartBtn.addEventListener("click", closeCart);
cartOpenBtn.addEventListener("click", openCart);
updateBadge();
renderCartContent(cart, cartContainer);


modal?.addEventListener("click", handleCart2);
plantContainer?.addEventListener("click", handleCart1);