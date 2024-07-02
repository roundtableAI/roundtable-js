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




## 🚀 Quick Start (TODO)

```bash
npm install roundtable-js
```

## 🛠️ Examples (TODO)


Create a dynamic survey with branching logic:

```html
<!DOCTYPE html>
<html>
<head>
  <title>RoundtableJS Example</title>
  <script src="https://unpkg.com/roundtable-js@0.1.1/dist/roundtable.min.js"></script>
</head>
<body>
  <h1>RoundtableJS Demo</h1>
  <div id="survey-container"></div>

  <script>
    // Use the RoundtableJS library
    // Create a new survey
    const survey = new RoundtableJS.Survey('my-survey', 'My Survey');

    // Add a new page
    const page = new RoundtableJS.Page('page1', 'Page 1');
    page.addElement(new RoundtableJS.MultipleChoice('q1', 'What is your favorite animal?', ['Cat', 'Dog', 'Hamster']));
    survey.addPage(page);

    // Render the survey
    survey.render();
  </script>
</body>
</html>
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
