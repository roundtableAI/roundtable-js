<p align="center"><img src="assets/images/logo-with-text.png" alt="Roundtable Logo"></p>

<h1 align="center">Programmatic Survey Software</h1>
<br/>

We believe that well-crafted surveys lead to better data, and better data leads to more informed decisions. 
<br/>

<p align="center">
  <!-- GitHub Stars -->
  <a href="https://github.com/roundtableAI/roundtable-js/stargazers"><img src="https://img.shields.io/github/stars/roundtableAI/roundtable-js" alt="GitHub Stars"></a>
  <!-- NPM Downloads -->
  <a href="https://www.npmjs.com/package/roundtable-js"><img src="https://img.shields.io/npm/dm/roundtable-js" alt="NPM Downloads"></a>
  <!-- Twitter Follow -->
  <a href="https://twitter.com/roundtableDOTai"><img src="https://img.shields.io/twitter/follow/roundtableDOTai?style=social" alt="Twitter Follow"></a>
  <!-- Hacker News -->
  <a href="https://news.ycombinator.com/item?id=36865625"><img src="https://img.shields.io/badge/Hacker%20News-121-%23FF6600" alt="Hacker News"></a>
  <!-- Y Combinator -->
  <a href="https://www.ycombinator.com"><img src="https://img.shields.io/badge/Backed%20by-Y%20Combinator-%23f26625" alt="Y Combinator"></a>
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
  <!-- Build Status -->
  <a href="https://github.com/roundtableAI/roundtable-js/actions"><img src="https://img.shields.io/github/actions/workflow/status/roundtableAI/roundtable-js/main.yml" alt="Build Status"></a>
  <!-- Code Coverage -->
  <a href="https://codecov.io/gh/roundtableAI/roundtable-js"><img src="https://codecov.io/gh/roundtableAI/roundtable-js/branch/main/graph/badge.svg" alt="Code Coverage"></a>
  <!-- Maintainability -->
  <a href="https://codeclimate.com/github/roundtableAI/roundtable-js/maintainability"><img src="https://api.codeclimate.com/v1/badges/your_badge_id/maintainability" alt="Maintainability"></a>
  <!-- Dependencies -->
  <a href="https://david-dm.org/roundtableAI/roundtable-js"><img src="https://img.shields.io/david/roundtableAI/roundtable-js" alt="Dependencies"></a>
  <!-- Open Source Love -->
  <a href="https://github.com/roundtableAI/roundtable-js"><img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" alt="Open Source Love"></a>
</p>

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) TODO

## 📜 License

Roundtable is open source software [licensed](LICENSE).

## 🎉 Community

Join our community:
- [Slack](https://join.slack.com/t/roundtablejs/shared_invite/zt-2m09n74yv-B~UeGbxSzGMTO3f0qXhRxQ)
- [Twitter](https://twitter.com/roundtableDOTai)
- [Blog](https://roundtable.ai/blog)
- [LinkedIn](https://www.linkedin.com/company/roundtableAI)

---

Thank you for choosing Roundtable for your survey needs. Engage with our community, contribute to the project, and let's build something great together. 📊✨
