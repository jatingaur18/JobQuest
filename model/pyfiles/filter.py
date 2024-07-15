from PyPDF2 import PdfReader
import docx2txt
import nltk
import warnings
import os 
import sys
warnings.filterwarnings('ignore')
nltk.download('punkt',quiet = True)
nltk.download('stopwords',quiet = True)
nltk.download('wordnet',quiet = True)
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
from gensim.models import KeyedVectors
resume_path = sys.argv[1]
job_path = sys.argv[2]
resume = PdfReader(resume_path).pages[0].extract_text()
job =  PdfReader(job_path).pages[0].extract_text()

# resume_read = PdfReadresume  = docx2txt.process(resume_path)
# job = docx2txt.process(job_path)
def preprocess_text(text):
  tokens = word_tokenize(text.lower())
  stop_words = set(stopwords.words('english'))
  filtered_tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
  lemmatizer = WordNetLemmatizer()
  lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
  return lemmatized_tokens
def average_word_vectors(tokens, model):
    vectors = []
    for token in tokens:
        if token in model.wv:
            vectors.append(model.wv[token])
    if vectors:
        return sum(vectors) / len(vectors)
    else:
        return None
resume_token = preprocess_text(resume)
job_token = preprocess_text(job)
google_model_path = "../GoogleNews-vectors-negative300.bin"
google_model = KeyedVectors.load_word2vec_format(google_model_path, binary=True)
def get_vector_for_token(token, model):
    try:
        return model[token]
    except KeyError:
        # print(f"Token '{token}' not present in the model's vocabulary.")
        return None
# processing vector average
resume_vectors = [get_vector_for_token(token, google_model) for token in resume_token]
job_description_vectors = [get_vector_for_token(token, google_model) for token in job_token]

# Remove None values from the lists
resume_vectors = [vec for vec in resume_vectors if vec is not None]
job_description_vectors = [vec for vec in job_description_vectors if vec is not None]

# Calculate the average vectors
if resume_vectors and job_description_vectors:
    resume_vector = sum(resume_vectors) / len(resume_vectors)
    job_description_vector = sum(job_description_vectors) / len(job_description_vectors)
    
    similarity_score = cosine_similarity([resume_vector], [job_description_vector])[0, 0]
    similarity_percentage = (similarity_score) * 100
    similarity_percentage = round(similarity_percentage,2)
    print(similarity_percentage)
    # print("Similarity Percentage:", similarity_percentage)
else:
    print("No vectors found for tokens.")

