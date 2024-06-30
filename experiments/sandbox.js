// Import core survey components
import Survey from '../core/survey.js';
import Page from '../core/page.js';
import MultipleChoice from '../question_types/multipleChoice.js';
import Grid from '../question_types/grid.js';

// Utility function to normalize keys
const normalizeKey = (str) => str.replace(/\s+/g, '_').toLowerCase();

// Create and initialize a new survey
const survey = new Survey('beverageSurvey', 'Comprehensive Beverage Consumption Survey');

// Constructs and populates pages with appropriate survey questions and logic
function constructSurveyPages() {
    const surveyPages = [];
    const surveyQuestions = [
        {
            id: 'q1a',
            text: 'On what occasions, or for what purposes do you regularly use beverages?',
            options: [
                'In the morning',
                'With meals',
                'As a snack',
                'With desserts',
                'As a refreshing drink',
                'As a health supplement'
            ]
        },
        {
            id: 'q1b',
            text: 'How often do you use beverages for the following purposes?',
            grid: true,
            rows: (data) => Array.isArray(data['q1a']) ? data['q1a'] : [],
            columns: [
                'Everyday',
                'Four or five times a week',
                'Two or three times a week',
                'Once a week',
                'Three times a month',
                'Twice a month',
                'Once a month',
                'Less Often'
            ]
        },
        {
            id: 'q1c',
            text: 'How many times a day do you use beverages for the following occasions?',
            grid: true,
            rows: (data) => {
                if (!Array.isArray(data['q1a']) || !data.q1b) return [];
                const everydayRows = [];
                data['q1a'].forEach((occasion) => {
                    const key = normalizeKey(occasion);
                    if (data.q1b[key] && data.q1b[key] === 'Everyday') {
                        everydayRows.push(occasion);
                    }
                });
                return everydayRows;
            },
            columns: [
                '1 time a day',
                '2 times a day',
                '3 times a day',
                '4 times a day',
                '5 times a day',
                '6 times a day',
                '7 times a day',
                '8 times a day'
            ]
        }
    ];

    surveyQuestions.forEach((question, index) => {
        const page = new Page(`page${index + 1}`, data => 
            index === 0 || (data[surveyQuestions[index - 1].id] && data[surveyQuestions[index - 1].id].length > 0)
        );
        if (question.grid) {
            page.addElement(new Grid(question.id, question.text, question.rows, question.columns, true));
        } else {
            page.addElement(new MultipleChoice(question.id, question.text, question.options));
        }
        surveyPages.push(page);
    });

    return surveyPages;
}

// Add constructed pages to the survey
const initialPages = constructSurveyPages();
initialPages.forEach(page => survey.addPage(page));

// Override submitData to handle logic after data is received
const originalSubmitData = survey.submitData.bind(survey);
survey.submitData = (data) => {
    // Normalize keys for q1b
    const normalizedData = { ...data, q1b: {} };
    if (data.q1b) {
        for (const key in data.q1b) {
            const normalizedKey = normalizeKey(key);
            normalizedData.q1b[normalizedKey] = data.q1b[key];
        }
    }
    console.log(normalizedData);
    const updatedPage = originalSubmitData(normalizedData);
    return updatedPage;
};

// Export the configured survey
export default survey;
