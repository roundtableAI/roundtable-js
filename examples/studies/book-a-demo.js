import Survey from '../../library/core/survey.js';
import TextInput from '../../library/elements/textInput.js';
import HTML from '../../library/elements/HTML.js';
import OpenEnd from '../../library/elements/openEnd.js';
import PageHTML from '../../library/plugins/pageHTML.js';

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
            }
        }
    });

    const logo = new PageHTML({
        id: 'logo',
        content: '<img src="https://roundtable.ai/images/logo-with-text.svg" alt="Roundtable Logo">',
        position: 'top',
        styles: {
            root: {
                display: 'block',
                margin: '0 auto',
                maxWidth: '190px',
                marginBottom: '20px'
            }
        }
    });

    survey.addPlugin(logo);

    const subtitle = new HTML({
        id: 'subtitle',
        content: '<p style="text-align: center; color: #666; margin-top: -10px;">Please fill out this form and a member of our sales team will contact you.</p>'
    });

    const email = new TextInput({
        id: 'email',
        text: 'Email',
        required: true,
        placeholder: 'Your email',
    });

    const name = new TextInput({
        id: 'name',
        text: 'Name',
        required: true,
        placeholder: 'Your name',
    });

    const company = new TextInput({
        id: 'company',
        text: 'Company',
        required: true,
        placeholder: 'Your company name',
    });

    const role = new TextInput({
        id: 'role',
        text: 'Role',
        required: true,
        placeholder: 'Your role',
    });

    const participantVolume = new TextInput({
        id: 'participantVolume',
        text: 'What is your average participant volume per month?',
        required: true,
        placeholder: 'Average participant volume',
    });

    const businessType = new TextInput({
        id: 'businessType',
        text: 'What % B2B vs B2C?',
        required: true,
        placeholder: 'Your answer',
    });
  
    const hearAboutUs = new TextInput({
        id: 'hearAboutUs',
        text: 'How did you hear about us?',
        required: false,
        placeholder: 'Optional',
    });

    const additionalComments = new OpenEnd({
        id: 'additionalComments',
        text: 'Additional comments',
        required: false,
        placeholder: 'Optional',
    });

  const builtWith = new PageHTML({
      id: 'builtWith',
      content: '<div>Built with <a href="https://docs.roundtable.ai/rjs/introduction" target="_blank" style="color: black;">RoundtableJS</a></div>',
      position: 'bottom',
      styles: {
          root: {
              position: 'absolute',
              bottom: '49px',
              right: '25px',
              fontSize: '14px',
              padding: '0px',
              textAlign: 'right',
          }
      }
  });

  survey.addPlugin(builtWith);

  await survey.showPage({
      id: 'demoForm',
      elements: [
          subtitle,
          email,
          name,
          company,
          role,
          participantVolume,
          businessType,
          hearAboutUs,
          additionalComments,
      ]
  });

  survey.removePlugin(builtWith);

  survey.finishSurvey(`
      <h2 style="text-align: center; color: black; font-weight: 400 !important;">Thank you for your interest</h2>
      <p style="text-align: center; color: #666666 !important; font-weight: 400 !important; margin-top: -10px;">A member of our sales team will contact you shortly.</p>
      <div style="text-align: center; margin-top: 30px; margin-bottom: 10px">
          <a href="https://www.roundtable.ai" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 400 !important; font-size: 16px;">Back to our website</a>
      </div>
  `);
}

runSurvey();