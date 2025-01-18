import sys
import re
from PyPDF2 import PdfReader
import google.generativeai as genai
import yaml

# Load API key
with open(r'./test_generator/API.yml', 'r') as file:
    API = yaml.safe_load(file)

google_API = API['key']
genai.configure(api_key=google_API)

# Initialize generative model
model = genai.GenerativeModel('gemini-pro')

# Extract resume text
resume = PdfReader(sys.argv[1]).pages[0].extract_text()

# Define the query and context
desc_query = (
    "Analyze the provided resume and evaluate its quality. Provide a score, section-wise analysis, "
    "and missing sections as per the specified format.\n" + resume
)
context = """**Output Format**:  
Return the analysis as a string with the following structure. Use clear identifiers for each section so that it can be converted into JSON later:

1. Resume Score: [Overall score out of 100]
2. Sections:
   - Contact Information:
       - Rating: [Score out of 10]
       - Strengths: [Comma-separated strengths]
       - Weaknesses: [Comma-separated weaknesses]
       - Improvements: [Comma-separated improvements]
   - Skills:
       - Rating: [Score out of 10]
       - Strengths: [Comma-separated strengths]
       - Weaknesses: [Comma-separated weaknesses]
       - Improvements: [Comma-separated improvements]
   - [Other sections...]

3. Missing Sections: [Comma-separated missing sections]

Return only the output as described. Do not include anything else.
"""

# Generate the response
response = model.generate_content(desc_query + context)

# Post-process the response
text = response.text
# Parse string into JSON
def parse_response_to_json(response_text):
    json_output = {}
    try:
        # Extract resume score
        score_match = re.search(r"Resume Score:\s*(\d+)", response_text)
        json_output["resume_score"] = int(score_match.group(1)) if score_match else None

        # Extract sections
        sections = {}
        section_matches = re.finditer(
            r"- (\w[\w\s]+):\s+[-]\s+Rating:\s*(\d+)\s+[-]\s+Strengths:\s*([^\n]*)\s+[-]\s+Weaknesses:\s*([^\n]*)\s+[-]\s+Improvements:\s*([^\n]*)",
            response_text,
        )
        for match in section_matches:
            section_name = match.group(1).strip().replace(" ", "_").lower()
            sections[section_name] = {
                "rating": int(match.group(2)),
                "strengths": [s.strip() for s in match.group(3).split(",") if s.strip()],
                "weaknesses": [w.strip() for w in match.group(4).split(",") if w.strip()],
                "improvements": [i.strip() for i in match.group(5).split(",") if i.strip()],
            }

        json_output["sections"] = sections

        # Extract missing sections
        missing_sections_match = re.search(r"Missing Sections:\s*(.*)", response_text)
        json_output["missing_sections"] = [
            ms.strip()
            for ms in missing_sections_match.group(1).split(",")
            if ms.strip()
        ] if missing_sections_match else []

    except Exception as e:
        print(f"Error parsing response: {e}")
        return {}

    return json_output


parsed_json = parse_response_to_json(text)

# Print the final JSON output
import json
print(json.dumps(parsed_json, indent=4))
