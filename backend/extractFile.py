from pathlib import Path
import hashlib
import google.generativeai as genai
import sys
import json

pdf_path = sys.argv[1]
modalidade = sys.argv[2]
quantidade = sys.argv[3]
dificuldade = sys.argv[4]

genai.configure(api_key="")

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

uploaded_files = []
def upload_if_needed(pathname: str) -> list[str]:
  path = Path(pathname)
  hash_id = hashlib.sha256(path.read_bytes()).hexdigest()
  try:
    existing_file = genai.get_file(name=hash_id)
    return [existing_file]
  except:
    pass
  uploaded_files.append(genai.upload_file(path=path, display_name=hash_id))
  return [uploaded_files[-1]]

def extract_pdf_pages(pdf_path: str) -> list[str]:
  parts = [f"--- START OF PDF ${pdf_path} ---"]

  pages = []
  for index, page in enumerate(pages):
    parts.append(f"--- PAGE {index} ---")
    parts.append(page)
  return parts

prompt_parts = [
  *extract_pdf_pages(pdf_path),
  f'''
  Você é um especialista dessa obra. Gere a quantidade de {quantidade} perguntas na modalidade de {modalidade}. Quero que o nível das perguntas sejam de nível {dificuldade} para que eu possa utilizar em um flashCard. Quero a resposta em formato json, mas sem especificar no retorno que é um json. Quero que a resposta só contenha o array dos objetos igual ao formato abaixo:

  Esse é um exemplo da estrtura da resposta:
        [
          {{
            "pergunta": ""
            "resposta": ""
          }}
        ]'''
]
response = model.generate_content(prompt_parts)
print(json.dumps(response.text))
for uploaded_file in uploaded_files:
  genai.delete_file(name=uploaded_file.name)