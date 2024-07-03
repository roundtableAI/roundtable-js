// Import core survey components
import Survey from '../core/survey.js';
import Page from '../core/page.js';
import MultipleSelect from '../question_types/multipleSelect.js';
import Grid from '../question_types/grid.js';

// Define survey questions
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
    }
];

const followUpQuestions = {
    morning: {
        id: 'q2a_multi',
        text: 'You said you use beverages in the morning. In which of the following ways do you use it in the morning?',
        options: ['With breakfast', 'As a morning pick-me-up', 'As a part of a morning workout', 'Other']
    },
    meals: {
        id: 'q3a_multi',
        text: 'You said you use beverages with meals. In which of the following ways do you use it with meals?',
        options: ['With lunch', 'With dinner', 'With snacks', 'Other']
    },
    everyday: {
        id: 'q1c',
        text: 'How many times a day do you use these beverages?',
        columns: ['1 time a day', '2 times a day', '3 times a day', '4 times a day', '5 times a day']
    }
};

// Create and initialize a new survey
const survey = new Survey('sandbox', 'Sandbox Survey');

// Constructs and populates pages with appropriate survey questions and logic
function constructSurveyPages() {
    const surveyPages = [];

    surveyQuestions.forEach((question, index) => {
        const page = new Page(`page${index + 1}`, data => 
            index === 0 || (data[surveyQuestions[index - 1].id] && data[surveyQuestions[index - 1].id].length > 0)
        );
        if (question.grid) {
            page.addElement(new Grid(question.id, question.text, question.rows, question.columns, true));
        } else {
            page.addElement(new MultipleSelect(question.id, question.text, question.options));
        }
        surveyPages.push(page);
    });

    return surveyPages;
}

// Add constructed pages to the survey
const initialPages = constructSurveyPages();
initialPages.forEach(page => survey.addPage(page));

// Function to add follow-up questions based on `q1a`
function addFollowUpQuestionsBasedOnQ1a(data) {
    const followUpPages = [];

    if (data.q1a && data.q1a.includes('In the morning')) {
        const page = new Page('page_followup_q2a_multi', () => true);
        page.addElement(new MultipleSelect(followUpQuestions.morning.id, followUpQuestions.morning.text, followUpQuestions.morning.options));
        followUpPages.push(page);
    }

    if (data.q1a && data.q1a.includes('With meals')) {
        const page = new Page('page_followup_q3a_multi', () => true);
        page.addElement(new MultipleSelect(followUpQuestions.meals.id, followUpQuestions.meals.text, followUpQuestions.meals.options));
        followUpPages.push(page);
    }

    return followUpPages;
}

// Function to add follow-up questions based on `q1b`
function addFollowUpQuestionsBasedOnQ1b(data) {
    const followUpPages = [];
    const everydaySelections = data.q1b ? data.q1b.filter(item => item.column === 'Everyday').map(item => item.row) : [];

    if (everydaySelections.length > 0) {
        const page = new Page('page_followup_q1c', () => true);
        page.addElement(new Grid(followUpQuestions.everyday.id, followUpQuestions.everyday.text, everydaySelections, followUpQuestions.everyday.columns, true));
        followUpPages.push(page);
    }

    return followUpPages;
}

// Track if follow-up pages have been added
let followUpPagesBasedOnQ1aAdded = false;
let followUpPagesBasedOnQ1bAdded = false;

// Override submitData to handle logic after data is received
const originalSubmitData = survey.submitData.bind(survey);
survey.submitData = (data) => {
    // Add follow-up questions based on `q1a` at the end of the survey if not already added
    if (!followUpPagesBasedOnQ1aAdded) {
        const followUpPages = addFollowUpQuestionsBasedOnQ1a(data);
        if (followUpPages.length > 0) {
            followUpPages.forEach(page => survey.addPage(page));
            followUpPagesBasedOnQ1aAdded = true; // Mark follow-up pages as added
        }
    }

    // Check if the current page contains `q1b` and add follow-up questions based on `q1b` immediately after it
    const currentPage = survey.pages[survey.currentPageIndex];
    if (currentPage.elements.some(element => element.id === 'q1b') && !followUpPagesBasedOnQ1bAdded) {
        const followUpPages = addFollowUpQuestionsBasedOnQ1b(data);
        if (followUpPages.length > 0) {
            followUpPages.forEach(page => survey.insertPagesAtIndex([page], survey.currentPageIndex + 1));
            followUpPagesBasedOnQ1bAdded = true; // Mark follow-up pages as added
        }
    }

    const updatedPage = originalSubmitData(data);

    return updatedPage;
};

// Export the configured survey
export default survey;
