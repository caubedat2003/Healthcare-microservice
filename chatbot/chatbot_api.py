from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import pandas as pd
from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import numpy as np
import csv
import re
import uuid

app = Flask(__name__)
CORS(app, resources={r"/chatbot/*": {"origins": "http://localhost:3000", "headers": "Content-Type", "supports_credentials": True}})
app.config['SESSION_TYPE'] = 'filesystem'
app.secret_key = 'your-secret-key-hihihihiiihihihihiihihihihihihihihihihi'  # Secure secret key for sessions
Session(app)

# Load and prepare data
training = pd.read_csv('Training.csv')
cols = training.columns[:-1]  # All symptoms (features)
x = training[cols]
y = training['prognosis']

le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)
clf = DecisionTreeClassifier().fit(x_train, y_train)

# Load additional data
severityDictionary = {}
description_list = {}
precautionDictionary = {}
symptoms_dict = {symptom: index for index, symptom in enumerate(cols)}

def load_severity():
    with open('Symptom_severity.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if len(row) > 1:
                severityDictionary[row[0]] = int(row[1])

def load_descriptions():
    with open('symptom_Description.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            description_list[row[0]] = row[1]

def load_precautions():
    with open('symptom_precaution.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            precautionDictionary[row[0]] = row[1:]

load_severity()
load_descriptions()
load_precautions()

def check_pattern(dis_list, inp):
    pred_list = []
    inp = inp.replace(' ', '_')
    patt = f"{inp}"
    regexp = re.compile(patt, re.IGNORECASE)
    pred_list = [item for item in dis_list if regexp.search(item)]
    return 1 if len(pred_list) > 0 else 0, pred_list

def predict_disease(symptoms_exp):
    input_vector = np.zeros(len(symptoms_dict))
    for item in symptoms_exp:
        input_vector[symptoms_dict[item]] = 1
    pred = clf.predict([input_vector])[0]
    disease = le.inverse_transform([pred])[0]
    description = description_list.get(disease, "No description available.")
    precautions = precautionDictionary.get(disease, ["Consult a doctor."])
    return {
        "disease": disease,
        "description": description,
        "precautions": precautions
    }

@app.route('/chatbot/start', methods=['POST'])
def start_conversation():
    session.clear()
    session['symptoms_exp'] = []
    session['step'] = 'greet'
    return jsonify({"message": "Hello! I’m your HealthCare ChatBot. What’s your name?"})

@app.route('/chatbot/respond', methods=['POST'])
def respond():
    user_input = request.json.get('input', '').strip()
    if 'step' not in session:
        return jsonify({"error": "Please start the conversation first."}), 400

    step = session['step']
    symptoms_exp = session['symptoms_exp']

    if step == 'greet':
        session['name'] = user_input
        session['step'] = 'initial_symptom'
        return jsonify({"message": f"Hello, {user_input}! Please tell me the first symptom you’re experiencing."})

    elif step == 'initial_symptom':
        found, matches = check_pattern(cols, user_input)
        if not found:
            return jsonify({"message": "Sorry, I didn’t recognize that symptom. Please try again."})
        session['matches'] = matches
        session['step'] = 'select_symptom'
        matches_list = "\n".join([f"{i}) {m.replace('_', ' ')}" for i, m in enumerate(matches)])
        return jsonify({"message": f"I found these related symptoms:\n{matches_list}\nSelect the one you meant (enter the number):"})

    elif step == 'select_symptom':
        try:
            choice = int(user_input)
            matches = session['matches']
            if 0 <= choice < len(matches):
                selected_symptom = matches[choice]
                symptoms_exp.append(selected_symptom)
                session['symptoms_exp'] = symptoms_exp
                session['days'] = None
                session['step'] = 'days'
                return jsonify({"message": f"Okay, you’ve had {selected_symptom.replace('_', ' ')}. For how many days?"})
            else:
                return jsonify({"message": "Invalid selection. Please enter a valid number."})
        except ValueError:
            return jsonify({"message": "Please enter a number."})

    elif step == 'days':
        try:
            days = int(user_input)
            session['days'] = days
            session['remaining_questions'] = [s for s in cols if s not in symptoms_exp][:10]  # Limit to 10 follow-ups
            session['step'] = 'follow_up'
            if session['remaining_questions']:
                next_symptom = session['remaining_questions'].pop(0)
                session['current_question'] = next_symptom
                return jsonify({"message": f"Are you experiencing {next_symptom.replace('_', ' ')}? (yes/no)"})
            else:
                return end_conversation()
        except ValueError:
            return jsonify({"message": "Please enter a valid number of days."})

    elif step == 'follow_up':
        current_question = session['current_question']
        if user_input.lower() in ['yes', 'y']:
            symptoms_exp.append(current_question)
            session['symptoms_exp'] = symptoms_exp
        remaining_questions = session['remaining_questions']
        if remaining_questions:
            next_symptom = remaining_questions.pop(0)
            session['current_question'] = next_symptom
            session['remaining_questions'] = remaining_questions
            return jsonify({"message": f"Are you experiencing {next_symptom.replace('_', ' ')}? (yes/no)"})
        else:
            return end_conversation()

    return jsonify({"error": "Something went wrong."}), 500

def end_conversation():
    symptoms_exp = session['symptoms_exp']
    result = predict_disease(symptoms_exp)
    message = (
        f"Based on your symptoms, you may have {result['disease']}.\n"
        f"{result['description']}\n"
        "Take these measures:\n" + "\n".join([f"{i+1}) {p}" for i, p in enumerate(result['precautions'])])
    )
    session.clear()
    return jsonify({"message": message, "finished": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)