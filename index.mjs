import { displayPage, collectData, submitData } from './controller.mjs';

// Get the necessary DOM elements
const questionContainerElement = document.getElementById('question-container');

// Start the survey
displayPage(questionContainerElement);

// Event listener for submit button
document.getElementById('submit-btn').addEventListener('click', () => {
    submitData(questionContainerElement);
});