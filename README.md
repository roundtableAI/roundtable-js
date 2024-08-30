<p align="center">
<a href="https://surveys.roundtable.ai">
  <img src="assets/images/png-logo-black-rounding.png" alt="Roundtable Logo" width = '100'>
</a>

<h3 align="center">RoundtableJS</h3>
<!-- Why is there a line here? -->
<p align="center"> Programmatic survey software
<br />
  <a href="https://surveys.roundtable.ai">Cloud editor</a> •
  <a href="https://join.slack.com/t/roundtablejs/shared_invite/zt-2m09n74yv-B~UeGbxSzGMTO3f0qXhRxQ">Slack</a> •
  <a href="https://docs.roundtable.ai/rjs/introduction">Documentation</a>
</p>
</p>

<p align="center">
  <!-- GitHub Stars -->
  <a href="https://github.com/roundtableAI/roundtable-js/stargazers"><img src="https://img.shields.io/github/stars/roundtableAI/roundtable-js" alt="GitHub Stars"></a>
  <!-- NPM Downloads -->
  <a href="https://www.npmjs.com/package/roundtable-js"><img src="https://img.shields.io/npm/dm/roundtable-js" alt="NPM Downloads"></a>
  <!-- Hacker News -->
  <a href="https://news.ycombinator.com/item?id=36865625"><img src="https://img.shields.io/badge/Hacker%20News-121-%23FF6600" alt="Hacker News"></a>
  <!-- Cloud Editor -->
<a href="https://surveys.roundtable.ai"><img src="https://img.shields.io/badge/Cloud%20Editor-surveys.roundtable.ai-teal" alt="Cloud Editor"></a>
</p>

<p align="center">
  <!-- Twitter Follow -->
  <a href="https://twitter.com/roundtabledotai"><img src="https://img.shields.io/twitter/follow/roundtabledotai?style=social" alt="Twitter Follow"></a>
  <!-- Join Slack -->
  <a href="https://join.slack.com/t/roundtablejs/shared_invite/zt-2m09n74yv-B~UeGbxSzGMTO3f0qXhRxQ"><img src="https://img.shields.io/badge/Join%20Slack-4A154B?logo=slack" alt="Join Slack"></a>
  <!-- LinkedIn Follow -->
  <a href="https://www.linkedin.com/company/roundtable-ai"><img src="https://img.shields.io/badge/LinkedIn-Follow-0077B5?logo=linkedin" alt="LinkedIn Follow"></a>
</p>

RoundtableJS is an open-source JavaScript library for building complex surveys, forms, and data annotation tasks. It's designed to be simple but completely customizable. We make it easy to add complex logic (e.g. branching, skipping, looping), modify question types, and fully customize the design.

## 🌟 Features

- **Designed for the Modern Web:** We're designed in JavaScript and leverage its asynchronous functionality for managing survey logic. For example, rather than determining this logic based on callbacks that trigger when a page is submitted, our library builds the timeline in an async function which means the logic flows intuitively from top to bottom. 

- **Developer-Friendly:** We are open-source and API-first. The idea for RoundtableJS arose by seeing how difficult it was to integrate Roundtable's API into other survey software. We want the open-source offering to include a robust plugin ecosystem where people can introduce new question types, integrate with tools like CRMs, and control how data is stored and processed. 

- **AI-Native Functionality:** Our [cloud offering](https://surveys.roundtable.ai) has AI-native features such as natural language programming and automated fraud detection. We're continuously expanding our AI features. Let us know what tools you'd like to see!

## 🖼️ Examples

Here are some example surveys built with RoundtableJS. All code is in the [examples/studies](examples/studies) directory.

- [Element showcase](https://roundtable.ai/survey/3e76ab92512f398e366baffd772b06cf972c0c0e)
- [Enterprise market research survey](https://roundtable.ai/survey/3020c264e57a0415889a7d82330af66daf30db15)
- [Simple NPS with branding](https://roundtable.ai/survey/bed16082755fc02b70f582c1fe143b8e7d292a43)
- [Typeform survey](https://roundtable.ai/survey/134a2317bb595d7768194de65772f97dc760b60b)
- [Product market fit survey](https://roundtable.ai/survey/765c87578ccf7e24522e91c44cf41f845c4bcd0e)
- [Book a demo form](https://roundtable.ai/survey/374fd1f3f1719d69b21438cbacd7013d28b7daeb)
- [Data annotation task](https://roundtable.ai/survey/1518e8ae74e9075349b07ffeee8ee21166477e4d)
- [RLHF data collection](https://roundtable.ai/survey/89eeb07064400b58f2d3a3d979b0cff729f1ee2b)


## 🚀 Quick Start

## Installation

### Option 1: npm

1. Install roundtable-js using npm:
   ```bash
   npm install roundtable-js
   ```

### Option 2: Git

1. Clone the repository:
   ```
   git clone https://github.com/roundtableAI/roundtable-js.git
   ```

2. Navigate to the project directory:
   ```
   cd roundtable-js
   ```

3. Include the necessary files in your project.

### Option 3: CDN

1. Include the following script tag in your HTML:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/roundtable-js@0.1.2/dist/bundle.js"></script>
   ```

## Usage

1. Import the necessary modules in your JavaScript file for npm or Git installations:


   ```javascript
   import Survey from 'roundtable-js/core/survey.js';
   import SingleSelect from 'roundtable-js/elements/singleSelect.js';
   ```

   For CDN installation, ensure the script is loaded and use the global `RoundtableJS` object:

   ```javascript
   const { Survey, SingleSelect } = RoundtableJS;
   ```


2. Create a survey instance and add pages with questions:

   ```javascript
   // Define an asynchronous function to run the survey
   async function runSurvey() {
      // Create a new Survey instance with a specific participant ID
      const survey = new Survey({ participantId: 'participant_123' });

      // Define the first question as a single-select question with two options
      const question1 = new SingleSelect({
         id: 'question1',
         text: 'A question',
         options: ['Option 1', 'Option 2'],
      });

      // Define the second question as a single-select question with two options
      const question2 = new SingleSelect({
         id: 'question2',
         text: 'A second question',
         options: ['Option 1', 'Option 2'],
      });

      // Show the first page with the first question and wait for it to be answered
      await survey.showPage({ id: 'page1', elements: [question1] });

      // This code runs only after the first page is completed
      console.log('Page 1 completed');

      // Show the next page with the second question and wait for it to be answered
      await survey.showPage({ id: 'page2', elements: [question2] });

      // Finish the survey once all pages are completed and display an end message
      survey.finishSurvey('Thank you for completing the survey!');
   }

   // Start the survey by calling the runSurvey function
   runSurvey();   
   ```

3. Set up your HTML:

   ```html
   <!DOCTYPE html>
   <html lang="en">

   <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Survey</title>
   <style>
      * {
         box-sizing: border-box;
      }

      .hidden {
         display: none;
      }
   </style>
   </head>

   <body>
   <div id="survey-container" class="hidden">
      <div id="page-container"></div>
      <div id="navigation">
         <button id="next-button">Next</button>
      </div>
      <div id = 'finish'></div>
   </div>
   <script type="module" src="survey_script.js"></script>
   </body>

   </html>
   ```

## 📚 Documentation

Read our [full documentation](https://docs.roundtable.ai/rjs/introduction).

## 🎉 Community

Join our community:
- [Slack](https://join.slack.com/t/roundtablejs/shared_invite/zt-2m09n74yv-B~UeGbxSzGMTO3f0qXhRxQ)
- [Twitter](https://twitter.com/roundtabledotai)
- [Blog](https://roundtable.ai/blog)
- [LinkedIn](https://www.linkedin.com/company/roundtable-ai)

## 🛠️ Development / Open-Source Community

Please see our [Contributing Guide](CONTRIBUTING.md).

## 📜 License

RoundtableJS is open source software [licensed](LICENSE).

---
