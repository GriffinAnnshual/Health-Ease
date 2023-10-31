"""Prediction module"""

import os
import pickle
import pandas as pd
from flask import Flask, flash, jsonify, request, render_template
from pymongo import MongoClient,DESCENDING
import xgboost as xgb
import time
from datetime import datetime
from bson import ObjectId
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict/*": {"origins": "http://localhost:3001"}}, supports_credentials=True)

from flask_cors import cross_origin




MONGODB_URI = os.getenv("ATLAS_SECRET")

mongo_client = MongoClient(MONGODB_URI)
db = mongo_client.get_database("test")
collection = db.get_collection("Readings")
DEFAULT_MODEL_ENABLED = True



def load_default_model():

    with open(f"{os.path.dirname(os.path.abspath(__file__))}/model.bin", "rb") as f_in:
        loaded_model = pickle.load(f_in)
    print("Loaded default model from disk")
    return loaded_model



def load_model():

    try:
        if DEFAULT_MODEL_ENABLED:
            return load_default_model()
    except:
        if DEFAULT_MODEL_ENABLED:
            return load_default_model()

    return None


def validate_data(record):
    print(record)
    if record["Age"] < 13 or record["Age"] > 50:
        return "Age should be between 13 and 50 years"

    if (
        record["bp-s"] < 50
        or record["bp-s"] > 200
        or record["bp-d"] < 50
        or record["bp-d"] > 200
    ):
        return "Blood pressure should be between 50 and 200 mmHg."

    if record["bp-s"] <= record["bp-d"]:
        return "Systolic blood pressure should be higher that diastolic."

    if record["glucose"] < 50 or record["glucose"] > 200:
        return "Blood sugar level should be between 50 and 200  mg/dL."

    if record["temperature"] < 90 or record["temperature"] > 110:
        return "Body temperature should be between 90 and 110 fahrenheit degrees."

    if record["pulse"] < 45 or record["pulse"] > 130:
        return "Heart rate should be between 45 and 130 bpm."

    return None


def predict(record):

    preds = [round(x) for x in model.predict(xgb.DMatrix(pd.DataFrame([record])))]
    return preds[0]


def convert_risk(pred):
    """
    Converts numerical risk into label
    """
    if pred == 0:
        return "high risk", "danger"
    if pred == 1:
        return "low risk", "success"
    # 2
    return "mid risk", "warning"


def save_to_db(record, risk):
    # """
    # Saves the prediction data to the Mongo database
    # """
    # rec = record.copy()
    # rec["RiskLevel"] = risk
    # collection.insert_one(rec)
    pass


def calculate_risk(record):
    """
    Calculates the maternal health risk
    """
    pred = predict(record)
    risk, category = convert_risk(pred)
    save_to_db(record, risk)
    return risk, category


def calculate_current_week(lmp_date):
    lmp = datetime.strptime(lmp_date, "%Y-%m-%d")
    current = datetime.now()
    days_since_lmp = (current - lmp).days
    current_week = days_since_lmp // 7
    return current_week

def BMI_calculator(BMI):
    def assess_pregnancy_health(age, pre_pregnancy_bmi, chronic_conditions):
        # Age assessment
        age_assessment = "Young" if age < 20 else "Advanced maternal age" if age >= 35 else "Moderate age"

        # BMI assessment
        if pre_pregnancy_bmi < 18.5:
            bmi_assessment = "Underweight"
        elif 18.5 <= pre_pregnancy_bmi < 24.9:
            bmi_assessment = "Normal Weight"
        elif 25 <= pre_pregnancy_bmi < 29.9:
            bmi_assessment = "Overweight"
        else:
            bmi_assessment = "Obese"

        # Chronic conditions assessment
        if chronic_conditions:
            chronic_conditions_assessment = "Has chronic conditions"
        else:
            chronic_conditions_assessment = "No chronic conditions"

        # Overall health assessment
        if age_assessment == "Advanced maternal age" or bmi_assessment == "Obese" or chronic_conditions:
            overall_health_assessment = "May require additional monitoring"
        else:
            overall_health_assessment = "Generally healthy"

        return {
            "Age Assessment": age_assessment,
            "BMI Assessment": bmi_assessment,
            "Chronic Conditions Assessment": chronic_conditions_assessment,
            "Overall Health Assessment": overall_health_assessment,
        }

    age = 30
    pre_pregnancy_bmi = BMI["value"]
    chronic_conditions = BMI["cronic"].lower() == "yes"

    assessment = assess_pregnancy_health(age, pre_pregnancy_bmi, chronic_conditions)
    result = ""
    for key, value in assessment.items():
        result += key + "-" + value + ". "
        
    return result,assessment["BMI Assessment"]



def OXYGEN_calculator(oxygen):
    if oxygen["value"] >= 95:
        health_assessment = "Normal oxygen levels, likely healthy"
        valid = "Normal"
    elif 90 <= oxygen["value"] < 95:
        health_assessment = "Mild oxygen desaturation, consult a healthcare provider"
        valid = "Mild oxygen desaturation"
    elif oxygen["value"] < 90:
        health_assessment = "Low oxygen levels, seek immediate medical attention"
        valid = "Low oxygen level"
    else:
        health_assessment = "Invalid input"

    return health_assessment,valid

def PRESSURE_calculator_S(systolic_bp):
    if systolic_bp["value"] < 90:
        health_assessment = "Low blood pressure, consult a healthcare provider"
        short = "Low"
    elif 90 <= systolic_bp["value"] <= 130:
        health_assessment = "Normal blood pressure, likely healthy"
        short = "Normal"
    elif 131 <= systolic_bp["value"] <= 139:
        health_assessment = "Elevated blood pressure, monitor closely and consult a healthcare provider"
        short = "Elevated"
    elif 140 <= systolic_bp["value"] <= 159:
        health_assessment = "High blood pressure (Stage 1), consult a healthcare provider"
        short = "High"
    elif 160 <= systolic_bp["value"]:
        health_assessment = "High blood pressure (Stage 2), seek immediate medical attention"
        health_assessment = "Very high"
    else:
        health_assessment = "Invalid input"

    return health_assessment,short

def PRESSURE_calculator_D(diastolic_bp):
    if diastolic_bp["value"] < 60:
        health_assessment = "Low diastolic blood pressure, consult a healthcare provider"
        short = "Low"
    elif 60 <= diastolic_bp["value"] <= 80:
        health_assessment = "Normal diastolic blood pressure, likely healthy"
        short = "Normal"
    elif 81 <= diastolic_bp["value"] <= 89:
        health_assessment = "Elevated diastolic blood pressure, monitor closely and consult a healthcare provider"
        short =  "High"
    elif diastolic_bp["value"] >= 90:
        health_assessment = "High diastolic blood pressure, consult a healthcare provider"
        short = "Very high"
    else:
        health_assessment = "Invalid input"

    return health_assessment,short

def SUGAR_calculator(blood_sugar):
    if blood_sugar["value"] < 70:
        health_assessment = "Low blood sugar, consult a healthcare provider"
        short ="Low"
    elif 70 <= blood_sugar["value"] <= 110:
        health_assessment = "Normal blood sugar, likely healthy"
        short = "Normal"
    elif 111 <= blood_sugar["value"] <= 125:
        health_assessment = "Prediabetes range, monitor closely and consult a healthcare provider"
        short = "Prediabetes range"
    elif blood_sugar["value"] >= 126:
        health_assessment = "High blood sugar (diabetes), consult a healthcare provider"
        short = "High"
    else:
        health_assessment = "Invalid input"

    return health_assessment,short


def PULSE_calculator(pulse_rate):
    if 60 <= pulse_rate["value"] <= 100:
        health_assessment = "Normal pulse rate, likely healthy"
        short = "Normal"
    elif 40 <= pulse_rate["value"] < 60:
        health_assessment = "Low pulse rate, consult a healthcare provider"
        short = "Low"
    elif pulse_rate["value"] >= 100:
        health_assessment = "High pulse rate, consult a healthcare provider"
        short = "High"
    else:
        health_assessment = "Invalid input"

    return health_assessment,short

def TEMPERATURE_calculator(body_temperature):
    if 97 <= body_temperature["value"] <= 99:
        health_assessment = "Normal body temperature, likely healthy"
        short = "Normal"
    elif body_temperature["value"] < 97:
        health_assessment = "Low body temperature, consult a healthcare provider"
        short = "Low"
    elif body_temperature["value"] > 99:
        health_assessment = "High body temperature, consult a healthcare provider"
        short = "High"
    else:
        health_assessment = "Invalid input"

    return health_assessment,short


app = Flask("HealthEase")
app.secret_key = os.urandom(24)

model = load_model()


@app.route("/", methods=["GET", "POST"])
def predict_form_endpoint():
    """
    Prediction form endpoint
    """


    if request.method == "POST":
        record = {}
        record["Age"] = int(request.form.get("Age"))
        record["SystolicBP"] = int(request.form.get("SystolicBP"))
        record["DiastolicBP"] = int(request.form.get("DiastolicBP"))
        record["BS"] = float(request.form.get("BS"))
        record["BodyTemp"] = float(request.form.get("BodyTemp"))
        record["HeartRate"] = int(request.form.get("HeartRate"))

        error_message = validate_data(record)
        if error_message:
            flash(error_message, 'info')
        else:
            risk, category = calculate_risk(record)
            flash(risk.capitalize(), category)

    return render_template("index.html")


@app.route("/predict")
@cross_origin()
def predict_json_endpoint():
    record = {}
    collection2 = db.get_collection("Readings")

    while True:
        record2 = collection2.find_one(sort=[("_id", DESCENDING)])
        print(record2)
        if record2:
            record["Age"] = record2["Age"] = 30
            record["SystolicBP"] = record2["bp-s"]
            record["DiastolicBP"] = record2["bp-d"]
            record["BS"] =int((record2["glucose"]) * 0.0555)
            record["BodyTemp"] = record2["temperature"]
            record["HeartRate"] = record2["pulse"]

            error_message = validate_data(record2)
            if error_message:
                return jsonify({"Error": error_message})

            risk, _ = calculate_risk(record)        
            break
        time.sleep(1)

    height = record2["height"]/100
    weight = (record2["weight"])
    # cronic = record2["cronic"] 
    cronic = "yes"

    BMI = int(weight / (height)**2)
    bmi_message = {"value":BMI ,"cronic": cronic,"message": "","short":""}
    bmi_message["message"] , bmi_message["short"] = BMI_calculator(bmi_message)



    oxygen =  record2["oxygen"]
    oxygen_message = {"value": oxygen ,"message": "","short":""}
    oxygen_message["message"],oxygen_message["short"] = OXYGEN_calculator(oxygen_message)


    systolic_pressure = record2["bp-s"]
    systolic_pressure_message = {"value":systolic_pressure ,"message": "","short":""}
    systolic_pressure_message["message"],systolic_pressure_message["short"] = PRESSURE_calculator_S(systolic_pressure_message)

    diastolic_pressure = record2["bp-d"]
    diastolic_pressure_message = {"value":diastolic_pressure ,"message": "","short":""}
    diastolic_pressure_message["message"],diastolic_pressure_message["short"] = PRESSURE_calculator_D(diastolic_pressure_message)

    blood_sugar = (record2["glucose"]) * 0.0555
    blood_sugar_message = {"value":blood_sugar ,"message": "","short":""}
    blood_sugar_message["message"],blood_sugar_message["short"] = SUGAR_calculator(blood_sugar_message)

    pulse =  record2["pulse"]
    pulse_message = {"value":pulse ,"message": "","short":""}
    pulse_message["message"],pulse_message["short"] = PULSE_calculator(pulse_message)


    temperature = record2["temperature"]
    temperature_message = {"value":temperature ,"message": "","short":""}
    temperature_message["message"],temperature_message["short"] = TEMPERATURE_calculator(temperature_message)
    
    lmp_date = "2023-9-10"
    curr_week = calculate_current_week(lmp_date)

    output = {"RiskLevel": risk,"BMI":bmi_message,"Oxygen":oxygen_message,"systolic_pressure":systolic_pressure_message,"diastolic_pressure": diastolic_pressure_message,"blood_sugar": blood_sugar_message,"pulse": pulse_message,"temperature":temperature_message,"curr_week":curr_week }

    return jsonify(output , json.dumps(record2,default=str))   



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3001)
