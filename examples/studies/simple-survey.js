import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import HTML from '../../library/elements/HTML.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import SingleSelect from '../../library/elements/singleSelect.js';

async function addOpenEndPageAboutAnimal(survey,animal) {
    const animalString = animal === 'Fish' ? 'Fish' : `${animal}s`;
    const q2 = new OpenEnd({
        id: 'q2',
        text: `What do you like about ${animalString}?`,
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

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        condition: 'test',
    });

    // First page
    // Welcome and what animals they like
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

    // For each animal selected, ask what they like about it
    const likedAnimals = survey.getResponse('q1');
    for (let i = 0; i < likedAnimals.length; i++) {
        await addOpenEndPageAboutAnimal(survey,likedAnimals[i]);
        await addCloseEndPageAboutAnimal(survey,likedAnimals[i]);
    }

    // Finish the survey and save the response
    survey.finishSurvey( 'Thank you for completing the survey!' );
}

runSurvey();