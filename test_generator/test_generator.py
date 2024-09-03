import sys
from PyPDF2 import PdfReader
import yaml
import google.generativeai as genai
# !@#$*

with open(r'','r') as file:
    API = yaml.safe_load(file)

key = API['key']


google_API = key
genai.configure(api_key = google_API)

model = genai.GenerativeModel('gemini-pro')

#query based on job desc
# f = open("jobquery.txt", "r")
# text = f.read()
# desc_query = text
job_desc = PdfReader(sys.argv[1]).pages[0].extract_text() 
desc_query = "give 5 extremely difficult technical mcq questions for the person we are looking to hire based on the following job description" + job_desc 
# desc_query = "Give me 10 extremely difficult mcq questions on python, flask, mongodb"
question = "Give me 5 extremely difficult python mcq questions"
context = "(with question number) separate each question with !@#ques (print this separator just before question number) \
and separate questions from options from question with !@#opt (print the options like a), b) ) and print correct answer \
after the options with !@#ans"

response = model.generate_content(desc_query+context)
# print(response.text)

text = response.text
print(text)

