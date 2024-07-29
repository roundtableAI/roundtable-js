import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import Grid from '../../library/elements/grid.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import CheckBox from '../../library/elements/checkBox.js';
import NumberEntry from '../../library/elements/numberEntry.js';
import ProgressBar from '../../library/plugins/progressBar.js';

// Initial page
async function addPage1(survey) {
    const consent = new CheckBox({
        id: 'consent',
        text: 'I consent to participate in this survey',
        styles: {
            // Horizontally the checkbox question
            innerContainer:{
                margin: '0 auto',
                width: 'fit-content',
            },
        }
    });
    const age = new NumberEntry({
        id: 'age',
        text: 'How old are you?',
        min: 18,
        max: 100,
    });
    const favorite_animal = new SingleSelect({
        id: 'favorite_animal',
        text: 'Which of these animals do you like best?',
        options: ['Cat', 'Dog', 'Hamster']
    });
    await survey.showPage({ id: 'page1', elements: [consent,age,favorite_animal] });
}

// Second page
async function addPage2(survey) {
    const why_like = new SingleSelect({
        id: 'why_like',
        text: `Why do you like ${survey.getResponse('favorite_animal')}s?`,
        options: ['They are cute', 'They are friendly', 'They are low maintenance']
    });

    const ideal = new OpenEnd({
        id: 'ideal',
        text: `Please describe your ideal ${survey.getResponse('favorite_animal')}`,
        minLength: 10,
        maxLength: 200,
        rows: 20,
    });
    await survey.showPage(({ id: 'page2', elements: [why_like, ideal] }));
}

// Third page
async function addPage3(survey) {
    const owned_pets = new MultiSelect({
        id: 'owned_pets',
        text: 'Which of these animals do you have at home?',
        subText: 'Select all that apply',
        options: ['Cat', 'Dog', 'Hamster', 'Fish', 'Bird'],
    });

    const pet_satisfaction = new Grid({
        id: 'pet_satisfaction',
        text: 'Please rate your satisfaction with the following pet attributes:',
        rows: ['Friendliness', 'Cleanliness', 'Maintenance'],
        columns: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
    });

    const dog_best = new OpenEnd({
        id: 'dog_best',
        text: 'What is the best thing about having a dog?',
        minLength: 10,
        maxLength: 200,
    });

    const elements = [owned_pets, pet_satisfaction];
    // Add the dog question only if the participant has a dog
    if (survey.getResponse('favorite_animal') === 'Dog') elements.push(dog_best);

    await survey.showPage({ id: 'page3', elements });
}

// Fourth page
async function addPage4(survey) {
    const cat_best = new OpenEnd({
        id: 'cat_best',
        text: 'What is the best thing about having a cat?',
        minLength: 10,
        maxLength: 200,
    });

    await survey.showPage({ id: 'page4', elements: [cat_best] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        // Randomly assign participants to test or control
        condition: Math.random() > 0.5 ? 'test' : 'control',
        // Custom styling for the entire survey
        styles: {
            body: {
                background: '#F1F1FB',
            },
            container: {
                border: '1px solid black',
                boxShadow: 'none',
                // Small screens
                '@media (max-width: 650px)': {
                    border: 'none',
                },
            },
            button: {
                background: '#5722dd',
                // Hover
                '&:hover': {
                    background: '#7f57e5',
                },
            }
        }
    });
    // Survey pages
    await addPage1(survey);

    // Add the progress bar after the first page
    const progressBar = new ProgressBar({
        maxPages: 3,
        progressAsPercentage: true,
        styles:{
            bar:{
                background: '#5722dd',
            }
        }

    });
    survey.addPlugin(progressBar);
    
    await addPage2(survey);
    await addPage3(survey);
    // Only add the fourth page if the participant likes cats
    if (survey.getResponse('q1') === 'Cat') {
        await addPage4(survey);
    }
    survey.finishSurvey(`
        <h1>Thank you for completing the survey!</h1>
        <br/>
        <p>Your responses have been saved.</p>
        <p>Visit our website at <a href="https://www.roudntable.ai">roundtable.ai</a> to learn more about our services.</p>
        `);
}

runSurvey();