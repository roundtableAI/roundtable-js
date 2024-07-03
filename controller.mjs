import survey from './experiments/sandbox.mjs'; // Importing the initialized survey instance
import { finishSurvey } from './utils/utils.mjs'; // Import the finishSurvey function from utils.js

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
    
    // Assuming `survey` is your survey instance
    survey.pages[survey.currentPageIndex].elements.forEach(element => {
        const elementData = element.getData();
        if (elementData !== null) {
            data[element.id] = elementData;
        }
    });
    
    return data;
}

// Function to submit data
function submitData() {
    const data = collectData();

    const currentPage = survey.submitData(data);

    // Save data to localStorage or any other storage mechanism
    saveDataToLocalStorage(survey.data); // Store the survey instance's data

    console.log(survey.currentPageIndex)
    console.log(survey.isComplete())

    // Check if the current page is the last page
    if (survey.isComplete()) {
        finishSurvey(survey); // Finish the survey if on the last page
    } else {
        displayPage();
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
