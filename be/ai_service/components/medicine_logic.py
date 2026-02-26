import os
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv


# -------------------------
# App setup
# -------------------------
load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URL = os.getenv("MONGODB_URL")
if not MONGO_URL:
    raise ValueError("MONGODB_URL not found in .env file")

# -------------------------
# MongoDB connection
# -------------------------
client = MongoClient(MONGO_URL)

# Use explicit DB name (recommended) to avoid "No default database defined"
DB_NAME = os.getenv("MONGODB_DBNAME", "medicineDB")
db = client[DB_NAME]

print("✅ Connected to MongoDB:", DB_NAME)


# -------------------------
# Debug route (to confirm routes load)
# -------------------------
@app.get("/api/routes-test")
def routes_test():
    return jsonify({"ok": True, "message": "Routes are working"}), 200


# -------------------------
# Health + DB test
# -------------------------
@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "database": DB_NAME}), 200


@app.get("/api/test-db")
def test_db():
    db.test_collection.insert_one({"message": "MongoDB is working", "created_at": datetime.utcnow()})
    return jsonify({"message": "Inserted test document successfully"}), 200


# -------------------------
# Medicines API
# -------------------------
@app.post("/api/medicines")
def add_medicine():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid / missing JSON body"}), 400

    required_fields = ["name", "category", "reorder_level"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    result = db.medicines.insert_one({
        "name": data["name"],
        "category": data["category"],
        "reorder_level": data["reorder_level"],
        "created_at": datetime.utcnow()
    })

    return jsonify({
        "message": "Medicine added successfully",
        "id": str(result.inserted_id)
    }), 201


@app.get("/api/medicines")
def get_medicines():
    meds = list(db.medicines.find({}, {"_id": 0}))
    return jsonify(meds), 200


# -------------------------
# Inventory API (batch-level)
# -------------------------
@app.post("/api/inventory")
def add_inventory():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid / missing JSON body"}), 400

    required_fields = ["medicine_name", "batch_no", "quantity", "expiry_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    # Basic safety conversions
    try:
        quantity = float(data["quantity"])
    except Exception:
        return jsonify({"error": "quantity must be a number"}), 400

    result = db.inventory.insert_one({
        "medicine_name": data["medicine_name"],
        "batch_no": data["batch_no"],
        "quantity": quantity,
        "expiry_date": data["expiry_date"],  # keep string "YYYY-MM-DD" for now
        "created_at": datetime.utcnow()
    })

    return jsonify({
        "message": "Inventory batch added successfully",
        "id": str(result.inserted_id)
    }), 201


@app.get("/api/inventory")
def get_inventory():
    inv = list(db.inventory.find({}, {"_id": 0}))
    return jsonify(inv), 200


# -------------------------
# ML bundle store + serve
# -------------------------
@app.post("/api/ml/upload")
def upload_ml_results():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid / missing JSON body"}), 400

    # Keep only the latest ML bundle
    db.ml_results.delete_many({})
    db.ml_results.insert_one({
        "data": data,
        "created_at": datetime.utcnow()
    })

    return jsonify({"message": "ML results stored successfully"}), 200


@app.get("/api/ml/bundle")
def get_ml_bundle():
    doc = db.ml_results.find_one({}, {"_id": 0})
    if not doc:
        # Return JSON error (NOT HTML)
        return jsonify({"error": "No ML data found. Upload using POST /api/ml/upload"}), 404

    return jsonify(doc["data"]), 200


# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
    