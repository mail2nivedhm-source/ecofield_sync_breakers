from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI()

# This is the bridge allowing your React dashboard to talk to this AI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SensorData(BaseModel):
    rainfall: float
    soil_moisture: float
    river_level: float

@app.post("/api/evaluate-risk")
def evaluate_risk(data: SensorData):
    # Safety check if the model isn't built yet
    if not os.path.exists('ecoshield_model.pkl'):
        return {"threat_level": "Model not trained yet!"}
        
    # Load AI and make a prediction
    model = joblib.load('ecoshield_model.pkl')
    input_data = pd.DataFrame([{
        'rainfall': data.rainfall,
        'soil_moisture': data.soil_moisture,
        'river_level': data.river_level
    }])
    
    prediction = model.predict(input_data)[0]
    return {"threat_level": prediction}