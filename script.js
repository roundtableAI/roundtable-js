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

// Define logic rules to dynamically add questions and pages
survey.addLogicRule(
    (data, currentPageId) => currentPageId === 'page3' && data.q1 === 'Dog',
    (data, survey) => {
        const page3 = survey.pages.find(page => page.id === 'page3');
        if (page3 && !page3.elements.some(element => element.id === 'q3_3')) {
            page3.addElement(new OpenEnded('q3_3', 'What is the best thing about having a dog?', 200, true));
        }
    }
);

// Add logic rules to dynamically create and insert pages at the end
survey.addLogicRule(
    (data, currentPageId) => currentPageId === 'page1' && data.q1 === 'Cat',
    (data, survey) => {
        if (!survey.pages.some(page => page.id === 'page4')) {
            const page4 = new Page('page4');
            page4.addElement(new OpenEnded('q4_1', 'What is the best thing about having a cat?', 200, true));
            survey.addPage(page4);
        }
    }
);

survey.addLogicRule(
    (data, currentPageId) => currentPageId === 'page3' && Array.isArray(data.q3_1) && data.q3_1.includes('Dog'),
    (data, survey) => {
        if (!survey.pages.some(page => page.id === 'page5')) {
            const page5 = new Page('page5');
            page5.addElement(new OpenEnded('q5_1', 'What activities do you do with your dogs?', 200, true));
            survey.addPage(page5);
        }
    }
);

document.addEventListener('DOMContentLoaded', () => {
    renderSurvey();

    document.getElementById('survey-form').addEventListener('submit', (event) => {
        event.preventDefault();
        survey.submitData();
        console.log(survey.data);
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
