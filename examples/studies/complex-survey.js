import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import Grid from '../../library/elements/grid.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import CheckBox from '../../library/elements/checkBox.js';
import NumberEntry from '../../library/elements/numberEntry.js';
import OrderedScale from '../../library/elements/orderedScale.js';

// Survey pages
async function addPage1(survey) {

    const os = new OrderedScale({
        id: 'os',
        text: 'Please rate the following animals in order of preference',
        // labels: ['Strongly disagree', '', '', '', '','','Strongly agree'],
    });

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
        options: ['Cat', 'Dog', 'Hamster'],
        styles: {
            label:{
                // Make in a different font
                fontFamily: 'monospace',
            }
        }
    });
    await survey.showPage({ id: 'page1', elements: [os,consent, age, q1] });
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
                background: 'orange',
                color: 'white',
                '&:hover': {
                    background: 'red',
                },
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
    survey.finishSurvey('Thank you for completing the survey!');
}

runSurvey();