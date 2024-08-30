import Survey from '../../library/core/survey.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import NumberScale from '../../library/elements/numberScale.js';
import OpenEnd from '../../library/elements/openEnd.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import PageHTML from '../../library/plugins/pageHTML.js';

async function runSurvey() {
    const survey = new Survey();

    const logo = new PageHTML({
        id: 'logo',
        content: '<img src="https://roundtable.ai/images/logo-with-text.svg" alt="RoundtableJS Logo">',
        position: 'top',
        styles: {
            root: {
                maxWidth: '190px',
                margin: '10px auto 30px',
            }
        }
    });

    survey.addPlugin(logo);

    const q1 = new SingleSelect({
        id: 'role',
        text: 'What best describes your role?',
        options: ['Developer', 'Designer', 'Product Manager', 'Researcher'],
        required: true,
        allowOther: true,
    });

    await survey.showPage({ id: 'page1', elements: [q1] });

    const q2 = new NumberScale({
        id: 'satisfaction',
        text: 'How satisfied are you with RoundtableJS?',
        min: 1,
        max: 10,
        minLabel: 'Very Dissatisfied',
        maxLabel: 'Very Satisfied',
        required: true,
    });

    await survey.showPage({ id: 'page2', elements: [q2] });

    const q3 = new MultiSelect({
        id: 'features',
        text: 'Which features of RoundtableJS do you find most valuable?',
        options: ['Easy to use', 'Customizable', 'Fast performance', 'Good documentation', 'Responsive design'],
        minSelected: 1,
        maxSelected: 3,
        required: true,
    });

    await survey.showPage({ id: 'page3', elements: [q3] });

    const q4 = new OpenEnd({
        id: 'improvement',
        text: 'What one thing would you improve about RoundtableJS?',
        required: true,
    });

    await survey.showPage({ id: 'page4', elements: [q4] });

    const q5 = new SingleSelect({
        id: 'recommend',
        text: 'How likely are you to recommend RoundtableJS to a colleague?',
        options: ['Very likely', 'Likely', 'Neutral', 'Unikely', 'Very unlikely'],
        required: true,
    });

    await survey.showPage({ id: 'page5', elements: [q5] });

    survey.finishSurvey("<h2>Thank you for your feedback!</h2><p>Your responses will help us improve RoundtableJS.</p>");
}

runSurvey();