/* Set the width of the side navigation to 250px */
// function openNav() {
// 	var slideWidth ="300px"
// 	document.getElementById("idSideNav").style.width = slideWidth;
// 	document.getElementById("closebtn").style.visibility = "visible";
// 	document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

// }

// function closeNav() {
// 	document.getElementById("idSideNav").style.width = "0";
// 	document.getElementById("closebtn").style.visibility = "hidden";
// 	document.body.style.backgroundColor = "rgba(0,0,0,0)";

// }

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "100vw";
  document.body.style.backgroundColor = "rgba(0,0,90,0.7)";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.body.style.backgroundColor = "rgba(0,0,0,0)";
} 

function workChange(num){
	var numarray = ["one","two","three","four","five"]
	document.getElementById(numarray[num-1]).style.display ="block";
	delete numarray[num-1];
	// console.log(numarray);

	for (i=0;i<numarray.length;i++){
		if (numarray[i] != undefined){
			// console.log('uncheck'+numarray[i])
			document.getElementById(numarray[i]).style.display = "none";

		}
	}
}


showSlides(1);

// Next/previous controls
function plusSlides(n) {
	showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i;
	var slides = document.getElementsByClassName("mySlides");
	// console.log(slides);
	var dots = document.getElementsByClassName("dot");
	if (n > slides.length) {slideIndex = 1}
	if (n < 1) {slideIndex = slides.length}
	for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" active", "");}
	// console.log(slideIndex);

	slides[slideIndex-1].style.display = "block";
	dots[slideIndex-1].className += " active";
}
function firstSlide(){
	plusSlides(1);
	plusSlides(-1);
}








