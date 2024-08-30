import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import HTML from '../../library/elements/HTML.js';
import NumberScale from '../../library/elements/numberScale.js';

async function runSurvey() {
    const survey = new Survey({
        condition: 'test',
        participant_id: 'p123',
        styles: {
            body: {
                fontWeight: '300 !important',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#ebf2f5',
                padding: '0px',
            },
            container: {
                maxWidth: '800px',
                width: '100%',
                padding: '40px',
                boxShadow: 'none',
                background: 'none',
            },
            button: {
              background: '#404040',
              borderRadius: '12px',            
              transition: 'all 0.15s ease',
              display: 'block',
              margin: '0 auto',
              '&:hover': {
                    transform: 'scale(1.1)',
              },
            },
            Element: {
                text: {
                    fontSize: '32px',
                    marginBottom: '30px',
                },
                subText: {
                    fontSize: '18px',
                    marginBottom: '30px',
                    textAlign: 'center',
                },
            },
        }
    });

    const initialPage = new HTML({
        id: 'initial-page',
        content: `
            <h1 style="font-size: 36px; text-align: center; margin-bottom: 20px; font-weight: 300;">How was our product?</h1>
            <div style="font-size: 24px; text-align: center; margin-bottom: 30px;">We'd love to hear about your experience.</div>`
    });

    const npsQuestion = new NumberScale({
        id: 'nps',
        text: 'How likely are you to recommend our product to a friend or colleague?',
        min: 0,
        max: 10,
        minLabel: 'Not at all likely',
        maxLabel: 'Extremely likely',
        required: true,
        styles: {
            scaleContainer: {
                marginTop: '20px',
            },
            scaleCircle: {
                transition: 'all 0.15s ease',
                background: 'transparent',
                border: '1px solid black',
                '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                },
            },
        }
    });

    const feedbackQuestion = new OpenEnd({
        id: 'feedback',
        text: 'What is the primary reason for your score?',
        required: true,
        styles: {
            textarea: {
                width: '100%',
                padding: '16px',
                fontSize: '20px',
                border: '1px solid black',
                borderRadius: '10px',
                resize: 'vertical',
                minHeight: '150px',
                transition: 'border-color 0.3s ease',
                '&:focus': {
                    borderColor: 'black',
                    outline: 'none',
                },
            }
        }
    });

    const enterHint = new PageHTML({
        id: 'enter-hint',
        content: '<div>Or press Enter ↵</div>',
        position: 'bottom',
        targetId: 'navigation',
        styles: {
            root: {
                fontSize: '12px',
                color: '#888',
                marginTop: '5px',
                textAlign: 'center',
            }
        }
    });

    survey.addPlugin(enterHint);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const nextButton = document.getElementById('next-button');
            if (nextButton) {
                nextButton.click();
            } else {
                const startButton = document.getElementById('start-survey');
                if (startButton) {
                    startButton.click();
                }
            }
        }
    });

    await survey.showPage({ id: 'initial', elements: [initialPage] });
    await survey.showPage({ id: 'page1', elements: [npsQuestion] });
    await survey.showPage({ id: 'page2', elements: [feedbackQuestion] });

    survey.removePlugin(enterHint);

    survey.finishSurvey(`
        <h2 style="font-size: 32px; text-align: center; margin-bottom: 20px; font-weight: 300;">Thank you for your feedback!</h2>
        <p style="font-size: 18px; text-align: center;">Your responses have been recorded and will help us improve our product.</p>
    `);
}

runSurvey();