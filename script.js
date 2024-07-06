import Survey from './core/survey.mjs';
import Page from './core/page.mjs';
import SingleChoice from './question_types/singleChoice.mjs';
import OpenEnded from './question_types/openEnded.mjs';
import MultipleSelect from './question_types/multipleSelect.mjs';
import Grid from './question_types/grid.mjs';

// Create a new survey instance
const survey = new Survey('complex-survey', 'Complex Survey');

// Add the first page with a single-choice question
const page1 = new Page('page1');
page1.addElement(new SingleChoice('q1', 'What is your favorite animal?', ['Cat', 'Dog', 'Hamster']));
survey.addPage(page1);

// Add the second page with two questions, including piping
const page2 = new Page('page2');
page2.addElement(new SingleChoice('q2_1', 'Why do you like {{q1}}s?', ['They are cute', 'They are friendly', 'They are low maintenance']));
page2.addElement(new OpenEnded('q2_2', 'Please describe your ideal {{q1}}.', 200, true));
survey.addPage(page2);

// Add the third page with two questions initially
const page3 = new Page('page3');
page3.addElement(new MultipleSelect('q3_1', 'Which of these animals do you have at home?', ['Cat', 'Dog', 'Hamster', 'Fish', 'Bird']));
page3.addElement(new Grid('q3_2', 'Please rate your satisfaction with the following pet attributes:',
    ['Friendliness', 'Cleanliness', 'Maintenance'],
    ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
));
survey.addPage(page3);

// Define logic rules to dynamically add the third question
survey.addLogicRule(
    (data, currentPageId) => currentPageId === 'page3' && data.q1 === 'Dog',
    (data, survey) => {
        // Add question q3_3 if the favorite animal is Dog
        const page3 = survey.pages.find(page => page.id === 'page3');
        if (page3 && !page3.elements.some(element => element.id === 'q3_3')) {
            page3.addElement(new OpenEnded('q3_3', 'What is the best thing about having a dog?', 200, true));
        }
    }
);

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
