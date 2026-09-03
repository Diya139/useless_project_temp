// =====================================
// GET HTML ELEMENTS
// =====================================

const homePage = document.getElementById("homePage");
const uploadPage = document.getElementById("uploadPage");
const analysisPage = document.getElementById("analysisPage");
const resultPage = document.getElementById("resultPage");

const startButton = document.getElementById("startButton");

const photoInput = document.getElementById("photoInput");
const previewArea = document.getElementById("previewArea");
const imagePreview = document.getElementById("imagePreview");

const inspectButton = document.getElementById("inspectButton");
const changeButton = document.getElementById("changeButton");

const progressBar = document.getElementById("progressBar");
const analysisPercentage = document.getElementById("analysisPercentage");


// =====================================
// START INSPECTION
// =====================================

startButton.addEventListener("click", function () {

    homePage.style.display = "none";
    uploadPage.style.display = "block";

    window.scrollTo(0, 0);

});


// =====================================
// PHOTO UPLOAD
// =====================================

photoInput.addEventListener("change", function () {

    const file = photoInput.files[0];

    if (!file) {
        return;
    }

    // Check if image
    if (!file.type.startsWith("image/")) {

        alert("Please upload an image of your Sadhya.");

        photoInput.value = "";

        return;
    }


    // Create preview
    const imageURL = URL.createObjectURL(file);

    imagePreview.src = imageURL;

    previewArea.style.display = "block";

    // Scroll to preview
    previewArea.scrollIntoView({
        behavior: "smooth"
    });

});


// =====================================
// CHANGE PHOTO
// =====================================

changeButton.addEventListener("click", function () {

    photoInput.value = "";

    imagePreview.src = "";

    previewArea.style.display = "none";

    photoInput.click();

});


// =====================================
// INSPECT SADHYA
// =====================================

inspectButton.addEventListener("click", function () {

    // Hide upload page
    uploadPage.style.display = "none";

    // Show analysis page
    analysisPage.style.display = "flex";

    window.scrollTo(0, 0);

    startFakeAnalysis();

});


// =====================================
// TEMPORARY DEMO ANALYSIS
// =====================================

function startFakeAnalysis() {

    let progress = 0;

    progressBar.style.width = "0%";

    analysisPercentage.textContent = "0%";


    const interval = setInterval(function () {

        progress++;

        progressBar.style.width = progress + "%";

        analysisPercentage.textContent = progress + "%";


        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(function () {

                showResult();

            }, 700);

        }

    }, 25);

}


// =====================================
// SHOW RESULT
// =====================================

function showResult() {

    analysisPage.style.display = "none";

    resultPage.style.display = "block";

    window.scrollTo(0, 0);

}


// =====================================
// APPEAL BUTTON
// =====================================

document.getElementById("appealButton").addEventListener("click", function () {

    alert(
        "⚖️ APPEAL REJECTED\n\n" +
        "Reason: The authority said so."
    );

});