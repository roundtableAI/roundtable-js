import Survey from '../core/survey.js';
import SingleSelect from '../question_types/singleSelect.js';

// Add images and questions for each page
const imageUrls = [ 'assets/images/dog.jpg','assets/images/cat.jpg' ];

async function addLabelingPage(survey,imageUrl,index){
    const q1 = new SingleSelect({
        id: 'q1',
        text: `Is this a dog or a cat?<br/><img src="${imageUrl}" style="width:300px;">`,
        subText: 'Please select the correct answer',
        options: ['Dog', 'Cat'],
    });
    const id = `q${index}`;
    await survey.showPage({ id, elements: [q1] });
}

async function runSurvey() {
    const survey = new Survey({
        participantId: 'participant_123',
        condition: 'test',
        styles: {
            body: {
                background: 'pink',
            },
            button: {
                color: 'blue',
                background: 'yellow',
            },
        }
    });

    for (let i = 0; i < imageUrls.length; i++) {
        await addLabelingPage(survey,imageUrls[i],i+1);
    }

    survey.finishSurvey({ message: 'Thank you for completing the task!' });
}

runSurvey();