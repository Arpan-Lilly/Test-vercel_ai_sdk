from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv
import shutil

app = Flask(__name__)

load_dotenv()
# Set your OpenAI API key and base URL
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("CUSTOM_ENDPOINT_URL")  # Set the base URL for OpenAI API

@app.route('/api/chat/transcribe', methods=['POST'])
def transcribe():
    try:
        # Check if a file is uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        # Get the uploaded file
        file = request.files['file']

        # Save the file temporarily
        file_path = "temp_audio.wav"
        file.save(file_path)

        # Send the file to OpenAI Whisper for transcription
        with open(file_path, "rb") as audio_file:
            response = openai.Audio.transcribe(
                model="gpt-4o-mini-transcribe",
                file=audio_file
            )

        # Clean up the temporary file
        shutil.os.remove(file_path)

        # Return the transcription result
        return jsonify({
            "text": response.get("text", ""),
            "segments": response.get("segments", []),
            "language": response.get("language", ""),
            "durationInSeconds": response.get("duration", 0),
        }), 200

    except Exception as e:
        print(f"Transcription error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)