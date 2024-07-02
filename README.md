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

```bash
npm install roundtable
```

TODO

## 📚 Documentation

Visit our [full documentation](https://docs.roundtable.ai) for TODO

## 🛠️ Examples


Create a dynamic survey with branching logic:

```javascript
import Survey from './core/survey.js';
import Page from './core/page.js';
import MultipleChoice from './question_types/multipleChoice.js';
import Grid from './question_types/grid.js';

// Create a new survey
const beverageSurvey = new Survey('beverage_usage', 'Beverage Usage Survey');

// Add initial questions
const page1 = new Page('page1', () => true);
page1.addElement(new MultipleChoice('q1a', 'On what occasions do you regularly use beverages?', [
    'In the morning', 'With meals', 'As a snack', 'With desserts', 'As a refreshing drink', 'As a health supplement'
]));
beverageSurvey.addPage(page1);

const page2 = new Page('page2', data => data.q1a && data.q1a.length > 0);
page2.addElement(new Grid('q1b', 'How often do you use beverages for the following purposes?', 
    data => data.q1a || [],
    ['Everyday', 'Four or five times a week', 'Two or three times a week', 'Once a week', 'Three times a month', 'Twice a month', 'Once a month', 'Less Often']
));
beverageSurvey.addPage(page2);

// Add dynamic follow-up questions
beverageSurvey.submitData = (data) => {
    if (data.q1a && data.q1a.includes('In the morning')) {
        const morningFollowUp = new Page('morning_followup', () => true);
        morningFollowUp.addElement(new MultipleChoice('q2a_multi', 'How do you use beverages in the morning?', 
            ['With breakfast', 'As a morning pick-me-up', 'As a part of a morning workout', 'Other']
        ));
        beverageSurvey.addPage(morningFollowUp);
    }

    return Survey.prototype.submitData.call(beverageSurvey, data);
};

export default beverageSurvey;
```

## 🛠️ Development / Open-Source Community
<p align="center">
   <a href="https://codecov.io/gh/roundtableAI/roundtable-js"><img src="https://codecov.io/gh/roundtableAI/roundtable-js/branch/main/graph/badge.svg" alt="Coverage"></a>
   <a href="https://github.com/roundtableAI/roundtable-js/issues"><img src="https://img.shields.io/github/issues/roundtableAI/roundtable-js" alt="Issues"></a>
   <a href="https://github.com/roundtableAI/roundtable-js/pulls"><img src="https://img.shields.io/github/issues-pr/roundtableAI/roundtable-js" alt="Pull Requests"></a>
</p>

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) TODO

## 📜 License

SurveyForge is open source software [licensed](LICENSE).

## 🎉 Community

Join our community:
- [Slack](TODO)
- [Twitter](https://twitter.com/roundtableDOTai)
- [Blog](https://roundtable.ai/blog)

## 📖 Story



Happy surveying! 📊✨
