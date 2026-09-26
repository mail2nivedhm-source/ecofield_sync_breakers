import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Generate Synthetic Environmental Data
np.random.seed(42)
data_size = 500
rainfall = np.random.uniform(0, 300, data_size)
soil_moisture = np.random.uniform(10, 100, data_size)
river_level = np.random.uniform(1, 15, data_size)

# Calculate Risk based on simple physics
risk_score = (rainfall * 0.4) + (soil_moisture * 0.2) + (river_level * 10)
risk_score = (risk_score / risk_score.max()) * 100

threat_level = []
for score in risk_score:
    if score > 75:
        threat_level.append("High")
    elif score > 40:
        threat_level.append("Medium")
    else:
        threat_level.append("Low")

df = pd.DataFrame({
    'rainfall': rainfall,
    'soil_moisture': soil_moisture,
    'river_level': river_level,
    'risk_score': risk_score,
    'threat_level': threat_level
})

# 2. Train the Scikit-Learn Model
X = df[['rainfall', 'soil_moisture', 'river_level']]
y = df['threat_level']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# 3. Save the Trained Model
joblib.dump(model, 'ecoshield_model.pkl')
print("AI Model successfully trained!")