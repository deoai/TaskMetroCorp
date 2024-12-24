Implementasi model Regresi Liner untuk prediksi harga berbasis tingkat hunian (in case hotel)
- TechStack
    Backend:Nestjs
    Frontend:React

- Step 1 Dataset, variable: (Done)
-occupancy levels/rate
-price

- Step 2 Build linear regression model using tensorflow @tensorflow/tfjs (Done)

- Step 3 Train (Done)

- Step 4 Predict (Done)

- Step 5 Postman test train (Done)
POST http://localhost:3000/linear-regression/train-from-file
Output: Model trained successfully from file 201

- Step 6 Postman test predict (Done)
GET http://localhost:3000/linear-regression/predict?occupancyValues=65,90,72
Output:
[
    {
        "occupancy": 65,
        "predictedPricing": 281000
    },
    {
        "occupancy": 90,
        "predictedPricing": 375000
    },
    {
        "occupancy": 72,
        "predictedPricing": 307000
    }
]

- Step 7 Test Post Data (Done)

- Step 7 Postgres integration, Table for: (Done)
 Historical occupancy and pricing data, example (Done)
| id  | occupancy | price   |
|-----|-----------|---------|
| 1   | 50        | 250000  |
| 2   | 55        | 275000  |
 Prediction data, example (Done)
|id   | occupancy | predicted_price | timestamp           |
|-----|-----------|-----------------|---------------------|
| 1   | 65        | 280000          | 2024-12-24 12:00:00 |
| 2   | 90        | 370000          | 2024-12-24 12:05:00 |
 Save dataset to historical, and make endpoint store predict to historical_data and prediction_data (Done)

- Step 8 React integration typscript (Done)
  Fetch Backend
  Add Input Occupancy
  Predict Price
  Option Save Predicted Price
