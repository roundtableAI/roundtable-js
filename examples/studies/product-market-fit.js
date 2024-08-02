import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import HTML from '../../library/elements/HTML.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import OrderedScale from '../../library/elements/orderedScale.js';

async function runSurvey() {
    const survey = new Survey({
        condition: 'test',
        participant_id: 'p123',
        styles: {
            container: {
                maxWidth: '800px',
            },
        },
    });

    const logo = new HTML({
        id: 'logo',
        content: '<img src="https://roundtable.ai/images/logo-with-text.svg" style="max-width: 100%; width: 190px; display: block; margin: 0 auto 20px;">',
    });

    const q1 = new SingleSelect({
        id: 'role',
        text: 'What best describes your role?',
        options: ['Developer', 'Designer', 'Product Manager', 'Researcher', 'Other'],
        required: true,
    });

    await survey.showPage({ id: 'page1', elements: [logo, q1] });

    const q2 = new OrderedScale({
        id: 'satisfaction',
        text: 'How satisfied are you with RoundtableJS?',
        min: 1,
        max: 5,
        labels: ['Very Dissatisfied', '', 'Neutral', '', 'Very Satisfied'],
        required: true,
    });

    await survey.showPage({ id: 'page2', elements: [logo, q2] });

    const q3 = new MultiSelect({
        id: 'features',
        text: 'Which features of RoundtableJS do you find most valuable?',
        options: ['Easy to use', 'Customizable', 'Fast performance', 'Good documentation', 'Responsive design'],
        minSelected: 1,
        maxSelected: 3,
        required: true,
    });

    await survey.showPage({ id: 'page3', elements: [logo, q3] });

    const q4 = new OpenEnd({
        id: 'improvement',
        text: 'What one thing would you improve about RoundtableJS?',
        minLength: 10,
        maxLength: 500,
        required: true,
    });

    await survey.showPage({ id: 'page4', elements: [logo, q4] });

    const q5 = new SingleSelect({
        id: 'recommend',
        text: 'How likely are you to recommend RoundtableJS to a colleague?',
        options: ['Very unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very likely'],
        required: true,
    });

    await survey.showPage({ id: 'page5', elements: [logo, q5] });

    survey.finishSurvey("<h2>Thank you for your feedback!</h2><p>Your responses will help us improve RoundtableJS.</p>");
}

runSurvey();