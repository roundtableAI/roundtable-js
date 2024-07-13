import Survey from '../core/survey.js';
import OpenEnd from '../question_types/openEnd.js';
import SingleSelect from '../question_types/singleSelect.js';
import Grid from '../question_types/grid.js';
import MultiSelect from '../question_types/multiSelect.js';
import CheckBox from '../question_types/checkBox.js';
import NumberEntry from '../question_types/numberEntry.js';

// Survey pages
async function addPage1(survey) {
    const consent = new CheckBox({
        id: 'consent',
        text: 'I consent to participate in this survey',
        required: true,
    });
    const age = new NumberEntry({
        id: 'age',
        text: 'How old are you?',
        required: true,
        min: 18,
        max: 100,
    });
    const q1 = new SingleSelect({
        id: 'q1',
        text: 'Which of these animals do you like best?',
        options: ['Cat', 'Dog', 'Hamster']
    });
    await survey.showPage({ id: 'page1', elements: [consent, age, q1] });
}

async function addPage2(survey) {
    const q2_1 = new SingleSelect({
        id: 'q2_1',
        text: `Why do you like ${survey.getResponse('q1')}s?`,
        options: ['They are cute', 'They are friendly', 'They are low maintenance'],
        styles:{
            root: {
                backgroundColor: 'lightgreen',
            },
        }
    });

    const q2_2 = new OpenEnd({
        id: 'q2_2',
        text: `Please describe your ideal ${survey.getResponse('q1')}`,
        minLength: 10,
        maxLength: 200,
        rows: 100,
        cols: 10,
        styles: {
            background: 'pink', // For the entire question element
            textArea: {
                backgroundColor: 'lightblue',
            }

        }
    });
    await survey.showPage(({ id: 'page2', elements: [q2_1, q2_2] }));
}

async function addPage3(survey) {
    const q3_1 = new MultiSelect({
        id: 'q3_1',
        text: 'Which of these animals do you have at home?',
        subText: 'Select all that apply',
        options: ['Cat', 'Dog', 'Hamster', 'Fish', 'Bird'],
    });

    const q3_2 = new Grid({
        id: 'q3_2',
        text: 'Please rate your satisfaction with the following pet attributes:',
        rows: ['Friendliness', 'Cleanliness', 'Maintenance'],
        columns: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
    });

    const q3_3 = new OpenEnd({
        id: 'q3_3',
        text: 'What is the best thing about having a dog?',
        minLength: 10,
        maxLength: 200,
    });

    const elements = [q3_1, q3_2];
    if (survey.getResponse('q1') === 'Dog') elements.push(q3_3);

    await survey.showPage({ id: 'page3', elements });
}

async function addPage4(survey) {
    const q4_1 = new OpenEnd({
        id: 'q4_1',
        text: 'What is the best thing about having a cat?',
        minLength: 10,
        maxLength: 200,
    });

    await survey.showPage({ id: 'page4', elements: [q4_1] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        condition: 'test',
        styles: {
            body:{
                background: 'pink',
            },
            button: {
                color: 'blue',
                background: 'yellow',
            },
        }
    });
    // Survey pages
    await addPage1(survey);
    await addPage2(survey);
    await addPage3(survey);
    if (survey.getResponse('q1') === 'Cat') {
        await addPage4(survey);
    }
    survey.finishSurvey({ message: 'Thank you for completing the survey!' });
}

runSurvey();

// survey.js -- reactive elements/questions that pop up right under the question that was just answered
// Example that does some interesting things...
// 