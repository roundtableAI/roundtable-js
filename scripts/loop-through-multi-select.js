import Survey from '../core/survey.js';
import OpenEnd from '../question_types/openEnd.js';
import SingleSelect from '../question_types/singleSelect.js';
import MultiSelect from '../question_types/multiSelect.js';
import HTML from '../question_types/HTML.js';

async function addPage1(survey) {
    
    const welcome = new HTML({
        id: 'welcome',
        content: `<h1>Welcome to the animal survey</h1>`,
        styles: {
            root: {
                textAlign: 'center',
            }
        }
    });

    const q1 = new MultiSelect({
        id: 'q1',
        text: 'Which of these animals do you like?',
        numRows: 3,
        options: ['Cat', 'Dog', 'Hamster', 'Fish', 'Bird'],
    });

    await survey.showPage({ id: 'page1', elements: [ welcome, q1] });
}

async function addOpenEndPageAboutAnimal(survey,animal) {
    const q2 = new OpenEnd({
        id: 'q2',
        text: `What do you like about ${animal}s?`,
        // minLength: 10,
        // maxLength: 200,
    });
    await survey.showPage({ id: 'page2', elements: [q2] });
}

async function addCloseEndPageAboutAnimal(survey,animal) {
    const q3 = new SingleSelect({
        id: 'q3',
        text: `What do you like about ${animal}s?`,
        options: ['Cute', 'Friendly', 'Low maintenance'],
    });
    await survey.showPage({ id: 'page2', elements: [q3] });
}

async function finalPage(survey) {
    const q4 = new OpenEnd({
        id: 'q4',
        text: 'What did you enjoy about the survey?',
        minLength: 10,
        maxLength: 200,
    });
    await survey.showPage({ id: 'page3', elements: [q4] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        condition: 'test',
    });
    await addPage1(survey);
    const likedAnimals = survey.getResponse('q1');
    for (let i = 0; i < likedAnimals.length; i++) {
        await addOpenEndPageAboutAnimal(survey,likedAnimals[i]);
        await addCloseEndPageAboutAnimal(survey,likedAnimals[i]);
    }
    await finalPage(survey);

    survey.finishSurvey({ message: 'Thank you for completing the survey!' });
}

runSurvey();