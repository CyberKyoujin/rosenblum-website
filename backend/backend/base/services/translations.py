from google import genai
from decouple import config
from google.genai import types

api_key = config("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


def stream_translate_text(text_to_translate: str, lan_to: str):
    
    prompt = (
        f"Translate the following text into {lan_to}. "
        "Return ONLY the translation without any additional text or markdown formatting."
    )

    try:
        
        response_stream = client.models.generate_content_stream(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                temperature=0.3, 
            ),
            contents=[prompt, text_to_translate]
        )

        for chunk in response_stream:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        yield f"Error: {str(e)}"
