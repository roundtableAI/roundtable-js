import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import NumberEntry from '../../library/elements/numberEntry.js';
import HTML from '../../library/elements/html.js';


async function runSurvey() {
    const survey = new Survey({
        condition: 'coca_cola_nps',
        participant_id: 'p123',
        styles: {
            body: {
                backgroundColor: '#F40009',
                color: '#FFFFFF',
                fontFamily: 'Arial, sans-serif'
            },
            container: {
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderRadius: '10px',
                padding: '20px',
                maxWidth: '600px',
                margin: '20px auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            },
            button: {
                backgroundColor: '#F40009',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#C5000B'
                }
            }
        }
    });

    const logo = new HTML({
        id: 'coca_cola_logo',
        content: '<img src="https://www.coca-cola.com/content/dam/onexp/gt/en/home/asset-library/coca-cola-logo.png" alt="Coca-Cola Logo" style="max-width: 200px; margin: 0 auto 20px; display: block;">',
    });

    const welcome = new HTML({
        id: 'welcome_message',
        content: '<h2>Welcome to the Coca-Cola Customer Satisfaction Survey</h2><p>Your feedback is important to us. This short survey will take about 3-5 minutes to complete.</p>',
        styles: {
            root: {
                textAlign: 'center',
                marginBottom: '30px'
            }
        }
    });

    const frequencyQuestion = new SingleSelect({
        id: 'purchase_frequency',
        text: 'How often do you purchase Coca-Cola products?',
        options: [
            'Daily',
            'Several times a week',
            'Once a week',
            'A few times a month',
            'Once a month',
            'Less than once a month',
            'Never'
        ],
        required: true,
        styles: {
            label: {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#F40009'
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

    const npsQuestion = new NumberEntry({
        id: 'nps_score',
        text: 'How likely are you to recommend Coca-Cola to a friend or colleague?',
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
                color: '#F40009'
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

    const reasonQuestion = new OpenEnd({
        id: 'nps_reason',
        text: 'What is the primary reason for your score?',
        required: true,
        minLength: 10,
        maxLength: 500,
        rows: 4,
        styles: {
            label: {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#F40009'
            },
            textarea: {
                fontSize: '16px',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
                resize: 'vertical'
            }
        }
    });

    const improvementQuestion = new OpenEnd({
        id: 'improvement_suggestion',
        text: 'How can we improve your experience with Coca-Cola products?',
        required: false,
        minLength: 0,
        maxLength: 500,
        rows: 4,
        styles: {
            label: {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#F40009'
            },
            textarea: {
                fontSize: '16px',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
                resize: 'vertical'
            }
        }
    });

    const thankYou = new HTML({
        id: 'thank_you_message',
        content: '<h2>Thank you for your feedback!</h2><p>We appreciate your time and input. Your responses will help us improve our products and services.</p>',
        styles: {
            root: {
                textAlign: 'center',
                marginTop: '30px'
            }
        }
    });

    await survey.showPage({ id: 'page1', elements: [logo, welcome, frequencyQuestion] });
    await survey.showPage({ id: 'page2', elements: [logo, npsQuestion, reasonQuestion] });
    await survey.showPage({ id: 'page3', elements: [logo, improvementQuestion] });
    survey.finishSurvey(thankYou.content);
}

runSurvey();