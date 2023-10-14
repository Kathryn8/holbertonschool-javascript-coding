const readDatabase = require('../utils');

class StudentsController {
  static async getAllStudents(request, response) {
    const path = process.argv[2];
    const title = 'This is the list of our students\n';
    try {
      const result = await readDatabase(path);
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end(`${title}Number of students in CS: ${result.CS.length}. List: ${result.CS.join(', ')}\nNumber of students in SWE: ${result.SWE.length}. List: ${result.SWE.join(', ')}`);
    } catch (error) {
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end(error.message);
    }
  }

  static async getAllStudentsByMajor(request, response) {
    const path = process.argv[2];
    const { major } = request.params;

    if (major !== 'CS' && major !== 'SWE') {
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end('Major parameter must be CS or SWE');
    }

    try {
      const result = await readDatabase(path);
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end(
        major === 'CS' ? `List: ${result.CS.join(', ')}` : `List: ${result.SWE.join(', ')}`,
      );
    } catch (error) {
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end(error.message);
    }
  }
}

module.exports = StudentsController;
