const modal = document.querySelector(`.modalPlant`);
const modalCloseBtn = document.querySelector(`.modal-close`);
const overlay = document.querySelector(`.overlay`);
const filterContainer = document.querySelector(".filter");
const plantContainer = document.querySelector(".plant-cards");
const inputSearch = document.querySelector(`.search-plants`);
const modalContent = document.querySelector(".modal-content");

const leftPageButton = document.querySelector(".leftArr");
const righPageButton = document.querySelector(".rightArr");

let plantDataArr;
let moveleftNum = 0;
const moveLeft = function () {
	const paginationContainer = document.getElementById("pagination");
	paginationContainer.scroll({
		left: paginationContainer.scrollWidth,
		behavior: "smooth",
	});
};

const moveRight = function () {
	const paginationContainer = document.getElementById("pagination");
	paginationContainer.scroll({
		left: 0,
		behavior: "smooth",
	});
};
righPageButton.addEventListener("click", moveLeft);
leftPageButton.addEventListener("click", moveRight);
const openModal = function () {
	modal.classList.remove(`hidden`);
	overlay.classList.remove(`hidden`);
};

const closeModal = function () {
	modal.classList.add(`hidden`);
	overlay.classList.add(`hidden`);
};

const fetchAll = async function () {
	try {
		const res = await fetch("../json/plants_data.json");
		const data = await res.json();
		plantDataArr = data;

		if (!res.ok) throw new Error("Failed to get data" + res.status);

		return data;
	} catch (err) {
		return err.message;
	}
};

const fetchByCategory = async function (category) {
	try {
		const res = await fetchAll();
		if (category === "all") {
			return res;
		}
		const data = res.filter((plant) => plant.category === category);
		plantDataArr = data;
		return data;
	} catch (err) {
		console.log(err.message);
		return err.message;
	}
};
const createPlantCard = function ({
	image_url: img,
	name: plantName,
	price: plantPrice,
	category: plantCategory,
	id: plantId,
}) {
	const plantCard = `				
    <div class="plant-card" data-id="${plantId}">
    <div class="img-cont">
        <img src="${img}" alt="${plantName}" />
    </div>
    <div class="content">
        <p>Name : ${plantName}</p>
        <p>Price : $${plantPrice}</p>
        <p>Category : ${plantCategory} Plant</p>
        <button class="add-to-cart">Add To Cart</button>
        <button class="more-info">More Information</button>
    </div>
</div>`;
	return plantCard;
};

const handlePagination = function (page, plantData, itemsPerPage) {
	const buttons = document.querySelectorAll(`#pagination button`);
	const startIndex = (page - 1) * itemsPerPage;
	buttons.forEach((btn) => btn.classList.remove(`active`));
	buttons[page - 1].classList.add(`active`);
	const endIndex = startIndex + itemsPerPage;
	const plantArray = plantData.slice(startIndex, endIndex);
	renderPlantData(plantArray);
};

const renderPlantData = function (plantData) {
	plantContainer.innerHTML = "";
	plantData.forEach((plant) => {
		const plantCard = createPlantCard(plant);
		plantContainer.insertAdjacentHTML("beforeend", plantCard);
	});
};

const handleFilter = async function (e) {
	// Guard Clause
	if (
		e.target.classList.contains("sort") ||
		!e.target.classList.contains(`filterButton`)
	)
		return;

	const element = e.target.closest(".filterButton");
	console.log(element.dataset.filter);
	const data = await fetchByCategory(element.dataset.filter);
	initPaginationCtrl(6, data);
	handlePagination(1, data, 6);
	// renderPlantData(data)
};

const initPaginationCtrl = function (itemsPerPage, plantData) {
	const paginationContainer = document.getElementById("pagination");
	paginationContainer.textContent = "";
	const totalPages = Math.ceil(plantData.length / itemsPerPage);
	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement("button");
		pageButton.textContent = i;
		pageButton.classList.add(`active`);
		pageButton.addEventListener("click", function () {
			handlePagination(i, plantData, itemsPerPage);
			pageButton.classList.add(`active`);
		});
		paginationContainer.appendChild(pageButton);
	}
};

const renderAll = async function () {
	try {
		const data = await fetchAll();
		// console.log(data.length);
		initPaginationCtrl(6, data);
		handlePagination(1, data, 6);
	} catch (err) {
		console.log(err);
	}
};

const sortNRender = function (data, sort = "alphabet") {
	if (sort === "alphabet") {
		const dataSorted = data.sort((a, b) => a.name.localeCompare(b.name));
		initPaginationCtrl(6, dataSorted);
		handlePagination(1, dataSorted, 6);
	}

	if (sort === "price") {
		const dataSorted = data.sort((a, b) => a.price - b.price);
		initPaginationCtrl(6, dataSorted);
		handlePagination(1, dataSorted, 6);
	}
};

const handleSort = function (e) {
	if (!e.target.classList.contains("sort-option")) return;
	const element = e.target.closest(`.sort-option`);
	sortNRender(plantDataArr, element.dataset.sort);
};

const searchNRender = function (query, data) {
	const lowerCaseQuery = query.toLowerCase();
	const dataSearch = data.filter((plant) => {
		for (const key in plant) {
			if (
				typeof plant[key] === "string" &&
				plant[key].toLowerCase().includes(lowerCaseQuery)
			) {
				return true;
			}
		}
		return false;
	});
	initPaginationCtrl(6, dataSearch);
	handlePagination(1, dataSearch, 6);
};

const handleSearch = function () {
	// console.log(inputSearch.value.length);
	if (inputSearch.value.length === 0) {
		renderAll();
		return;
	}
	searchNRender(inputSearch.value, plantDataArr);
};

const renderObjModal = function ({
	image_url: img,
	name: plantName,
	price: plantPrice,
	category: plantCategory,
	id: plantId,
	scientificName: sname,
	origin: origin,
	watering: watering,
	light: light,
}) {
	const markup = `
	<div class="modal-content" data-id="${plantId}">
	<div class="image-cont">
		<img src="${img}" alt="" />
	</div>
	<div class="description">
		<p>Name : ${plantName}</p>
		<p>Scientific Name : ${sname}</p>
		<p>Origin : ${origin}</p>
		<p>Watering Requirments : ${watering}</p>
		<p>Light : ${light}</p>
		<p>Price: $${plantPrice}</p>
		<p> Category : ${plantCategory} </p>
		<button class="add-to-cart" >Add To Cart</button>
	</div>
</div>`;

	modalContent.innerHTML = markup;
};

const moreInfo = function (e) {
	if (!e.target.classList.contains("more-info")) return;
	const element = e.target.closest(".more-info");
	const id = e.target.closest(".plant-card").dataset.id;
	const obj = plantDataArr.find((data) => data.id === id);
	renderObjModal(obj);
	openModal();
};

plantContainer?.addEventListener("click", moreInfo);
renderAll();
filterContainer?.addEventListener("click", handleSort);
filterContainer?.addEventListener(`click`, handleFilter);
modalCloseBtn?.addEventListener("click", closeModal);
inputSearch?.addEventListener("keydown", handleSearch);

// Create Active Class For Filter Links
// Add Sort by popularity as an option
