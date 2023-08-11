const nav = document.querySelector(".navbar");
const navCollapse = document.querySelector(".navbar-collapse")
console.log(nav);
document.addEventListener("scroll", function () {
	if (window.scrollY > 80) {
		nav.classList.add("afterScroll");
		nav.classList.remove("b4Scroll");

	} else {
		nav.classList.add("b4Scroll");
		nav.classList.remove("afterScroll");
		navCollapse.classList.add("collapse-background");
	}
});
