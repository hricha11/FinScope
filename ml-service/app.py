from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or len(data) < 10:
        return jsonify({"error": "Not enough data"}), 400

    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df["amount"] = df["amount"].astype(float)

    # 🔹 Monthly aggregation
    df["month"] = df["date"].dt.to_period("M").dt.to_timestamp()
    monthly = df.groupby("month")["amount"].sum().reset_index()
    monthly = monthly.rename(columns={"month": "ds", "amount": "y"})

    # 🔹 Fallback: average monthly spend
    avg_monthly_spend = monthly["y"].mean()

    try:
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=False,
            yearly_seasonality=True
        )
        model.fit(monthly)

        future = model.make_future_dataframe(periods=1, freq="M")
        forecast = model.predict(future)

        prophet_prediction = forecast.iloc[-1]["yhat"]

        # 🔒 Safety & fallback
        if prophet_prediction <= 0:
            final_prediction = avg_monthly_spend
        else:
            final_prediction = prophet_prediction

    except Exception:
        # Absolute fallback if Prophet fails
        final_prediction = avg_monthly_spend

    return jsonify({
        "prediction": round(float(final_prediction), 2),
        "method": "prophet + statistical fallback"
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
