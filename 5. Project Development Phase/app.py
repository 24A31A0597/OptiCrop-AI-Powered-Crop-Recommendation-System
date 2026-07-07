import os

from flask import Flask, render_template, request
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load("model/crop_model.pkl")

# Per-field validation rules, matched to the constraints already encoded
# in the HTML inputs (min/max/required) in templates/index.html.
FIELD_RULES = {
    "N": {"label": "Nitrogen", "min": 0, "max": None},
    "P": {"label": "Phosphorus", "min": 0, "max": None},
    "K": {"label": "Potassium", "min": 0, "max": None},
    "temperature": {"label": "Temperature", "min": -10, "max": 60},
    "humidity": {"label": "Humidity", "min": 0, "max": 100},
    "ph": {"label": "Soil pH", "min": 0, "max": 14},
    "rainfall": {"label": "Rainfall", "min": 0, "max": None},
}

FIELD_ORDER = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


@app.route("/")
def home():
    return render_template("index.html", values={}, errors={})


@app.route("/predict", methods=["POST"])
def predict():
    values = {}
    errors = {}
    parsed = {}

    for field in FIELD_ORDER:
        raw_value = request.form.get(field, "")
        values[field] = raw_value
        rules = FIELD_RULES[field]

        if raw_value.strip() == "":
            errors[field] = f"{rules['label']} is required."
            continue

        try:
            number = float(raw_value)
        except ValueError:
            errors[field] = f"{rules['label']} must be a valid number."
            continue

        if rules["min"] is not None and number < rules["min"]:
            errors[field] = f"{rules['label']} must be at least {rules['min']}."
            continue

        if rules["max"] is not None and number > rules["max"]:
            errors[field] = f"{rules['label']} must be at most {rules['max']}."
            continue

        parsed[field] = number

    prediction = None
    confidence = None

    if not errors:
        sample = pd.DataFrame([{
            "N": parsed["N"],
            "P": parsed["P"],
            "K": parsed["K"],
            "temperature": parsed["temperature"],
            "humidity": parsed["humidity"],
            "ph": parsed["ph"],
            "rainfall": parsed["rainfall"]
        }])

        prediction = model.predict(sample)[0]

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(sample)[0]
            classes = list(model.classes_)
            predicted_index = classes.index(prediction)
            confidence = round(float(probabilities[predicted_index]) * 100, 1)

    return render_template(
        "index.html",
        prediction=prediction,
        confidence=confidence,
        values=values,
        errors=errors,
    )


if __name__ == "__main__":
    app.run(debug=True)
