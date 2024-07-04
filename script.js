import Survey from './core/survey.mjs';
import Page from './core/page.mjs';
import SingleChoice from './question_types/singleChoice.mjs';

const survey = new Survey('my-survey', 'My Survey');

// Add pages
const page1 = new Page('page1');
page1.addElement(new SingleChoice('q1', 'What is your favorite animal?', ['Cat', 'Dog', 'Hamster']));
survey.addPage(page1);

const page2 = new Page('page2');
page2.addElement(new SingleChoice('q2', 'What is your favorite color?', ['Red', 'Blue', 'Green', 'Yellow']));
survey.addPage(page2);

document.addEventListener('DOMContentLoaded', () => {
    renderSurvey();

    document.getElementById('survey-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        survey.submitData(data);
        if (!survey.isComplete()) {
            renderSurvey();
        } else {
            survey.endSurvey();
        }
    });
});

function renderSurvey() {
    survey.render();
    updateNavButtons();
}

function updateNavButtons() {
    const submitButton = document.getElementById('submit-button');
    submitButton.textContent = survey.isComplete() ? 'Finish' : 'Next';
}