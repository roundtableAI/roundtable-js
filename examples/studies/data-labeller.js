import Survey from '../../library/core/survey.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import BoundingBox from '../../library/elements/boundingBox.js';
import ProgressBar from '../../library/plugins/progressBar.js';

// Add images and questions for each page
const imageUrls = ['assets/images/dog.jpg', 'assets/images/cat.jpg'];

async function addLabelingPage(survey, imageUrl, index) {
    const q1 = new SingleSelect({
        id: `labeling-q${index}`,
        text: `Does this contain a cat?<br/><img src="${imageUrl}" style="width:100%;">`,
        subText: 'Please select the correct answer',
        options: ['Yes', 'No'],
    });
    const id = `q${index}`;
    await survey.showPage({ id, elements: [q1] });
}

async function addBoundingBoxPage(survey, imageUrl, index) {
    const q1 = new BoundingBox({
        id: `bb-q${index}`,
        text: `Draw a bounding box around the cat in the image below`,
        imageUrl: imageUrl,
    });
    const id = `q${index}-bb`;
    await survey.showPage({ id, elements: [q1] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        condition: 'test',
    });

    // Add the progress bar plugin with custom styles and total pages
    const progressBar = new ProgressBar({ maxPages: imageUrls.length*2, progressAsPercentage: true });
    survey.addPlugin(progressBar);

    // Initial labeling pages
    for (let i = 0; i < imageUrls.length; i++) {
        await addLabelingPage(survey, imageUrls[i], i);
    }

    // Bounding box pages
    for (let i = 0; i < imageUrls.length; i++) {
        if (survey.getResponse(`labeling-q${i}`) === 'Yes') {
            await addBoundingBoxPage(survey, imageUrls[i], i);
        }
    }

    survey.finishSurvey('Thank you for completing the task!');
}

runSurvey();