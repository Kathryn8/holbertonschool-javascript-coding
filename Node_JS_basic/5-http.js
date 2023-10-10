const http = require('http');
const url = require('url');
const { readFile } = require('fs').promises;

function sendResponse(response, data, statusCode, contentType) {
  const actualStatusCode = statusCode || 200;
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10,
    'Content-Type': contentType || 'text/plain', // Set content type based on input
  };

  response.writeHead(actualStatusCode, headers);

  // If the content type is JSON, stringify the data; otherwise, use it as is
  const responseData = contentType === 'application/json' ? JSON.stringify(data) : data;

  response.end(responseData);
}

const actions = {
  GET: (request, response) => {
    sendResponse(response, 'Hello Holberton School!');
  },
};

// Call countStudents with a callback to handle the result or error
async function countStudents(filePath, callback) {
  try {
    const data = await readFile(filePath, 'utf8');
    const lines = data.split('\n');

    const studentCounts = {};
    let totalStudents = 0;

    // Assuming the first line contains headers, split it into field names
    // const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i += 1) {
      const fields = lines[i].split(',');

      if (fields.length >= 4) {
        const field = fields[3].trim();
        const studentName = fields[0].trim();

        if (!studentCounts[field]) {
          studentCounts[field] = [];
        }

        studentCounts[field].push(studentName);
        totalStudents += 1;
      }
    }

    const result = {
      totalStudents,
      studentCounts,
    };

    callback(null, result);
  } catch (err) {
    console.error('Error reading student data:', err);
    callback(err);
  }
}

function handleRequest(request, response) {
  const action = actions[request.method];
  if (action) action(request, response);
  else sendResponse(response, 'Not Found', 404);
}

function handleStudentRequest(request, response) {
  // Assuming that the command-line argument for the file path is provided
  const filePath = process.argv[2];

  countStudents(filePath, (error, result) => {
    if (error) {
      sendResponse(response, 'Error reading student data', 500); // Internal Server Error
    } else {
      // Create the plain text response
      const plainTextResponse = `This is the list of our students
Number of students: ${result.totalStudents}
Number of students in CS: ${result.studentCounts.CS.length}. List: ${result.studentCounts.CS.join(', ')}
Number of students in SWE: ${result.studentCounts.SWE.length}. List: ${result.studentCounts.SWE.join(', ')}`;

      // Create the JSON response
      const jsonResponse = {
        message: 'This is the list of our students',
        students: result.studentCounts,
      };

      // Send the plain text and JSON responses
      sendResponse(response, plainTextResponse);
      sendResponse(response, jsonResponse, 200, 'application/json');
    }
  });
}

const routes = {
  '/': handleRequest,
  '/students': handleStudentRequest,
};

const app = http.createServer((request, response) => {
  const urlParts = url.parse(request.url);
  const route = routes[urlParts.pathname];
  if (route) route(request, response);
  else sendResponse(response, 'Not Found', 404);
});

app.listen(1245, '127.0.0.1');

module.exports = app;
