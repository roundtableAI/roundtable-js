import Survey from '../../library/core/survey.js';
import OpenEnd from '../../library/elements/openEnd.js';
import HTML from '../../library/elements/HTML.js';
import MultiSelect from '../../library/elements/multiSelect.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import NumberScale from '../../library/elements/numberScale.js';
import ProgressBar from '../../library/plugins/progressBar.js';

function generatePromptResponseHTML(prompt, response) {
    return `
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px;">Prompt:</h3>
            <div style="background-color: #f0f0f0; padding: 14px; border-radius: 5px;">${prompt}</div>
        </div>
        <div>
            <h3 style="font-size: 16px;">Response:</h3>
            <div style="background-color: #f0f0f0; padding: 14px; border-radius: 5px;">${response}</div>
        </div>
    `;
}

function generatePage(pageNumber, prompt, response) {
    const promptResponseHTML = new HTML({
        id: `prompt-response-${pageNumber}`,
        content: generatePromptResponseHTML(prompt, response)
    });

    const relevanceQuestion = new SingleSelect({
        id: `relevance-${pageNumber}`,
        text: 'Is the response relevant for the prompt?',
        options: ['Yes', 'No', 'Partially'],
        required: true
    });

    const avoidanceQuestion = new MultiSelect({
        id: `avoidance-${pageNumber}`,
        text: 'Does the response include anything that should be avoided?',
        options: ['Racial slurs', 'Explicit content', 'Misinformation', 'Biased language'],
        required: true
    });

    const qualityQuestion = new NumberScale({
        id: `quality-${pageNumber}`,
        text: 'Rate the overall quality of the response',
        min: 1,
        max: 10,
        minLabel: 'Poor',
        maxLabel: 'Excellent',
        required: true
    });

    const feedbackQuestion = new OpenEnd({
        id: `feedback-${pageNumber}`,
        text: 'Any additional comments or feedback on the response?',
        required: false
    });

    return { 
        id: `evaluation-${pageNumber}`, 
        elements: [promptResponseHTML, relevanceQuestion, avoidanceQuestion, qualityQuestion, feedbackQuestion] 
    };
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'test-participant',
        condition: 'llm-evaluation',
        styles: {
          body: {
            background: 'white'
          },
          container: {
            boxShadow: 'none',
          },
        }
    });

    const progressBar = new ProgressBar({
        maxPages: 2,
        styles: {
            bar: {
                backgroundColor: 'black',
            }
        }
    });
    survey.addPlugin(progressBar);

    const samplePrompt1 = "What is the population of the United States?";
    const sampleResponse1 = "As of 2024, the population of the United States is estimated to be around 335 million people. This figure can fluctuate slightly due to births, deaths, and migration patterns. For the most up-to-date and precise figure, I'd recommend checking the U.S. Census Bureau website, as they provide regular population estimates and projections.";

    const samplePrompt2 = "Write a Python function that calculates the factorial of a number.";
    const sampleResponse2 = `Here is a Python function that calculates the total factorial of a number: 
  <pre style="background-color: black; color: white; font-family: monospace; border-radius: 6px; padding: 12px; white-space: pre-wrap; word-wrap: break-word;">def factorial(n):
  if n == 0 or n == 1:
    return 1
  else:
    return n * factorial(n - 1)
# Example usage
number = 5
result = factorial(number)
print(f"The factorial of {number} is {result}")</pre>`;

    await survey.showPage(generatePage(1, samplePrompt1, sampleResponse1));
    await survey.showPage(generatePage(2, samplePrompt2, sampleResponse2));

    survey.finishSurvey('Thank you for completing the evaluation!');
}

runSurvey();