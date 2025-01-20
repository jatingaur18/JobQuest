import sys
from PyPDF2 import PdfReader
import google.generativeai as genai
import yaml
# !@#$*

from dotenv import load_dotenv
import os
 
load_dotenv()
database_url = os.getenv("key")


google_API = database_url  

genai.configure(api_key = google_API)

model = genai.GenerativeModel('gemini-pro')

job_desc = sys.argv[1]
desc_query = "give 5 extremely difficult technical mcq questions for the person we are looking to hire based on the following job description" + job_desc
question = "Give me 5 extremely difficult python mcq questions"
context = "(with question number) separate each question with !@#ques (print this separator just before question number) \
and separate questions from options from question with !@#opt (print the options like a), b) ) and print correct answer \
after the options with !@#ans"

response = model.generate_content(desc_query+context)


text = response.text
print(text)

