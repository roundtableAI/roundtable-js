import Survey from '../../library/core/survey.js';
import HTML from '../../library/elements/HTML.js';
import TextInput from '../../library/elements/textInput.js';
import OpenEnd from '../../library/elements/openEnd.js';

async function runSurvey() {
    const survey = new Survey({
        condition: 'test',
        participant_id: 'p123',
        styles: {
            container: {
                maxWidth: '650px',
                padding: '30px',
                paddingTop: '40px',
                paddingBottom: '50px',
                position: 'relative',
            },
            button: {
                backgroundColor: 'black',
                '&:hover': {
                    backgroundColor: '#333333',
                }
            },
            question: {
                fontWeight: 'normal',
            },
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            },
            finishMessage: {
                color: 'black',
                position: 'relative',
                paddingBottom: '30px',
            }
        }
    });

    const logo = new HTML({
        id: 'logo',
        content: '<img src="https://roundtable.ai/images/logo-with-text.svg" alt="Roundtable Logo" style="display: block; margin: 0 auto; max-width: 190px; margin-bottom: 20px;">'
    });

    const subtitle = new HTML({
        id: 'subtitle',
        content: '<p style="text-align: center; color: #666; margin-top: -10px;">Please fill out this form and a member of our sales team will contact you.</p>'
    });

    const email = new TextInput({
        id: 'email',
        text: 'Email',
        required: true,
        placeholder: 'Your email',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const name = new TextInput({
        id: 'name',
        text: 'Name',
        required: true,
        placeholder: 'Your name',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const company = new TextInput({
        id: 'company',
        text: 'Company',
        required: true,
        placeholder: 'Your company name',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const role = new TextInput({
        id: 'role',
        text: 'Role',
        required: true,
        placeholder: 'Your role',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const participantVolume = new TextInput({
        id: 'participantVolume',
        text: 'What is your average participant volume per month?',
        required: true,
        placeholder: 'Average participant volume',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const businessType = new TextInput({
        id: 'businessType',
        text: 'What % B2B vs B2C?',
        required: true,
        placeholder: 'Your answer',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });
  
    const hearAboutUs = new TextInput({
        id: 'hearAboutUs',
        text: 'How did you hear about us?',
        required: false,
        placeholder: 'Optional',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const additionalComments = new OpenEnd({
        id: 'additionalComments',
        text: 'Additional comments',
        required: false,
        placeholder: 'Optional',
        styles: {
            label: {
                fontWeight: 'normal',
                fontSize: '16px',
            }
        }
    });

    const builtWith = new HTML({
        id: 'builtWith',
        content: '<div>Built with <a href="https://docs.roundtable.ai/rjs/introduction" target="_blank">RoundtableJS</a></div>',
        styles: {
            root: {
                position: 'absolute',
                bottom: '10px',
                margin: '0',
                fontSize: '14px',
                right: '15px',
                padding: '0px',
                textAlign: 'right',
                '& a': {
                    color: 'black'
                },
                '@media (max-width: 650px)': {
                  right: '10px',
                  bottom: '-5px',
                }
            }
        }
    });

    await survey.showPage({
        id: 'demoForm',
        elements: [
            logo,
            subtitle,
            email,
            name,
            company,
            role,
            participantVolume,
            businessType,
            hearAboutUs,
            additionalComments,
            builtWith
        ]
    });

    survey.finishSurvey(`
        <img src="https://roundtable.ai/images/logo-with-text.svg" alt="Roundtable Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
        <h2 style="text-align: center; color: black; font-weight: 400 !important;">Thank you for your interest</h2>
        <p style="text-align: center; color: #666666 !important; font-weight: 400 !important; margin-top: -10px;">A member of our sales team will contact you shortly.</p>
        <div style="text-align: center; margin-top: 30px; margin-bottom: 10px">
            <a href="https://www.roundtable.ai" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 400 !important; font-size: 16px;">Back to our website</a>
        </div>
        <div style="position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 14px;">Built with <a href="https://docs.roundtable.ai/rjs/introduction" style="color: black; text-decoration: none; display: inline;">RoundtableJS</a></div>
    `);
}

runSurvey();