import Survey from '../../library/core/survey.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import CheckBox from '../../library/elements/checkBox.js';
import TextInput from '../../library/elements/textInput.js';
import NumberEntry from '../../library/elements/numberEntry.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import OrderedScale from '../../library/elements/orderedScale.js';
import Grid from '../../library/elements/grid.js';
import OpenEnd from '../../library/elements/openEnd.js';
import HTML from '../../library/elements/HTML.js';
import BoundingBox from '../../library/elements/boundingBox.js';

async function runSurvey() {
    const survey = new Survey({});

    const singleSelect = new SingleSelect({
        id: 'favorite_color',
        text: 'What is your favorite color?',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        required: true,
        customValidation: (value) => {
            return value !== 'Yellow' || 'Yellow is not a valid choice for this survey.';
        }
    });

    const checkBox = new CheckBox({
        id: 'terms',
        text: 'I agree to the terms and conditions',
        required: true,
        customValidation: (value) => {
            return value === true || 'You must agree to the terms and conditions to continue.';
        }
    });

    const textInput = new TextInput({
        id: 'email',
        text: 'Enter your email address',
        required: true,
        customValidation: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) || 'Please enter a valid email address.';
        }
    });

    const numberEntry = new NumberEntry({
        id: 'age',
        text: 'Enter your age',
        min: 18,
        max: 100,
        required: true,
        customValidation: (value) => {
            return (value >= 21) || 'You must be at least 21 years old to participate.';
        }
    });

    const multiSelect = new MultiSelect({
        id: 'hobbies',
        text: 'Select your hobbies',
        options: ['Reading', 'Sports', 'Music', 'Travel', 'Cooking'],
        minSelected: 2,
        maxSelected: 4,
        required: true,
        customValidation: (value) => {
            return !value.includes('Sports') || value.includes('Travel') || 'If you select Sports, you must also select Travel.';
        }
    });

    const orderedScale = new OrderedScale({
        id: 'satisfaction',
        text: 'Rate your satisfaction',
        min: 1,
        max: 5,
        labels: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        required: true,
        customValidation: (value) => {
            return value > 3 || 'We\'re sorry you\'re not satisfied. Please contact customer support.';
        }
    });

    const grid = new Grid({
        id: 'product_ratings',
        text: 'Rate our products',
        rows: ['Product A', 'Product B', 'Product C'],
        columns: ['Poor', 'Fair', 'Good', 'Excellent'],
        required: true,
        customValidation: (value) => {
            const ratings = Object.values(value);
            return !ratings.includes('Poor') || 'Please contact us if you rated any product as Poor.';
        }
    });

    const openEnd = new OpenEnd({
        id: 'feedback',
        text: 'Please provide additional feedback',
        required: true,
        minLength: 10,
        maxLength: 500,
        customValidation: (value) => {
            return !value.toLowerCase().includes('bad') || 'Please avoid using the word "bad" in your feedback.';
        }
    });

    const html = new HTML({
        id: 'info',
        content: '<h2>Thank you for your responses so far!</h2><p>Please complete the final question below.</p>'
    });

    const boundingBox = new BoundingBox({
        id: 'image_area',
        text: 'Draw a box around the main subject in this image',
        imageUrl: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_640.jpg',
        required: true,
        customValidation: (value) => {
            return value.length === 1 || 'Please draw exactly one bounding box.';
        }
    });

    await survey.showPage({ id: 'page1', elements: [singleSelect, checkBox, textInput, numberEntry, multiSelect] });
    await survey.showPage({ id: 'page2', elements: [orderedScale, grid, openEnd, html, boundingBox] });

    survey.finishSurvey(`
        <h1>Thank you for completing our survey!</h1>
        <p>Your responses have been recorded.</p>
    `);
}

runSurvey();