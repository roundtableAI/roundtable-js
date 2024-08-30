import Survey from '../../library/core/survey.js';
import HTML from '../../library/elements/HTML.js';
import NumberScale from '../../library/elements/numberScale.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import PageHTML from '../../library/plugins/pageHTML.js';

async function runSurvey() {
    const survey = new Survey({
        condition: 'starbucks_nps',
        participant_id: 'p123',
        styles: {
            body: {
                color: '#1e3932',
            },
            container: {
                color: '#1e3932',
                maxWidth: '600px',
            },
            button: {
                backgroundColor: '#00704A',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#004E33'
                }
            }
        }
    });

    const logo = new PageHTML({
        id: 'starbucks_logo',
        content: '<img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png" alt="Starbucks Logo" style="max-width: 100px; margin: 0 auto 20px; display: block;">',
        position: 'top',
        styles: {
            root: {
                marginTop: '10px',
                marginBottom: '30px',
            }
        }
    });

    survey.addPlugin(logo);

    const welcome = new HTML({
        id: 'welcome_message',
        content: '<h2>Starbucks Customer Feedback</h2><p>We value your opinion. This short survey will take about 1-2 minutes to complete.</p>',
        styles: {
            root: {
                textAlign: 'center',
                marginBottom: '30px',
            }
        }
    });

    const npsQuestion = new NumberScale({
        id: 'nps_score',
        text: 'How likely are you to recommend Starbucks to a friend or colleague?',
        subText: 'Please rate on a scale from 0 (Not at all likely) to 10 (Extremely likely)',
        min: 1,
        max: 7,
        minLabel: 'Not at all likely',
        maxLabel: 'Extremely likely',
        required: true,
        styles: {
            subText: {
                fontSize: '14px',
                fontStyle: 'italic',
                marginBottom: '15px',
            },
        }
    });

    const experienceQuestion = new SingleSelect({
        id: 'experience_rating',
        text: 'How would you rate your overall experience with Starbucks?',
        options: [
            'Excellent',
            'Very Good',
            'Good',
            'Fair',
            'Poor'
        ],
        required: true,
        styles: {
            text:{
              marginBottom: '15px',
            },
            label: {
                fontWeight: 'bold',
                color: '#00704A'
            },
        }
    });

    const thankYou = new PageHTML({
        id: 'thank_you_message',
        content: '<h2>Thank you for your feedback!</h2><p>We appreciate your time and input. Your responses will help us improve our services.</p>',
        styles: {
            root: {
                textAlign: 'center',
                marginTop: '30px'
            }
        }
    });

    await survey.showPage({ id: 'page1', elements: [welcome, npsQuestion] });
    await survey.showPage({ id: 'page2', elements: [experienceQuestion] });
    survey.finishSurvey(thankYou.content);
}

runSurvey();