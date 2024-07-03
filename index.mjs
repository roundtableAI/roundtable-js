import { displayPage, collectData, submitData } from './controller.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Get the necessary DOM elements
const questionContainerElement = document.getElementById('question-container');

// Start the survey
displayPage(questionContainerElement);

// Event listener for submit button
document.getElementById('submit-btn').addEventListener('click', () => {
  submitData(questionContainerElement);
});

// Start the HTTP server
http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});