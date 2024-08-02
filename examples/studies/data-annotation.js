import Survey from '../../library/core/survey.js';
import SingleSelect from '../../library/elements/singleSelect.js';
import BoundingBox from '../../library/elements/boundingBox.js';
import ProgressBar from '../../library/plugins/progressBar.js';

// Add images and questions for each page
const imageUrls = ['https://i.redd.it/three-cats-v0-xraium6wenpb1.jpg?width=720&format=pjpg&auto=webp&s=78e59ff2a4c87196176b11a4eaf83aafe5f1e917',
    'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12153852/American-Eskimo-Dog-standing-in-the-grass-in-bright-sunlight-400x267.jpg'];

async function addLabelingPage(survey, imageUrl, index) {
    const imageContainsCat = new SingleSelect({
        id: `labeling-q${index}`,
        text: `Does this contain a cat?<br/><img src="${imageUrl}" style="width:100%;">`,
        subText: 'Please select the correct answer',
        options: ['Yes', 'No'],
    });
    const id = `q${index}`;
    await survey.showPage({ id, elements: [ imageContainsCat ] });
}

async function addBoundingBoxPage(survey, imageUrl, index) {
    const catBoundingBox = new BoundingBox({
        id: `bb-q${index}`,
        text: `Draw a bounding box around the cat in the image below`,
        imageUrl: imageUrl,
    });
    const id = `q${index}-bb`;
    await survey.showPage({ id, elements: [ catBoundingBox ] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        condition: 'test',
    });
    // Initial labeling pages
    for (let i = 0; i < imageUrls.length; i++) {
        await addLabelingPage(survey, imageUrls[i], i);
    }

    const catImages = imageUrls.filter((url, index) => survey.getResponse(`labeling-q${index}`) === 'Yes');

    if (catImages.length > 0) {
        // Add the progress bar plugin with custom styles and total pages
        const progressBar = new ProgressBar({ maxPages: catImages.length, progressAsPercentage: true });
        survey.addPlugin(progressBar);
    
        // Bounding box pages
        for (let i = 0; i < catImages.length; i++) {
            await addBoundingBoxPage(survey, imageUrls[i], i);
        }
    
        survey.finishSurvey('Thank you for completing the task!');
    };
}

runSurvey();