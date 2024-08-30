import Survey from '../../library/core/survey.js';
import BoundingBox from '../../library/elements/boundingBox.js';
import ProgressBar from '../../library/plugins/progressBar.js';

// Add images and questions for each page
const imageUrls = ['https://www.usnews.com/object/image/00000168-b98c-d246-a9f9-fddd8bb50000/190204-seattletunnel-editorial.jpg?update-time=1549301335348&size=responsive640',
    'https://www.giviexplorer.com/imagesC/11886/576x576xGIVI-Explorer_friends4adventure_Ecuador-cover.jpg'];

async function addBoundingBoxPage(survey, imageUrl, index) {
    const boundingBoxQ = new BoundingBox({
        id: `bb-q${index}`,
        text: `Draw a bounding box around the vehicles in the image below`,
        subText: `If there are no vehicles, skip to the next page`,
        imageUrl: imageUrl,
    });
    const id = `q${index}-bb`;
    await survey.showPage({ id, elements: [ boundingBoxQ ] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'test-participant',
        condition: 'car-labeling',
    });

    const progressBar = new ProgressBar({
        maxPages: imageUrls.length,
        styles: {
            bar: {
                backgroundColor: 'black'
            }
        }
    });
    survey.addPlugin(progressBar);

    // Bounding box pages
    for (let i = 0; i < imageUrls.length; i++) {
        await addBoundingBoxPage(survey, imageUrls[i], i);
    }

    survey.finishSurvey('Thank you for completing the task!');
}

runSurvey();