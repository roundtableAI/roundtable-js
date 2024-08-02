import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import HTML from '../../library/elements/HTML.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import OrderedScale from '../../library/elements/orderedScale.js';
import Grid from '../../library/elements/grid.js';
import NumberEntry from '../../library/elements/numberEntry.js';
import ProgressBar from '../../library/plugins/progressBar.js';

async function runSurvey() {
    const survey = new Survey({
        condition: 'test',
        participant_id: 'p123',
        styles: {
            body: {
                background: '#f0f8ff',
            },
            container: {
                border: '1px solid #b0d4ff',
                boxShadow: '0 0 10px rgba(0,0,255,0.1)',
                '@media (max-width: 650px)': {
                  border: 'none',
                },
            },
            button: {
                backgroundColor: '#4682b4',
                '&:hover': {
                    backgroundColor: '#5f9ea0',
                }
            },
            question: {
                borderBottom: '1px solid #b0d4ff',
                paddingBottom: '20px',
                '@media (max-width: 650px)': {
                  borderBottom: 'none',
                  paddingBottom: '0px',
                },
            }
        }
    });

    const progressBar = new ProgressBar({
        maxPages: 8,
        progressAsPercentage: true,
        styles: {
            bar: {
                background: '#4682b4',
            }
        }
    });
    survey.addPlugin(progressBar);

    const welcome = new HTML({
        id: 'welcome',
        content: `
            <h1 style="color: #4682b4; text-align: center;">Welcome to the Annual Travel Habits Survey</h1>
            <p style="text-align: center;">We appreciate your participation in this study.</p>
        `
    });

    await survey.showPage({ id: 'welcome_page', elements: [welcome] });

    const q1 = new SingleSelect({
        id: 'travel_frequency',
        text: 'How often do you travel for business?',
        options: ['Never', 'Once a year', '2-3 times a year', '4-6 times a year', 'Monthly', 'Weekly'],
        required: true
    });

    await survey.showPage({ id: 'page1', elements: [q1] });

    if (survey.getResponse('travel_frequency') !== 'Never') {
        const q2 = new MultiSelect({
            id: 'travel_destinations',
            text: 'Which regions do you typically travel to for business? (Select all that apply)',
            options: ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Australia'],
            required: true
        });

        await survey.showPage({ id: 'page2', elements: [q2] });

        const destinations = survey.getResponse('travel_destinations');
        for (const destination of destinations) {
            const q_destination = new OpenEnd({
                id: `travel_experience_${destination}`,
                text: `Please describe your typical business travel experience in ${destination}:`,
                minLength: 10,
                maxLength: 200,
                required: true
            });

            await survey.showPage({ id: `page_${destination}`, elements: [q_destination] });
        }

        const q3 = new OrderedScale({
            id: 'travel_importance',
            text: 'How important are the following factors when choosing a business travel destination?',
            min: 1,
            max: 5,
            labels: ['Not important', '', 'Neutral', '', 'Very important'],
            required: true
        });

        await survey.showPage({ id: 'page3', elements: [q3] });

        const q4 = new Grid({
            id: 'travel_satisfaction',
            text: 'Please rate your satisfaction with the following aspects of your most recent business trip:',
            rows: ['Flight', 'Hotel', 'Transportation', 'Food', 'Meeting facilities'],
            columns: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
            required: true
        });

        await survey.showPage({ id: 'page4', elements: [q4] });

        const q5 = new NumberEntry({
            id: 'travel_budget',
            text: 'What is your average budget per business trip (in USD)?',
            min: 100,
            max: 10000,
            required: true
        });

        await survey.showPage({ id: 'page5', elements: [q5] });

        const q6 = new OpenEnd({
            id: 'travel_improvement',
            text: 'What one thing would most improve your business travel experience?',
            minLength: 10,
            maxLength: 200,
            required: true
        });

        await survey.showPage({ id: 'page6', elements: [q6] });
    }

    survey.finishSurvey(`
        <h1 style="color: #4682b4;">Thank you for completing our business travel survey!</h1>
        <p>Your insights will help us improve business travel experiences.</p>
        <p>If you have any questions, please contact us at <a href="mailto:research@example.com" style="color: #4682b4;">research@example.com</a>.</p>
    `);
}

runSurvey();