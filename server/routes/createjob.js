const express = require('express')
const { spawn } = require('child_process');
const router = express.Router()



async function gettest(text){
  const Q_list = [];
  const parts = text.split('!@#ques');

  for (const part of parts) {
      const list_element = [];
  
      // Check if the part contains options
      if (part.includes('!@#opt')) {
          try {
              // Split the part into question and options
              const [part_q, part_opt] = part.split('!@#opt');
  
              const firstSpaceIndex = part_q.indexOf('\n');
              const q_no = part_q.slice(0, firstSpaceIndex);    
              const question = part_q.slice(firstSpaceIndex + 1);
          
  
              // Split the options part into options and answer
              const [option_string, ans_string] = part_opt.split('!@#ans');
  
              let i = 0;
              let answer = ans_string[i];
              while (!['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(answer)) {
                  i++;
                  answer = ans_string[i];
              }
  
              // Split options into an array
              const option_list = option_string.split('\n');
  
              // Convert options to a dictionary
              const options_dict = {};
              for (const option of option_list) {
                  if (option.length > 1) {
                      options_dict[option[0]] = option.slice(2);
                  }
              }
  
  
              const questionObj = {
                  question_no: parseInt(q_no),
                  question: question.trim(),
                  options: options_dict,
                  correct: answer
              };
  
              // Add the object element to Q_list
              Q_list.push(questionObj);
  
              // console.log(list_element);
          } catch (error) {
              console.error('Error parsing part:', part);
          }
      }
  }
  return Q_list
}


const executePythonone = async (script, arg2) => {
  const py = spawn("python", [script, arg2]);

  const result = await new Promise((resolve, reject) => {
    let output;

      py.stdout.on('data', (data) => {
        output = data.toString();
      });

      py.stderr.on("data", (data) => {
        console.error(`[python] Error occured: ${data}`);
        reject(`Error occured in ${script}`);
      });

      py.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
        resolve(output);
      });
  });

  return result;
}


router.post('/', async (req, res) => {
  const createjob = req.body;
  const jobs = db.collection('jobs');
  
  createjob['participants'] = [];
  createjob['test'] = await gettest(await executePythonone('test_generator/test_generator.py', createjob.description));

  console.log(createjob);

  jobs.insertOne(createjob);
  res.status(200).send("done");
})

module.exports = router;
