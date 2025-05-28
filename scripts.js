const closeButton = document.getElementById("closeButton");
const banner = document.getElementById("bannerCenter");

closeButton.addEventListener('click', () => {
    banner.style.display = "none";
})