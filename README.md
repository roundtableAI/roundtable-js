<p align="center"><img src="assets/images/logo-with-text.png" alt="Roundtable Logo"></p>

<h1 align="center">Programmatic Survey Software</h1>
<br/>

We believe that well-crafted surveys lead to better data, and better data leads to more informed decisions. 
<br/>

<p align="center">
  <a href="https://github.com/roundtableAI/roundtable-js/stargazers"><img src="https://img.shields.io/github/stars/roundtableAI/roundtable-js" alt="Github Stars"></a>
  <a href="https://news.ycombinator.com/item?id=36865625"><img src="https://img.shields.io/badge/Hacker%20News-121-%23FF6600" alt="Hacker News"></a>
  <a href="https://github.com/roundtableAI/roundtable-js/LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-purple" alt="License"></a>
  <a href="https://twitter.com/roundtableDOTai"><img src="https://img.shields.io/twitter/follow/roundtableDOTai?style=flat"></a>
  <a href="https://www.ycombinator.com"><img src="https://img.shields.io/badge/Backed%20by-Y%20Combinator-%23f26625"></a>
</p>

We get excited about open-source enterprise-grade programmatic survey software. Do you?

**Surveys are a _craft_**. They are the gateways to new information. *How* you ask determines *what* you receive.

Whether you're conducting market research, gathering academic data, or measuring customer satisfaction, Roundtable gives you the tools to ask the right questions, in the right way, to get the answers you need.

## 🌟 Features

- **Code-First**: Design surveys using JavaScript
- **Plugins**: Easily add new question types and analysis tools
- **Branching Logic**: Create complex, adaptive surveys
- **Data Visualization**: Built-in tools to create beautiful, interactive charts
- **Customization**: Extensive theming options with CSS and template overrides

## 🚀 Quick Start

## Installation

### Option 1: npm

1. Install Roundtable.js using npm:
   ```
   npm install roundtable-js@beta
   ```
2. Or if you prefer using yarn:
   ```
   yarn add roundtable-js
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

## Usage

1. Import the necessary modules in your JavaScript file:

   ```javascript
   import Survey from './core/survey.mjs';
   import Page from './core/page.mjs';
   import MultipleSelect from './question_types/multipleSelect.mjs';
   ```

2. Create a survey instance and add pages with questions:

   ```javascript
   const survey = new Survey('my-survey', 'My Survey');

   const page = new Page('page1');
   page.addElement(new MultipleSelect('q1', 'What is your favorite animal?', ['Cat', 'Dog', 'Hamster']));
   survey.addPage(page);
   ```

3. Set up your HTML:

   ```html
   <div id="survey-container">
     <div id="progress"></div>
     <form id="survey-form">
       <div id="question-container"></div>
       <button type="submit" id="submit-button">Next</button>
     </form>
   </div>
   ```

4. Render the survey and handle navigation:

   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
     renderSurvey();

     document.getElementById('survey-form').addEventListener('submit', (event) => {
       event.preventDefault();
       const formData = new FormData(event.target);
       const data = Object.fromEntries(formData.entries());
       survey.submitData(data);
       if (!survey.isComplete()) {
         renderSurvey();
       } else {
         survey.endSurvey();
       }
     });
   });

   function renderSurvey() {
     survey.render();
     updateNavButtons();
   }

   function updateNavButtons() {
     const submitButton = document.getElementById('submit-button');
     submitButton.textContent = survey.isComplete() ? 'Finish' : 'Next';
   }
   ```

## 📚 Documentation

Read our [full documentation](https://docs.roundtable.ai).

## 🛠️ Development / Open-Source Community
<p align="center">
  <a href="https://codecov.io/gh/roundtableAI/roundtable-js"><img src="https://codecov.io/gh/roundtableAI/roundtable-js/branch/main/graph/badge.svg" alt="Coverage"></a>
  <a href="https://github.com/roundtableAI/roundtable-js/issues"><img src="https://img.shields.io/github/issues/roundtableAI/roundtable-js" alt="Issues"></a>
  <a href="https://github.com/roundtableAI/roundtable-js/pulls"><img src="https://img.shields.io/github/issues-pr/roundtableAI/roundtable-js" alt="Pull Requests"></a>
</p>

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) TODO

## 📜 License

Roundtable is open source software [licensed](LICENSE).

## 🎉 Community

Join our community:
- [Slack](TODO)
- [Twitter](https://twitter.com/roundtableDOTai)
- [Blog](https://roundtable.ai/blog)

## 📖 Story

Happy surveying! 📊✨
