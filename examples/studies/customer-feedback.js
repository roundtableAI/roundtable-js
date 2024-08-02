import Survey from '../../library/core/survey.js';
import HTML from '../../library/elements/HTML.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import NumberEntry from '../../library/elements/numberEntry.js';

async function runSurvey() {
    const survey = new Survey({
        condition: 'starbucks_nps',
        participant_id: 'p123',
        styles: {
            body: {
                backgroundColor: '#f7f7f7',
                color: '#1e3932',
                fontFamily: 'Arial, sans-serif'
            },
            container: {
                backgroundColor: '#FFFFFF',
                color: '#1e3932',
                borderRadius: '10px',
                padding: '20px',
                maxWidth: '600px',
                margin: '20px auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            button: {
                backgroundColor: '#00704A',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#004E33'
                }
            }
        }
    });

    const logo = new HTML({
        id: 'starbucks_logo',
        content: '<img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png" alt="Starbucks Logo" style="max-width: 100px; margin: 0 auto 20px; display: block;">',
    });

    const welcome = new HTML({
        id: 'welcome_message',
        content: '<h2>Starbucks Customer Feedback</h2><p>We value your opinion. This short survey will take about 1-2 minutes to complete.</p>',
        styles: {
            root: {
                textAlign: 'center',
                marginBottom: '30px'
            }
        }
    });

    const npsQuestion = new NumberEntry({
        id: 'nps_score',
        text: 'How likely are you to recommend Starbucks to a friend or colleague?',
        subText: 'Please rate on a scale from 0 (Not at all likely) to 10 (Extremely likely)',
        min: 0,
        max: 10,
        step: 1,
        required: true,
        styles: {
            label: {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#00704A'
            },
            subText: {
                fontSize: '14px',
                marginBottom: '15px',
                fontStyle: 'italic'
            },
            input: {
                fontSize: '16px',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '60px'
            }
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
            label: {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#00704A'
            },
            option: {
                marginBottom: '12px',
                fontSize: '16px'
            },
            radio: {
                marginRight: '10px'
            }
        }
    });

    const thankYou = new HTML({
        id: 'thank_you_message',
        content: '<h2>Thank you for your feedback!</h2><p>We appreciate your time and input. Your responses will help us improve our services.</p>',
        styles: {
            root: {
                textAlign: 'center',
                marginTop: '30px'
            }
        }
    });

    await survey.showPage({ id: 'page1', elements: [logo, welcome, npsQuestion] });
    await survey.showPage({ id: 'page2', elements: [logo, experienceQuestion] });
    survey.finishSurvey(thankYou.content);
}

runSurvey();