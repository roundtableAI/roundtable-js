// Import core survey components
import Survey from '../core/survey.mjs';
import Page from '../core/page.mjs';
import MultipleSelect from '../question_types/multipleSelect.mjs';
import SingleChoice from '../question_types/singleChoice.mjs';
import Grid from '../question_types/grid.mjs';

// Configuration for the dynamic generation of options based on previous selections
const beverageOptionProvider = {
    getOptions(data, key) {
        if (key === 's3b') {
            const selectedBeverages = data['s3a'] || [];
            const optionsMap = {
                'Tea': ['Loose leaf', 'Tea bags', 'Bottled / Ready-to-drink', 'Powdered'],
                'Coffee': ['Whole bean', 'Ground', 'Instant', 'Pods / Capsules'],
                'Juice': ['Bottled', 'Carton', 'Concentrate', 'Freshly squeezed'],
                'Soda': ['Cans', 'Bottles', 'Fountain / Syrup']
            };
            return selectedBeverages.flatMap(beverage => optionsMap[beverage] || []);
        } else if (key === 's4a') {
            const selectedBeverages = data['s3a'] || [];
            const optionsMap = {
                'Tea': ['Tea'],
                'Coffee': ['Coffee'],
                'Juice': ['Juice'],
                'Soda': ['Soda']
            };
            const options = selectedBeverages.flatMap(beverage => optionsMap[beverage] || []);
            return [...options, 'None of the above'];
        } else if (key === 's4b') {
            const selectedFormats = data['s4a'] || [];
            const optionsMap = {
                'Tea': ['Loose leaf', 'Tea bags', 'Bottled / Ready-to-drink', 'Powdered'],
                'Coffee': ['Whole bean', 'Ground', 'Instant', 'Pods / Capsules'],
                'Juice': ['Bottled', 'Carton', 'Concentrate', 'Freshly squeezed'],
                'Soda': ['Cans', 'Bottles', 'Fountain / Syrup']
            };
            return selectedFormats.flatMap(format => optionsMap[format] || []);
        }
        return [];
    }
};

// Function to generate s4c questions dynamically based on s4b selections
const generateS4CQuestions = (data) => {
    const selectedFormats = data['s4b'] || [];
    return selectedFormats.map(format => ({
        id: `s4c_${format.replace(/\s+/g, '_')}`,
        text: `For ${format}, do you prefer regular, low-calorie, or both options?`,
        options: ['Regular', 'Low-Calorie', 'Both']
    }));
};

// Function to finish survey
function finishSurvey() {
    document.getElementById('question-container').innerHTML = '<h2>Survey Complete!</h2>';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    console.log('Survey has been completed.');
}

// Create and initialize a new survey
const survey = new Survey('beverageSurvey', 'Comprehensive Beverage Consumption Survey');

// Constructs and populates pages with appropriate survey questions and logic
function constructSurveyPages() {
    const surveyPages = [];
    const surveyQuestions = [
        {
            id: 's3a',
            text: 'Which types of beverages have you consumed in the last year? Please select all that apply.',
            options: ['Tea', 'Coffee', 'Juice', 'Soda', 'None of the above']
        },
        {
            id: 's3b',
            text: 'Which formats of these beverages have you purchased in the past year?',
            dynamic: true,
            options: data => beverageOptionProvider.getOptions(data, 's3b')
        },
        {
            id: 's4a',
            text: 'What formats of these beverages do you currently have at home?',
            dynamic: true,
            options: data => beverageOptionProvider.getOptions(data, 's4a')
        },
        {
            id: 's4b',
            text: 'Which formats of these beverages are currently in your home?',
            dynamic: true,
            options: data => beverageOptionProvider.getOptions(data, 's4b')
        }
    ];

    surveyQuestions.forEach((question, index) => {
        const page = new Page(`page${index + 1}`, data => 
            index === 0 || data[surveyQuestions[index - 1].id].length > 0
        );
        page.addElement(new MultipleSelect(question.id, question.text, question.options, question.dynamic));
        surveyPages.push(page);
    });

    return surveyPages;
}

// Add constructed pages to the survey
const initialPages = constructSurveyPages();
initialPages.forEach(page => survey.addPage(page));

// Function to dynamically insert s4c pages based on s4b responses and handle dynamic options
const insertDynamicS4CPages = (data, survey) => {
    const s4cQuestions = generateS4CQuestions(data);
    s4cQuestions.forEach((question, index) => {
        const page = new Page(`page_s4c_${index + 1}`, data => data['s4b'] && data['s4b'].length > 0);
        page.addElement(new SingleChoice(question.id, question.text, question.options, false));
        survey.pages.splice(survey.currentPageIndex + 1 + index, 0, page);
    });
};

// Function to handle "None of the above" logic
function handleNoneOfTheAbove(id) {
    document.addEventListener('change', (event) => {
        if (event.target.name === id) {
            const noneCheckbox = document.querySelector(`input[name="${id}"][value="None of the above"]`);
            if (event.target.value === 'None of the above') {
                if (event.target.checked) {
                    document.querySelectorAll(`input[name="${id}"]`).forEach(cb => {
                        if (cb !== noneCheckbox) {
                            cb.checked = false;
                        }
                    });
                }
            } else {
                if (event.target.checked) {
                    noneCheckbox.checked = false;
                }
            }
        }
    });
}

// Apply the "None of the above" logic to all multiple choice questions
initialPages.forEach(page => {
    page.elements.forEach(element => {
        if (element.type === 'multipleSelect') {
            handleNoneOfTheAbove(element.id);
        }
    });
});



// New question structures for detailed use cases
const constructDetailedQuestions = (format) => [
    {
        id: `q1a_${format.replace(/\s+/g, '_')}`,
        text: `On what occasions, or for what purposes do you regularly use ${format}?`,
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
        id: `q1b_${format.replace(/\s+/g, '_')}`,
        text: `How often do you use ${format} for the following purposes?`,
        grid: true,
        rows: (data) => data[`q1a_${format.replace(/\s+/g, '_')}`] || [],
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
    // {
    //     id: `q1c_${format.replace(/\s+/g, '_')}`,
    //     text: `You said you use ${format} everyday, on an average day how many times do you use it?`,
    //     grid: true,
    //     rows: (data) => data[`q1a_${format.replace(/\s+/g, '_')}`] || [],
    //     columns: [
    //         'Once a day',
    //         'Twice a day',
    //         'Three times a day',
    //         'Four times a day',
    //         'Five times a day',
    //         'Six times a day',
    //         'Seven times a day',
    //         '8 or more times a day'
    //     ]
    // },
    // {
    //     id: 'q1c',
    //     text: `You said you use ${format} everyday, on an average day how many times do you use it?`,
    //     grid: true,
    //     rows: q1aSelections
    //     columns: [
    //         'Once a day',
    //         'Twice a day',
    //         'Three times a day',
    //         'Four times a day',
    //         'Five times a day',
    //         'Six times a day',
    //         'Seven times a day',
    //         '8 or more times a day'
    //     ]
    // },
    // {
    //     id: 'q2a',
    //     text: `You said you use ${format} in the morning. In which of the following ways do you use it in the morning?`,
    //     options: [
    //         'As part of breakfast',
    //         'With morning snacks',
    //         'As a morning refreshment',
    //         'As a health drink in the morning',
    //         'Other (please specify)'
    //     ]
    // },
    // {
    //     id: 'q3a',
    //     text: `You said you use ${format} with meals; in what way do you use it with meals?`,
    //     options: [
    //         'As a beverage with breakfast',
    //         'As a beverage with lunch',
    //         'As a beverage with dinner',
    //         'As a drink with snacks',
    //         'As a drink with dessert',
    //         'Other (please specify)'
    //     ]
    // },
    // {
    //     id: 'q3b',
    //     text: `In the last week, how often did you use ${format} for the following purposes?`,
    //     grid: true,
    //     rows: [
    //         'As part of breakfast',
    //         'As part of lunch',
    //         'As part of dinner',
    //         'As a snack',
    //         'As a dessert',
    //         'As a health supplement'
    //     ],
    //     columns: [
    //         'More than once a day',
    //         'Once a day',
    //         'Four or five times a week',
    //         'Two or three times a week',
    //         'Once a week',
    //         'Not at all'
    //     ]
    // },
    // {
    //     id: 'q4a',
    //     text: `You said you use ${format} as a snack or dessert; in what way do you use it?`,
    //     options: [
    //         'With snacks',
    //         'With desserts',
    //         'As a standalone snack',
    //         'As a standalone dessert',
    //         'Other (please specify)'
    //     ]
    // },
    // {
    //     id: 'q5',
    //     text: `Thinking about your usage occasions of ${format} in the last week, please think about how many times you used it for these occasions.`,
    //     type: 'number',
    //     detailText: 'If you take all the occasions as 100%, please indicate roughly what proportion of occasions you used ${format} in the past week...',
    //     options: [
    //         'In the morning',
    //         'With meals',
    //         'As a snack',
    //         'With desserts',
    //         'As a refreshing drink',
    //         'As a health supplement'
    //     ]
    // },
    // {
    //     id: 'q6',
    //     text: `Which of the brands below do you regularly buy the following ${format} from?`,
    //     options: [
    //         'Brand A',
    //         'Brand B',
    //         'Brand C',
    //         'Brand D',
    //         'Brand E',
    //         'Private Label / Supermarket own brand',
    //         'Other (please specify)'
    //     ]
    // }
];

// Function to dynamically insert detailed questions based on format and q1a selections
const insertDetailedQuestions = (data, survey) => {
    // Extract formats from keys like 's4c_loose_leaf'
    const formatKeys = Object.keys(data).filter(key => key.startsWith('s4c_'));
    const formats = formatKeys.map(key => key.replace('s4c_', '').replace(/_/g, ' '));

    formats.forEach(format => {
        // Extract the selected options from q1a for this format
        const q1aSelections = data[`q1a_${format.replace(/\s+/g, '_')}`] || [];
        
        const detailedQuestions = constructDetailedQuestions(format, q1aSelections);
        detailedQuestions.forEach((question, index) => {
            const page = new Page(`page_detailed_${format.replace(/\s+/g, '_')}_${index + 1}`, data => true);
            if (question.grid) {
                page.addElement(new Grid(question.id, question.text, question.rows, question.columns));
            } else if (question.type === 'number') {
                page.addElement(new Numeric(question.id, question.text, question.detailText));
            } else {
                page.addElement(new MultipleSelect(question.id, question.text, question.options));
            }
            survey.pages.push(page);
        });
    });
};



// Override submitData to end the survey if "None of the above" is selected
const originalSubmitData = survey.submitData.bind(survey);
survey.submitData = (data) => {
    const checkNoneOfTheAbove = (data) => {
        for (const key in data) {
            if (data[key].includes('None of the above')) {
                return true;
            }
        }
        return false;
    };

    if (checkNoneOfTheAbove(data)) {
        finishSurvey();
        this.currentPageIndex = survey.pages.length - 1; // Call finishSurvey function to end the survey
        return;
    }

    if (data.hasOwnProperty('s4b')) {
        insertDynamicS4CPages(data, survey); // Insert dynamic pages based on s4b responses
    }

    if (Object.keys(data).some(key => key.startsWith('s4c_'))) {
        insertDetailedQuestions(data, survey); // Insert detailed questions based on s4c responses
    }

    return originalSubmitData(data);
};


// Export the configured survey
export default survey;
