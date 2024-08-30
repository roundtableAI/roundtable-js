import Survey from '../../library/core/survey.js';
import BoundingBox from '../../library/elements/boundingBox.js';
import CheckBox from '../../library/elements/checkBox.js';
import TextInput from '../../library/elements/textInput.js';
import DropdownSelect from '../../library/elements/dropdownSelect.js';
import Grid from '../../library/elements/grid.js';
import HTML from '../../library/elements/HTML.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import NumberEntry from '../../library/elements/numberEntry.js';
import NumberScale from '../../library/elements/numberScale.js';
import OpenEnd from '../../library/elements/openEnd.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import ProgressBar from '../../library/plugins/progressBar.js';
import PageHTML from '../../library/plugins/pageHTML.js';

async function runSurvey() {
    const survey = new Survey({
        title: "Comprehensive Survey Example",
        description: "This survey demonstrates all question types and plugins.",
        styles: {
            body: {
                background: '#f9f9f7',
            }
        }
    });

    const htmlIntro = new HTML({
        id: 'intro',
        content: '<h1>Welcome to our element showcase</h1><p>This survey include examples of every question type and plugin. The code for the survey is available on our <a href="https://github.com/roundtableAI/roundtable-js" target="_blank">GitHub</a>.</p>',
        styles: {
            root: {
                textAlign: 'center',
            }
        }
    });

  
    const textInput = new TextInput({
        id: 'name',
        text: 'Name',
        required: true,
        placeholder: 'Your name',
    })

    const singleSelect = new SingleSelect({
        id: 'favorite-color',
        text: 'What is your favorite color?',
        subText: 'Select one option',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        required: true,
        allowOther: true,
    });

    const multiSelect = new MultiSelect({
        id: 'hobbies',
        text: 'Which of the following are your hobbies? (Select all that apply)',
        options: ['Reading', 'Sports', 'Cooking', 'Gaming', 'Traveling'],
        required: true,
        minSelect: 1,
        maxSelect: 3
    });

    const dropdownSelect = new DropdownSelect({
        id: 'country',
        text: 'Select your country of residence',
        options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Other'],
        required: true
    });


    const checkBox = new CheckBox({
        id: 'terms',
        text: 'I agree to the terms and conditions',
        required: true
    });

    const numberEntry = new NumberEntry({
        id: 'age',
        text: 'Please enter your age',
        min: 18,
        max: 100,
        required: true
    });

    const numberScale = new NumberScale({
        id: 'satisfaction',
        text: 'How satisfied are you with our service?',
        min: 1,
        max: 10,
        minLabel: 'Not at all satisfied',
        maxLabel: 'Extremely satisfied',
        required: true
    });

    const openEnd = new OpenEnd({
        id: 'feedback',
        text: 'Please provide any additional feedback you may have',
        required: false,
        maxLength: 500
    });

    const grid = new Grid({
        id: 'feature-rating',
        text: 'Please rate the following features of our product',
        rows: ['Ease of use', 'Performance', 'Design', 'Customer support'],
        columns: ['Poor', 'Fair', 'Good', 'Excellent'],
        required: true
    });

    const boundingBox = new BoundingBox({
        id: 'image-selection',
        text: 'Please draw a box around the house',
        imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        required: true
    });

    // Group questions into pages
    const page1 = { id: 'page1', elements: [htmlIntro, textInput, singleSelect, multiSelect, dropdownSelect] };
    const page2 = { id: 'page2', elements: [checkBox, numberEntry, numberScale, openEnd] };
    const page3 = { id: 'page3', elements: [grid, boundingBox] };

    const progress = new ProgressBar({ maxPages: 3 });

    const logo = new PageHTML({
        id: 'logo',
        content: '<img src="https://roundtable.ai/images/logo-with-text.svg" alt="Company Logo">',
        position: 'top',
        styles:{
            root: {
                margin: '0 auto',
                width: '100%',
                maxWidth: '180px',
                marginTop: '5px',
                marginBottom: '10px'
            }
        }
    });
    survey.addPlugin(logo);
    survey.addPlugin(progress);

    // Show pages sequentially
    await survey.showPage(page1);
    await survey.showPage(page2);
    await survey.showPage(page3);

    // Finish the survey
    survey.finishSurvey(`
        <h2>Thank you for completing our comprehensive survey!</h2>
        <p>Your responses have been recorded and will help us improve our services.</p>
    `);

    // Log the survey data (in a real scenario, you'd probably send this to a server)
    console.log('Survey data:', survey.getAllSurveyData());
}

// Run the survey
runSurvey();