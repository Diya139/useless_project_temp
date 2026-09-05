from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import clip
import torch
import io

app = Flask(__name__)
CORS(app)

# Load CLIP
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Sadhya items we want to detect
SADHYA_ITEMS = [
    "rice",
    "sambar",
    "rasam",
    "avial",
    "thoran",
    "olan",
    "kalan",
    "pachadi",
    "pickle",
    "moru",
    "dal",
    "papad",
    "payasam",
    "banana",
    "vegetable curry"
]

# Convert names into prompts
PROMPTS = [
    f"a photo of {item} in a Kerala sadya"
    for item in SADHYA_ITEMS
]

text = clip.tokenize(PROMPTS).to(device)

with torch.no_grad():
    text_features = model.encode_text(text)
    text_features /= text_features.norm(dim=-1, keepdim=True)


@app.route("/audit", methods=["POST"])
def audit():

    if "image" not in request.files:
        return jsonify({
            "error": "No image was uploaded."
        }), 400

    image_file = request.files["image"]

    try:
        image = Image.open(io.BytesIO(image_file.read())).convert("RGB")

        image_input = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            image_features = model.encode_image(image_input)
            image_features /= image_features.norm(dim=-1, keepdim=True)

            similarity = (100 * image_features @ text_features.T).softmax(dim=-1)

        scores = similarity[0]

        detected = []

        for i, score in enumerate(scores):
            percentage = float(score) * 100

            if percentage >= 3:
                detected.append({
                    "name": SADHYA_ITEMS[i],
                    "confidence": round(percentage, 2)
                })

        detected.sort(
            key=lambda x: x["confidence"],
            reverse=True
        )

        # Keep the strongest detections
        detected = detected[:8]

        # Temporary audit rules
        violations = []

        # Example rule
        for item in detected:
            if item["name"] == "pickle" and item["confidence"] > 5:
                violations.append(
                    "Pickle placement requires attention."
                )

        score = max(0, 100 - (len(violations) * 10))

        verdict = "ACCEPTABLE"

        if violations:
            verdict = "VIOLATION DETECTED"

        return jsonify({
            "score": score,
            "verdict": verdict,
            "dishes_detected": len(detected),
            "dishes": detected,
            "violations": violations
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )