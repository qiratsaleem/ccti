import requests

def generate_report(user_prompt):
    API_KEY = "AIzaSyAMXpT4_ywSoRWOmv2r8zHqAkE_peWBaj4"  # Replace with your Gemini API key
    API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": user_prompt
                    }
                ]
            }
        ]
    }

    response = requests.post(API_URL, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API call failed with status code {response.status_code}: {response.text}")