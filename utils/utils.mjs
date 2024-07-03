export function insertDynamicPage(survey, page, index) {
    survey.pages.splice(index, 0, page);
}

export function checkNoneOfTheAbove(data) {
    for (const key in data) {
        if (data[key].includes('None of the above')) {
            return true;
        }
    }
    return false;
}

// Function to finish survey
export function finishSurvey(survey) {
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = '<h2>Survey Complete!</h2>';
    }
    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.style.display = 'none';
    }
    const progressElement = document.getElementById('progress');
    if (progressElement) {
        progressElement.style.display = 'none';
    }
    console.log('Survey has been completed.');
    survey.endSurvey();
}
