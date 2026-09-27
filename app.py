import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()
client=OpenAI(base_url = "https://integrate.api.nvidia.com/v1",
  api_key = os.getenv("NVIDIA_API_KEY"))

with open("placement_companies_2026.txt",'r') as file:
    data=file.read() 
    
cb_role=f"""act as a placement trainer and guide the users to achive their dream company , be strict when it comes to preparation and be friendly to the users , 
and dont talk about other topics other than placment ,companies and preparation, refer the data from{data} """

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    question = request.json.get("message")

    completion = client.chat.completions.create(
      model="nvidia/nemotron-3-ultra-550b-a55b",
      messages=[
            {
                "role": "system",
                "content": cb_role
            },
            {
                "role": "user",
                "content": question
            }
        ])

    return jsonify({"reply": completion.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
