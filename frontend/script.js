
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
const analysisPercentage =
    document.getElementById("analysisPercentage");


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

    // Check whether selected file is an image

    if (!file.type.startsWith("image/")) {

        alert("Please upload an image of your Sadhya.");

        photoInput.value = "";

        return;
    }

    // Create image preview

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

inspectButton.addEventListener("click", async function () {

    const file = photoInput.files[0];

    // Make sure an image was selected

    if (!file) {

        alert("Please select a Sadhya photo first.");

        return;
    }


    // Hide upload page

    uploadPage.style.display = "none";


    // Show analysis page

    analysisPage.style.display = "flex";

    window.scrollTo(0, 0);


    // Start progress animation

    startAnalysisAnimation();


    // Create form data

    const formData = new FormData();

    formData.append("image", file);


    try {

        // Send image to Flask backend

        const response = await fetch(
            "http://127.0.0.1:5000/audit",
            {
                method: "POST",
                body: formData
            }
        );


        // Convert response to JSON

        const result = await response.json();


        // Check backend response

        if (!response.ok) {

            throw new Error(
                result.error ||
                "The Sadya Auditor has malfunctioned."
            );

        }


        console.log("Backend result:", result);


        // Show result

        showResult(result);


    } catch (error) {

        console.error("Audit error:", error);


        alert(
            "🚨 SADYA AUDITOR FAILURE\n\n" +
            "The inspection department has collapsed.\n\n" +
            error.message
        );


        // Return to upload page

        analysisPage.style.display = "none";

        uploadPage.style.display = "block";

    }

});


// =====================================
// ANALYSIS ANIMATION
// =====================================

function startAnalysisAnimation() {

    let progress = 0;

    progressBar.style.width = "0%";

    analysisPercentage.textContent = "0%";


    const interval = setInterval(function () {

        progress += 1;


        // Stop at 95%
        // Remaining 5% is completed
        // after backend response

        if (progress >= 95) {

            progress = 95;

            clearInterval(interval);

        }


        progressBar.style.width =
            progress + "%";

        analysisPercentage.textContent =
            progress + "%";

    }, 30);

}


// =====================================
// SHOW RESULT
// =====================================

function showResult(result) {

    // Complete progress bar

    progressBar.style.width = "100%";

    analysisPercentage.textContent = "100%";


    // Small delay so 100% is visible

    setTimeout(function () {

        analysisPage.style.display = "none";

        resultPage.style.display = "block";

        window.scrollTo(0, 0);


        // Display actual backend result

        displayResult(result);

    }, 500);

}


// =====================================
// DISPLAY BACKEND RESULT
// =====================================

function displayResult(result) {

    // =================================
    // SCORE
    // =================================

    const scoreElement =
        document.getElementById("score");


    if (scoreElement) {

        scoreElement.innerHTML =
            `${result.score}<small>%</small>`;

    }


    // =================================
    // DISH LIST
    // =================================

    const resultList =
        document.querySelector(".result-list");


    if (!resultList) {

        console.error(
            "Could not find .result-list"
        );

        return;

    }


    // Clear old results

    resultList.innerHTML = "";


    // =================================
    // CREATE DISH CARDS
    // =================================

    if (result.dishes && result.dishes.length > 0) {

        result.dishes.forEach(function (dish) {

            const item =
                document.createElement("div");

            item.classList.add("result-item");


            // Confidence from backend

            const confidence =
                Number(dish.confidence);


            // =================================
            // DECIDE STATUS
            // =================================

            let icon = "🟡";

            let statusText =
                "DETECTED";


            if (confidence >= 20) {

                icon = "🟢";

                statusText =
                    "CONFIDENT";

            }
            else if (confidence >= 10) {

                icon = "🟡";

                statusText =
                    "LIKELY";

            }
            else {

                icon = "⚪";

                statusText =
                    "LOW CONFIDENCE";

            }


            // =================================
            // DISH CARD
            // =================================

            item.innerHTML = `

                <div class="dish-header">

                    <span class="dish-icon">
                        ${icon}
                    </span>

                    <span class="dish-name">
                        ${capitalizeDishName(dish.name)}
                    </span>

                    <span class="dish-status">
                        ${statusText}
                    </span>

                </div>

                <div class="dish-roast">

                    AI confidence:
                    ${confidence.toFixed(1)}%

                </div>

            `;


            resultList.appendChild(item);

        });

    }
    else {

        resultList.innerHTML = `

            <div class="result-item warning">

                <div class="dish-header">

                    <span class="dish-icon">
                        ⚠️
                    </span>

                    <span class="dish-name">
                        No dishes detected
                    </span>

                    <span class="dish-status">
                        UNKNOWN
                    </span>

                </div>

                <div class="dish-roast">

                    The AI has temporarily forgotten
                    what food looks like.

                </div>

            </div>

        `;

    }


    // =================================
    // VERDICT
    // =================================

    const verdictText =
        document.querySelector(".verdict p");


    if (verdictText) {

        verdictText.textContent =
            result.verdict || "No verdict available.";

    }


    // =================================
    // VIOLATIONS
    // =================================

    let violationsContainer =
        document.querySelector(".violations");


    // Create violations section if needed

    if (!violationsContainer) {

        violationsContainer =
            document.createElement("div");


        violationsContainer.classList.add(
            "violations"
        );


        const verdictSection =
            document.querySelector(".verdict");


        if (verdictSection) {

            verdictSection.parentNode.insertBefore(
                violationsContainer,
                verdictSection
            );

        }
        else {

            resultPage.appendChild(
                violationsContainer
            );

        }

    }


    // =================================
    // VIOLATION CONTENT
    // =================================

    if (
        result.violations &&
        result.violations.length > 0
    ) {

        violationsContainer.innerHTML = `

            <h3>
                🚨 AUDIT VIOLATIONS
            </h3>

            <div class="violation-list">

                ${result.violations.map(function (violation) {

                    return `

                        <div class="violation-item">

                            ${violation}

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    }
    else {

        violationsContainer.innerHTML = `

            <h3>
                ✅ NO VIOLATIONS
            </h3>

            <div class="violation-list">

                <div class="violation-item">

                    The Sadya survived the inspection.

                </div>

            </div>

        `;

    }


    // =================================
    // SCORE LABEL
    // =================================

    let scoreLabel = "";


    if (result.score >= 80) {

        scoreLabel =
            "SUSPICIOUSLY COMPETENT";

    }
    else if (result.score >= 60) {

        scoreLabel =
            "BARELY ACCEPTABLE";

    }
    else if (result.score >= 40) {

        scoreLabel =
            "SPIRITUALLY QUESTIONABLE";

    }
    else if (result.score >= 20) {

        scoreLabel =
            "CATASTROPHIC";

    }
    else {

        scoreLabel =
            "ABSOLUTELY COOKED 💀";

    }


    // =================================
    // CREATE SCORE LABEL
    // =================================

    let scoreLabelElement =
        document.querySelector(".score-label");


    if (!scoreLabelElement) {

        scoreLabelElement =
            document.createElement("div");


        scoreLabelElement.classList.add(
            "score-label"
        );


        const scoreParent =
            scoreElement.parentElement;


        if (scoreParent) {

            scoreParent.appendChild(
                scoreLabelElement
            );

        }

    }


    scoreLabelElement.textContent =
        scoreLabel;


    // =================================
    // CONSOLE INFORMATION
    // =================================

    console.log(
        "🔥 SADYA AUDIT COMPLETE"
    );

    console.log(
        "Sadya score:",
        result.score
    );

    console.log(
        "Dishes detected:",
        result.dishes_detected
    );

    console.log(
        "Dishes:",
        result.dishes
    );

    console.log(
        "Violations:",
        result.violations
    );

}


// =====================================
// CAPITALIZE DISH NAME
// =====================================

function capitalizeDishName(name) {

    if (!name) {

        return "Unknown";

    }

    return name
        .split(" ")
        .map(function (word) {

            return word.charAt(0).toUpperCase()
                + word.slice(1);

        })
        .join(" ");

}


// =====================================
// APPEAL BUTTON
// =====================================

const appealButton =
    document.getElementById("appealButton");


if (appealButton) {

    appealButton.addEventListener(
        "click",
        function () {

            alert(

                "⚖️ APPEAL REJECTED\n\n" +

                "Your appeal has been reviewed.\n\n" +

                "Decision: NO.\n\n" +

                "Reason: The authority said so."

            );

        }
    );

}
