const fs = require('fs');

// Read the content from the file
const text = fs.readFileSync('Hack-O-Harbour\\test_generator\\Sample\\Sample ques4.txt', 'utf8');

// Split the text based on the delimiter "!@#ques"
const parts = text.split('!@#ques');

// Array to store the parsed questions
const Q_list = [];

// Iterate through each part
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

// Output the parsed questions
console.log(Q_list);
// Q_List structure [[qno,'ques',{option},{ans}]]
