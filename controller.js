import survey from './experiments/data_labeler.js'; // Importing the initialized survey instance
import { finishSurvey } from './utils/utils.js'; // Import the finishSurvey function from utils.js

// Function to display the current page of the survey
function displayPage() {
    const questionContainer = document.getElementById('question-container');
    const currentPage = survey.getCurrentPage();

    if (currentPage) {
        questionContainer.innerHTML = currentPage.render(survey.data);

        document.getElementById('submit-btn').style.display = 'block';

        // Display progress
        const progress = survey.getProgress();
        document.getElementById('progress').textContent = `Page ${progress.current} of ${progress.total}`;
    } else {
        finishSurvey(survey); // Pass the survey instance
    }
}

// Function to collect data from form elements
function collectData() {
    const data = {};
    const currentPageElements = document.querySelectorAll(`#question-container input, #question-container select, #question-container textarea`);

    currentPageElements.forEach(element => {
        const name = element.name;
        if (element.type === 'radio' || element.type === 'checkbox') {
            if (element.checked) {
                if (!data[name]) {
                    data[name] = [];
                }
                data[name].push(element.value);
            }
        } else {
            data[name] = element.value;
        }
    });

    return data;
}

// Function to submit data
function submitData() {
    const data = collectData();

    console.log('Collected Data:', data); // Log collected data to verify

    const currentPageIndex = survey.currentPageIndex;
    const totalPages = survey.pages.length;
    const currentPage = survey.submitData(data);

    // Save data to localStorage or any other storage mechanism
    saveDataToLocalStorage(survey.data); // Store the survey instance's data

    // Log data to console
    console.log('Stored Data:', survey.data);

    // Check if the current page is the last page
    if (currentPageIndex === totalPages - 1) {
        finishSurvey(survey); // Finish the survey if on the last page
    } else if (currentPage) {
        displayPage();
    } else {
        alert('Please answer all questions before proceeding.');
    }
}

// Function to save data to localStorage
function saveDataToLocalStorage(data) {
    const storedData = JSON.parse(localStorage.getItem('surveyData')) || {};
    const surveyId = survey.id;

    storedData[surveyId] = { ...storedData[surveyId], ...data };
    localStorage.setItem('surveyData', JSON.stringify(storedData));
}

// Event listener for submit button
document.getElementById('submit-btn').addEventListener('click', submitData);

// Start the survey
displayPage();
