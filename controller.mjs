import survey from './experiments/sandbox.mjs';
import { finishSurvey } from './utils/utils.mjs';

// Function to display the current page of the survey
export function displayPage(questionContainerElement) {
  const currentPage = survey.getCurrentPage();

  if (currentPage) {
    questionContainerElement.innerHTML = currentPage.render(survey.data);

    // Display progress
    const progress = survey.getProgress();
    questionContainerElement.querySelector('#progress').textContent = `Page ${progress.current} of ${progress.total}`;
  } else {
    finishSurvey(survey);
  }
}

// Function to collect data from form elements
export function collectData() {
  const data = {};
  
  survey.pages[survey.currentPageIndex].elements.forEach(element => {
    const elementData = element.getData();
    if (elementData !== null) {
      data[element.id] = elementData;
    }
  });
  
  return data;
}

// Function to submit data
export function submitData(questionContainerElement) {
  const data = collectData();

  const currentPage = survey.submitData(data);

  // Save data to localStorage or any other storage mechanism
  saveDataToLocalStorage(survey.data);

  if (survey.isComplete()) {
    finishSurvey(survey);
  } else {
    displayPage(questionContainerElement);
  }
}

// Function to save data to localStorage
function saveDataToLocalStorage(data) {
  const storedData = JSON.parse(localStorage.getItem('surveyData')) || {};
  const surveyId = survey.id;

  storedData[surveyId] = { ...storedData[surveyId], ...data };
  localStorage.setItem('surveyData', JSON.stringify(storedData));
}