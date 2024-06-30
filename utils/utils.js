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
    document.getElementById('question-container').innerHTML = '<h2>Survey Complete!</h2>';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    console.log('Survey has been completed.');
    survey.endSurvey();
}
