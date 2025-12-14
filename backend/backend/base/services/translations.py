from google import genai
from decouple import config


api_key = config("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


def translate_text(text_to_translate: str, lan_to: str) -> str:
    
    print(text_to_translate)
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Translate the following text, word, or document into {lan_to} as a certified translator for German, Russian, and Ukrainian languages.\n"
        "Please respond only with the finished translation without any details or explanations.\n\n"
        "Text, word or document (can be uploaded as an image or file).\n\n"
        f"{text_to_translate}"
    )
    
    print(response.text)
    
    return response.text
