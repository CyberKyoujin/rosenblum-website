import google.generativeai as genai
from decouple import config

api_key = config("GEMINI_API_KEY", default='')
if api_key:
    genai.configure(api_key=api_key)


def stream_translate_text(text_to_translate: str, lan_to: str):

    prompt = (
        f"Translate the following text into {lan_to}. "
        "Return ONLY the translation without any additional text or markdown formatting.\n\n"
        f"Text to translate: {text_to_translate}"
    )

    try:
        if not api_key:
            yield "Error: GEMINI_API_KEY not configured"
            return

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
            ),
            stream=True
        )

        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        yield f"Error: {str(e)}"
