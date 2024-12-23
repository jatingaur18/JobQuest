import sys
from PyPDF2 import PdfReader
import google.generativeai as genai
import yaml
# !@#$*

with open(r'test_generator/API.yml','r') as file:
    API = yaml.safe_load(file)


google_API = API['key'] 

genai.configure(api_key = google_API)

model = genai.GenerativeModel('gemini-pro')

#query based on job desc
resume_text = PdfReader(sys.argv[1]).pages[0].extract_text()
job_desc = (sys.argv[2])

f = open("jobquery.txt", "w")
text = f.write(job_desc)
# desc_query = text
# Prompt for scoring the resume against the job description
desc_query = (
    f"Evaluate the following resume based on the job description and provide a compatibility score "
    f"between 0 and 100 as an integer.\n\n"
    f"Only give scores above 70 if the resume is an exceptionally good match and below 30 if it is clearly unqualified.\n\n"
    f"Job Description:\n{job_desc}\n\n"
    f"Resume:\n{resume_text}\n\n"
    f"Scoring Scale:\n"
    f"- 90-100: Strong match with all skills, experience, and education requirements.\n"
    f"- 70-89: Good match with most skills and experience but minor gaps.\n"
    f"- 50-69: Moderate match with some relevant skills or experience but noticeable gaps.\n"
    f"- 30-49: Weak match with few relevant skills or experience.\n"
    f"- 0-29: Very poor match, lacks required skills and experience.\n\n"
    f"Score: (Please provide the average score as a single integer without any additional text)"
    f"please provide only the score and do not provide any other description"
)
response = model.generate_content(desc_query)
# print(response.text)

text = response.text
print(text)
