// data_labeler.js
import Survey from '../core/survey.js';
import Page from '../core/page.js';
import SingleChoice from '../question_types/singleChoice.js';

// Create and initialize a new survey
const survey = new Survey('animalSurvey', 'Dog or Cat Identification Survey');

// Constructs and populates pages with appropriate survey questions and logic
function constructSurveyPages() {
    const surveyPages = [];

    // Add images and questions for each page
    const surveyQuestions = [
        {
            id: 'q1',
            text: 'Is this a dog or a cat?',
            imgSrc: 'assets/images/dog.jpg',
            options: ['Dog', 'Cat']
        },
        {
            id: 'q2',
            text: 'Is this a dog or a cat?',
            imgSrc: 'assets/images/cat.jpg',
            options: ['Dog', 'Cat']
        }
    ];

    surveyQuestions.forEach((question, index) => {
        const page = new Page(`page${index + 1}`);
        const imgHtml = `<img src="${question.imgSrc}" alt="Image ${index + 1}" style="width:300px;">`;

        // Add the single choice question with the image HTML content
        page.addElement(new SingleChoice(question.id, question.text, question.options, false, imgHtml));

        surveyPages.push(page);
    });

    return surveyPages;
}

// Add constructed pages to the survey
const initialPages = constructSurveyPages();
initialPages.forEach(page => survey.addPage(page));

// Export the configured survey
export default survey;
