# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from pymongo import MongoClient
# import pandas as pd
# import numpy as np
# import os
# import certifi
# from datetime import datetime, timedelta
# from pytorch_forecasting import TemporalFusionTransformer
# from pulp import LpProblem, LpMinimize, LpVariable, value

# # ✅ NEW IMPORTS FOR LSTM
# import torch
# import torch.nn as nn
# import joblib

# app = Flask(__name__)

# # --- FIX: ALLOW ALL TRAFFIC ---
# CORS(app, resources={r"/*": {"origins": "*"}})

# # ==========================================
# # 1. DATABASE CONNECTION
# # ==========================================
# MONGO_URI = "mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/test?appName=ITPM"

# print("⏳ Connecting to MongoDB...")
# try:
#     client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
#     db = client["Research"]
#     collection = db["BedDailyinputs"]             # Daily Census Data
#     history_collection = db["BedPredictionHistory"]  # AI Predictions
#     bed_inventory_collection = db["BedInventory"]    # Physical Assets
#     surge_collection = db["BedSurgeArea"]            # Surge Capacity Table
#     # NOTE: We no longer keep a separate ETU approvals collection.
#     # Use a single transfer/audit collection for both active state (latest per ward)
#     # and append-only logs.
#     etu_transfer_collection = db["Bed_TransferCount"]

#     client.admin.command("ping")
#     print("✅ Connected to Cloud Database!")
# except Exception as e:
#     print(f"❌ Database Error: {e}")

# # ==========================================
# # 2. LOAD AI MODELS (TFT + LSTM)
# # ==========================================
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# AI_ROOT = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

# # helper: look for model files in common locations (current dir, parent ai_service dir, Save_file)
# def find_model_file(filename):
#     candidates = [
#         os.path.join(BASE_DIR, filename),
#         os.path.join(AI_ROOT, filename),
#         os.path.join(AI_ROOT, "Save_file", filename),
#         os.path.join(AI_ROOT, "Save_file", "Bed", filename),
#         os.path.join(AI_ROOT, "Bed", filename),
#     ]
#     for p in candidates:
#         if os.path.exists(p):
#             return p
#     # attach the attempted list for debug when not found
#     find_model_file._last_tried = candidates
#     return None

# # --- LOAD TFT MODEL ---
# tft_filename = "hospital_etu_tft_model_80split.ckpt"
# tft_path = find_model_file(tft_filename)
# best_tft = None

# if tft_path:
#     print(f"⏳ Loading TFT AI Model from: {tft_path} (This may take a few seconds)")
#     try:
#         best_tft = TemporalFusionTransformer.load_from_checkpoint(tft_path, map_location="cpu")
#         print("✅ TFT Engine Loaded Successfully!")
#     except Exception as e:
#         print(f"❌ TFT load error: {e}")
# else:
#     tried = getattr(find_model_file, "_last_tried", [os.path.join(BASE_DIR, tft_filename), os.path.join(AI_ROOT, tft_filename)])
#     print(f"\n⚠️  CRITICAL ERROR: TFT MODEL FILE MISSING! (searched: {tried})")

# # --- DEFINE & LOAD LSTM MODEL ---
# class HospitalLSTM(nn.Module):
#     def __init__(self, input_size, hidden_size=32, num_layers=2):
#         super(HospitalLSTM, self).__init__()
#         self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
#         self.fc = nn.Linear(hidden_size, 1)

#     def forward(self, x):
#         out, _ = self.lstm(x)
#         out = self.fc(out[:, -1, :])
#         return out

# lstm_filename = "hospital_lstm_model.pt"
# scaler_filename = "lstm_scaler.pkl"
# lstm_path = find_model_file(lstm_filename)
# scaler_path = find_model_file(scaler_filename)
# lstm_model = None
# lstm_scaler = None

# if lstm_path and scaler_path:
#     print(f"⏳ Loading LSTM AI Model & Scaler from: {lstm_path}, {scaler_path}...")
#     try:
#         lstm_model = HospitalLSTM(input_size=3)
#         state = torch.load(lstm_path, map_location=torch.device("cpu"))
#         # checkpoint might be a state_dict or a full model; handle both
#         if isinstance(state, dict):
#             lstm_model.load_state_dict(state)
#         else:
#             lstm_model = state
#         lstm_model.eval()
#         lstm_scaler = joblib.load(scaler_path)
#         print("✅ LSTM Engine & Scaler Loaded Successfully!")
#     except Exception as e:
#         print(f"❌ LSTM load error: {e}")
# else:
#     tried = getattr(find_model_file, "_last_tried", [os.path.join(BASE_DIR, lstm_filename), os.path.join(AI_ROOT, lstm_filename)])
#     print(f"\n⚠️  CRITICAL ERROR: LSTM MODEL OR SCALER MISSING! (searched: {tried})")

# # ==========================================
# # 3. HELPER FUNCTIONS
# # ==========================================


# def fetch_etu_history():
#     try:
#         query = {"$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}]}
#         cursor = collection.find(query).sort([("Date", 1), ("Shift_ID", 1)])
#         df = pd.DataFrame(list(cursor))

#         if df.empty:
#             return None
#         if "_id" in df.columns:
#             df.drop("_id", axis=1, inplace=True)

#         if "Ward_ID" in df.columns:
#             df = df[df["Ward_ID"].isna() | (df["Ward_ID"] == "ETU")]

#         df["Date"] = pd.to_datetime(df["Date"])
#         today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
#         df = df[df["Date"] <= today]

#         df = df.sort_values(["Date", "Shift_ID"]).reset_index(drop=True)
#         df["time_idx"] = np.arange(len(df))
#         df["group"] = "ETU_Main"

#         for col in ["ETU_Admissions", "ETU_Discharges", "ETU_OccupiedBeds", "ETU_BedCapacity"]:
#             df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(np.float32)

#         return df
#     except Exception as e:
#         print(f"Database Fetch Error: {e}")
#         return None

# # ✅ 3-shift previous occupancy logic using DB labels
# def get_previous_shift_occupancy(target_date_str, target_shift):
#     try:
#         target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()

#         if target_shift == "Morning (A)":
#             prior_date = (target_date - timedelta(days=1)).strftime("%Y-%m-%d")
#             prior_shift = "Night (C)"
#         elif target_shift == "Evening (B)":
#             prior_date = target_date.strftime("%Y-%m-%d")
#             prior_shift = "Morning (A)"
#         else:  # Night (C)
#             prior_date = target_date.strftime("%Y-%m-%d")
#             prior_shift = "Evening (B)"

#         query = {
#             "$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}],
#             "Date": prior_date,
#             "Shift_ID": prior_shift,
#         }
#         record = collection.find_one(query)

#         if record:
#             return int(record.get("ETU_OccupiedBeds", 0))
#         else:
#             fallback_query = {"$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}]}
#             latest = collection.find_one(fallback_query, sort=[("Date", -1), ("_id", -1)])
#             return int(latest.get("ETU_OccupiedBeds", 0)) if latest else 0

#     except Exception as e:
#         print(f"⚠️ Error finding prior occupancy: {e}")
#         return 0

# def get_ward_realtime_free_space(ward_id, occupancy_key="OccupiedBeds"):
#     try:
#         capacity = bed_inventory_collection.count_documents({"ward_id": ward_id, "status": "Functional"})

#         latest_record = collection.find_one({"Ward_ID": ward_id}, sort=[("Date", -1), ("_id", -1)])
#         occupancy = int(latest_record.get(occupancy_key, 0)) if latest_record else 0

#         free_space = max(0, capacity - occupancy)
#         return free_space, capacity
#     except Exception as e:
#         print(f"⚠️ Error checking {ward_id}: {e}")
#         return 0
    
# def get_surge_limit(ward_id):
#     try:
#         latest = surge_collection.find_one({"Ward_ID": ward_id}, sort=[("Timestamp", -1)])
#         if latest:
#             return int(latest.get("Surge_Capacity_Available", 0))
#         return 0
#     except Exception as e:
#         print(f"⚠️ Error fetching surge limit for {ward_id}: {e}")
#         return 0, 0


# # -----------------------------
# # ETU Approvals helpers
# # -----------------------------
# def save_etu_approval(data: dict):
#     try:
#         # expected fields: ward_id, target_date, target_shift, approved (bool), suggested_number (int), reason (str), nurse_id
#         filter_q = {
#             "ward_id": data.get("ward_id"),
#             "target_date": data.get("target_date"),
#             "target_shift": data.get("target_shift"),
#         }
#         payload = {
#             "$set": {
#                 "ward_id": data.get("ward_id"),
#                 "target_date": data.get("target_date"),
#                 "target_shift": data.get("target_shift"),
#                 "approved": bool(data.get("approved", False)),
#                 "suggested_number": int(data.get("suggested_number")) if data.get("suggested_number") is not None else None,
#                 "reason": data.get("reason"),
#                 "nurse_id": data.get("nurse_id"),
#                 "updated_at": datetime.now(),
#             }
#         }
#         # Log the transfer/response into the single TransferCount collection for analytics.
#         try:
#             transfer_record = {
#                 "ward_id": data.get("ward_id"),
#                 "target_date": data.get("target_date"),
#                 "target_shift": data.get("target_shift"),
#                 "approved": bool(data.get("approved", False)),
#                 "suggested_number": int(data.get("suggested_number")) if data.get("suggested_number") is not None else None,
#                 "reason": data.get("reason"),
#                 "nurse_id": data.get("nurse_id"),
#                 "submitted_at": datetime.now(),
#             }

#             # try to attach prediction info if available
#             try:
#                 hist = history_collection.find_one({"target_date": data.get("target_date"), "target_shift": data.get("target_shift")})
#                 if hist:
#                     transfer_record["predicted_arrivals"] = int(hist.get("predicted_arrivals", 0))
#                     transfer_record["optimization_plan"] = hist.get("optimization_plan")
#             except Exception as e:
#                 print(f"⚠️ Could not fetch prediction for transfer record: {e}")

#             etu_transfer_collection.insert_one(transfer_record)
#         except Exception as e:
#             print(f"❌ Transfer log save error: {e}")

#         return True
#     except Exception as e:
#         print(f"❌ Save approval error: {e}")
#         return False


# def fetch_etu_approvals(target_date: str, target_shift: str):
#     """
#     Return the latest transfer/log row per ward for the given target_date and target_shift.
#     This function reads from the `Bed_TransferCount` collection and selects the most
#     recent entry (by submitted_at) for each ward.
#     """
#     try:
#         query = {"target_date": target_date, "target_shift": target_shift}
#         # Fetch newest first to simplify "latest per ward" selection and avoid fragile comparisons
#         cursor = etu_transfer_collection.find(query, {"_id": 0}).sort([("submitted_at", -1)])
#         docs = list(cursor)

#         latest_by_ward = {}
#         for d in docs:
#             # normalize ward id (trim + uppercase) to avoid mismatches like trailing spaces
#             wid_raw = (d.get("ward_id") or d.get("ward") or "")
#             wid = str(wid_raw).strip().upper()
#             # if we haven't recorded a latest for this ward yet, the current doc is the newest (cursor is desc sorted)
#             if wid and wid not in latest_by_ward:
#                 latest_by_ward[wid] = d

#         return list(latest_by_ward.values())
#     except Exception as e:
#         print(f"❌ Fetch approvals error: {e}")
#         return []


# def summarize_etu_approvals(target_date: str, target_shift: str):
#     docs = fetch_etu_approvals(target_date, target_shift)
#     wards_of_interest = ["WARD-A", "WARD-B", "GEN"]
#     summary = {w: {"exists": False, "approved": False, "suggested_number": None, "reason": None, "nurse_id": None} for w in wards_of_interest}

#     for d in docs:
#         wid = (d.get("ward_id") or d.get("ward") or "").upper()
#         if wid in summary:
#             # prefer explicit updated_at, fallback to submitted_at
#             updated = d.get("updated_at") or d.get("submitted_at")
#             # Interpret suggested_number == 0 as an explicit rejection
#             suggested_val = d.get("suggested_number")
#             try:
#                 suggested_num = int(suggested_val) if suggested_val is not None else None
#             except Exception:
#                 suggested_num = None

#             approved_flag = bool(d.get("approved", False))
#             if suggested_num == 0:
#                 approved_flag = False

#             summary[wid] = {
#                 "exists": True,
#                 "approved": approved_flag,
#                 "suggested_number": suggested_num,
#                 "reason": d.get("reason"),
#                 "nurse_id": d.get("nurse_id"),
#                 "updated_at": updated,
#             }

#     all_approved = all(summary[w]["exists"] and summary[w]["approved"] for w in wards_of_interest)
#     suggested_total = sum(s.get("suggested_number", 0) or 0 for s in summary.values())

#     return {"per_ward": summary, "all_approved": all_approved, "suggested_total": suggested_total, "raw": docs}

# # ==========================================
# # 4. ROUTES
# # ==========================================
# @app.route("/", methods=["GET"])
# def home():
#     return "<h1>✅ Server is Running!</h1>", 200


# @app.route("/api/add-bed", methods=["POST"])
# def add_bed():
#     try:
#         data = request.json
#         if not data.get("bed_id") or not data.get("ward_id"):
#             return jsonify({"error": "Bed ID and Ward required"}), 400

#         if bed_inventory_collection.find_one({"bed_id": data["bed_id"]}):
#             return jsonify({"error": f"Bed ID '{data['bed_id']}' exists!"}), 409

#         bed_record = {
#             "bed_id": data["bed_id"],
#             "bed_type": data["bed_type"],
#             "ward_id": data["ward_id"],
#             "ward_name": data["ward_name"],
#             "status": "Functional",
#             "added_at": datetime.now(),
#         }
#         bed_inventory_collection.insert_one(bed_record)
#         return jsonify({"message": "Bed added!"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#@app.route("/api/get-beds", methods=["GET"])
def get_beds():
    try:
        beds = list(bed_inventory_collection.find({}, {"_id": 0}))
        return jsonify(beds), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route("/api/update-bed-status", methods=["PUT"])
# def update_bed_status():
#     try:
#         data = request.json
#         result = bed_inventory_collection.update_one(
#             {"bed_id": data.get("bed_id")},
#             {"$set": {"status": data.get("status"), "updated_at": datetime.now()}},
#         )
#         if result.matched_count == 0:
#             return jsonify({"error": "Bed not found"}), 404
#         return jsonify({"message": "Updated!"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#@app.route("/api/ward-status/<ward_id>", methods=["GET"])
def get_ward_status_api(ward_id):
    key = "ETU_OccupiedBeds" if ward_id == "ETU" else "OccupiedBeds"
    free_space, capacity = get_ward_realtime_free_space(ward_id, key)
    return jsonify(
        {
            "ward_id": ward_id,
            "capacity": capacity,
            "available": free_space,
            "occupied": max(0, capacity - free_space),
        }
    ), 200

def add_record():
    try:
        data = request.get_json(force=True) or {}

        # Surge updates are stored in the surge collection
        if data.get("EventType") == "SurgeUpdate":
            surge_record = {
                "Ward_ID": data.get("Ward_ID") or data.get("Ward_ID"),
                "Ward_Name": data.get("Ward_Name"),
                "Date": data.get("Date"),
                "Surge_Capacity_Available": int(data.get("Surge_Capacity_Available", 0)),
                "Timestamp": datetime.now(),
            }
            surge_collection.insert_one(surge_record)
            return jsonify({"message": "Surge capacity saved successfully!"}), 200

        # Otherwise save census/daily record
        collection.insert_one(data)
        return jsonify({"message": "Census data saved successfully!"}), 200
    except Exception as e:
        print(f"❌ Save Error: {e}")
        return jsonify({"error": str(e)}), 500


def get_history():
    try:
        record_type = request.args.get("type")
        ward = request.args.get("ward") or request.args.get("Ward_ID")

        if record_type == "SurgeUpdate":
            # Accept both WARD-A / WARD_A / other variations in Ward_ID stored in DB
            if ward:
                wid = str(ward).strip().upper()
                variants = [wid, wid.replace('_', '-'), wid.replace('-', '_')]
                latest = surge_collection.find_one({"Ward_ID": {"$in": variants}}, sort=[("Timestamp", -1)])
            else:
                latest = surge_collection.find_one(sort=[("Timestamp", -1)])

            if latest:
                return jsonify({"count": int(latest.get("Surge_Capacity_Available", 0)), "lastUpdated": latest.get("Date")}), 200
            else:
                return jsonify({"count": 0, "lastUpdated": None}), 200

        return jsonify({"error": "Invalid type"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @app.route("/api/etu/approve", methods=["POST"])
# def etu_approve():
#     try:
#         data = request.json or {}
#         required = ["ward_id", "target_date", "target_shift", "approved"]
#         for r in required:
#             if r not in data:
#                 return jsonify({"error": f"Missing field: {r}"}), 400

#         ok = save_etu_approval(data)
#         if not ok:
#             return jsonify({"error": "Failed to save approval"}), 500
#         return jsonify({"message": "Approval saved"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/api/etu/approvals", methods=["GET"])
# def etu_approvals_get():
#     try:
#         target_date = request.args.get("target_date")
#         target_shift = request.args.get("target_shift")
#         if not target_date or not target_shift:
#             return jsonify({"error": "target_date and target_shift required"}), 400

#         summary = summarize_etu_approvals(target_date, target_shift)
#         return jsonify(summary), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


#@app.route("/api/transfer-count", methods=["GET"])
def get_transfer_count():
    try:
        target_date = request.args.get("target_date")
        target_shift = request.args.get("target_shift")
        ward = request.args.get("ward")

        query = {}
        if target_date:
            query["target_date"] = target_date
        if target_shift:
            query["target_shift"] = target_shift
        if ward:
            query["ward_id"] = ward

        docs = list(etu_transfer_collection.find(query, {"_id": 0}).sort([("submitted_at", -1)]).limit(200))
        # convert datetimes to ISO strings for JSON
        for d in docs:
            if isinstance(d.get("submitted_at"), datetime):
                d["submitted_at"] = d["submitted_at"].isoformat()
        return jsonify({"count": len(docs), "rows": docs}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#@app.route("/api/get-trend-data", methods=["GET"])
def get_trend_data():
    try:
        obs_cursor = (
            collection.find({"$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}]})
            .sort([("Date", -1), ("Shift_ID", -1)])
            .limit(10)
        )
        obs_data = list(obs_cursor)
        pred_cursor = history_collection.find().sort([("target_date", -1), ("target_shift", -1)]).limit(10)
        pred_data = list(pred_cursor)

        merged_timeline = {}

        for doc in obs_data:
            key = f"{doc['Date']}_{doc['Shift_ID']}"
            try:
                dt = pd.to_datetime(doc["Date"])
                label = f"{dt.strftime('%b %d')} ({str(doc['Shift_ID'])[0]})"
            except:
                label = f"{doc['Date']} ({doc['Shift_ID']})"

            if key not in merged_timeline:
                merged_timeline[key] = {"name": label, "sort_key": key}
            merged_timeline[key]["Observed"] = int(doc.get("ETU_Admissions", 0))

        for doc in pred_data:
            key = f"{doc['target_date']}_{doc['target_shift']}"
            if key not in merged_timeline:
                try:
                    dt = pd.to_datetime(doc["target_date"])
                    label = f"{dt.strftime('%b %d')} ({str(doc['target_shift'])[0]})"
                except:
                    label = f"{doc['target_date']} ({doc['target_shift']})"
                merged_timeline[key] = {"name": label, "sort_key": key}

            # prefer predicted_arrivals or predicted_arrivals_total, or per-gender fields
            predicted_val = doc.get("predicted_arrivals") or doc.get("predicted_arrivals_total") or 0
            if not predicted_val:
                # try gender fields
                try:
                    pm = int(doc.get("predicted_arrivals_male", 0) or 0)
                    pf = int(doc.get("predicted_arrivals_female", 0) or 0)
                    predicted_val = pm + pf
                except Exception:
                    predicted_val = 0

            merged_timeline[key]["Predicted"] = int(predicted_val)

        chart_data = list(merged_timeline.values())
        chart_data.sort(key=lambda x: x["sort_key"])
        return jsonify(chart_data), 200

    except Exception as e:
        print(f"❌ Chart Data Error: {e}")
        return jsonify({"error": str(e)}), 500

# # ==========================================
# # 5. PREDICTION & OPTIMIZATION (ENSEMBLE)
# # ==========================================
# @app.route("/predict", methods=["GET"])
# def predict():
#     if best_tft is None:
#         return jsonify({"error": "TFT AI Model not loaded."}), 500

#     df = fetch_etu_history()
#     if df is None or len(df) < 50:
#         return jsonify({"error": f"Insufficient ETU history ({len(df) if df is not None else 0} records)."}), 500

#     current_dt = datetime.now()
#     current_hour = current_dt.hour

#     # ✅ TRUE 3-SHIFT LOGIC
#     # Morning (A): 07:00 - 13:00
#     # Evening (B): 13:00 - 19:00
#     # Night (C):  19:00 - 07:00
#     if 7 <= current_hour < 13:
#         target_date_obj = current_dt.date()
#         display_shift = "Evening (B)"   # predict next shift
#         target_weather = "Sunny"
#     elif 13 <= current_hour < 19:
#         target_date_obj = current_dt.date()
#         display_shift = "Night (C)"
#         target_weather = "Rainy"
#     elif 19 <= current_hour <= 23:
#         target_date_obj = current_dt.date() + timedelta(days=1)
#         display_shift = "Morning (A)"
#         target_weather = "Sunny"
#     else:
#         target_date_obj = current_dt.date()
#         display_shift = "Morning (A)"
#         target_weather = "Sunny"

#     target_date_str = target_date_obj.strftime("%Y-%m-%d")
#     print(f"\n🕒 Predicting for: {target_date_str} Shift: {display_shift}")

#     # --- PREPARE DATA FOR TFT ---
#     future_row = df.tail(1).copy()
#     future_row["time_idx"] = df["time_idx"].max() + 1
#     future_row["Date"] = pd.to_datetime(target_date_obj)

#     # ✅ Feed 3-shift labels to model
#     future_row["Shift_ID"] = display_shift

#     future_row["DayOfWeek"] = pd.to_datetime(target_date_obj).strftime("%A")
#     future_row["Weather"] = target_weather
#     future_row["IsHoliday"] = "No"
#     future_row["SpecialEvent"] = "None"

#     history_data = df.tail(60).copy()
#     predict_df = pd.concat([history_data, future_row], ignore_index=True)

#     cat_cols = ["Shift_ID", "DayOfWeek", "IsHoliday", "SpecialEvent", "Weather", "PublicTransportStatus", "OutbreakAlert"]
#     for col in cat_cols:
#         predict_df[col] = predict_df[col].astype(str)
#         if col == "SpecialEvent":
#             predict_df[col] = predict_df[col].replace({"None": "nan", "No": "nan", "Normal": "nan"})
#         elif col == "PublicTransportStatus":
#             predict_df[col] = predict_df[col].replace({"None": "Normal", "nan": "Normal"})
#         elif col == "OutbreakAlert":
#             predict_df[col] = predict_df[col].replace({"None": "No", "nan": "No"})
#         elif col == "IsHoliday":
#             predict_df[col] = predict_df[col].replace({"None": "No", "nan": "No"})
#         predict_df[col] = predict_df[col].astype("category")

#     for col in ["ETU_Admissions", "ETU_Discharges", "ETU_OccupiedBeds", "ETU_BedCapacity"]:
#         predict_df[col] = pd.to_numeric(predict_df[col], errors="coerce").fillna(0).astype(np.float32)

#     # --- MODEL 1: TFT PREDICTION (with safe fallbacks for Shift_ID categories) ---
#     try:
#         raw_preds = best_tft.predict(predict_df, mode="raw", return_x=False)
#         pred_tft = float(raw_preds.prediction[0, 0, 3].item())
#         low_ci = float(raw_preds.prediction[0, 0, 1].item())
#         high_ci = float(raw_preds.prediction[0, 0, 5].item())

#     except Exception as e1:
#         print(f"⚠️ TFT failed with Shift_ID='{display_shift}'. Trying fallback labels... Error: {e1}")

#         # fallback 1: Morning/Evening/Night without (A/B/C)
#         fallback_map = {"Morning (A)": "Morning", "Evening (B)": "Evening", "Night (C)": "Night"}
#         predict_df_fallback = predict_df.copy()
#         predict_df_fallback.loc[predict_df_fallback.index[-1], "Shift_ID"] = fallback_map.get(display_shift, "Morning")

#         try:
#             raw_preds = best_tft.predict(predict_df_fallback, mode="raw", return_x=False)
#             pred_tft = float(raw_preds.prediction[0, 0, 3].item())
#             low_ci = float(raw_preds.prediction[0, 0, 1].item())
#             high_ci = float(raw_preds.prediction[0, 0, 5].item())

#         except Exception as e2:
#             print(f"⚠️ TFT failed with fallback1 Shift_ID='{fallback_map.get(display_shift)}'. Trying Day/Night... Error: {e2}")

#             # fallback 2: Day/Night
#             daynight = "Night" if display_shift == "Night (C)" else "Day"
#             predict_df_fallback2 = predict_df.copy()
#             predict_df_fallback2.loc[predict_df_fallback2.index[-1], "Shift_ID"] = daynight

#             try:
#                 raw_preds = best_tft.predict(predict_df_fallback2, mode="raw", return_x=False)
#                 pred_tft = float(raw_preds.prediction[0, 0, 3].item())
#                 low_ci = float(raw_preds.prediction[0, 0, 1].item())
#                 high_ci = float(raw_preds.prediction[0, 0, 5].item())
#             except Exception as e3:
#                 print(f"❌ TFT Error: {e3}")
#                 return jsonify({"error": f"TFT Error: {str(e3)}"}), 500

#     # --- MODEL 2: LSTM PREDICTION ---
#     try:
#         if lstm_model is not None and lstm_scaler is not None:
#             lstm_features = ["ETU_Admissions", "ETU_Discharges", "ETU_OccupiedBeds"]
#             last_7_data = df[lstm_features].tail(7).copy()

#             scaled_input = lstm_scaler.transform(last_7_data)
#             tensor_input = torch.tensor(scaled_input, dtype=torch.float32).unsqueeze(0)

#             with torch.no_grad():
#                 scaled_pred = lstm_model(tensor_input).item()

#             dummy_array = np.zeros((1, 3))
#             dummy_array[0, 0] = scaled_pred
#             pred_lstm = float(lstm_scaler.inverse_transform(dummy_array)[0, 0])
#         else:
#             print("⚠️ LSTM Model/Scaler missing. Using TFT only.")
#             pred_lstm = pred_tft

#     except Exception as e:
#         print(f"❌ LSTM Error: {e}. Falling back to TFT only.")
#         pred_lstm = pred_tft

#     # --- ✅ ENSEMBLE AVERAGING ---
#     predicted_arrivals = int(round((pred_tft + pred_lstm) / 2))
#     print(f"🧠 AI Ensemble: TFT ({pred_tft:.1f}) + LSTM ({pred_lstm:.1f}) = Final Prediction: {predicted_arrivals}")

#     # --- OPTIMIZATION LOGIC ---
#     etu_starting_occupancy = get_previous_shift_occupancy(target_date_str, display_shift)
#     etu_capacity = bed_inventory_collection.count_documents({"ward_id": "ETU", "status": "Functional"})
#     if etu_capacity == 0:
#         etu_capacity = 25

#     free_wa, _ = get_ward_realtime_free_space("WARD-A", "OccupiedBeds")
#     free_wb, _ = get_ward_realtime_free_space("WARD-B", "OccupiedBeds")
#     free_gen, _ = get_ward_realtime_free_space("GEN", "OccupiedBeds")

#     surge_limit_a = get_surge_limit("WARD-A")
#     surge_limit_b = get_surge_limit("WARD-B")
#     surge_limit_gen = get_surge_limit("GEN")
#     surge_limit_etu = get_surge_limit("ETU")

#     print(f"🚑 Dynamic Surge Limits: A={surge_limit_a}, B={surge_limit_b}, Gen={surge_limit_gen}, ETU={surge_limit_etu}")

#     free_etu_slots = max(0, etu_capacity - etu_starting_occupancy)

#     prob = LpProblem("Hospital_Optimization", LpMinimize)

#     xKeep = LpVariable("Keep", 0, free_etu_slots, cat="Integer")
#     xA = LpVariable("WardA", 0, free_wa, cat="Integer")
#     xB = LpVariable("WardB", 0, free_wb, cat="Integer")
#     xG = LpVariable("Gen", 0, free_gen, cat="Integer")

#     xA_S = LpVariable("WardA_S", 0, surge_limit_a, cat="Integer")
#     xB_S = LpVariable("WardB_S", 0, surge_limit_b, cat="Integer")
#     xG_S = LpVariable("Gen_S", 0, surge_limit_gen, cat="Integer")
#     xKeep_S = LpVariable("ETU_S", 0, surge_limit_etu, cat="Integer")

#     xE = LpVariable("Ext", 0, None, cat="Integer")

#     prob += (xKeep + xKeep_S + xA + xB + xG + xA_S + xB_S + xG_S + xE) == predicted_arrivals
#     prob += 1 * xKeep + 2 * (xA + xB + xG) + 10 * (xKeep_S + xA_S + xB_S + xG_S) + 100 * xE
#     prob.solve()

#     val_keep = int(value(xKeep))
#     val_keep_s = int(value(xKeep_S))
#     val_a = int(value(xA))
#     val_b = int(value(xB))
#     val_g = int(value(xG))
#     val_a_s = int(value(xA_S))
#     val_b_s = int(value(xB_S))
#     val_g_s = int(value(xG_S))
#     val_ext = int(value(xE))

#     total_surge_used = val_keep_s + val_a_s + val_b_s + val_g_s

#     try:
#         prediction_record = {
#             "generated_at": datetime.now(),
#             "target_date": target_date_str,
#             "target_shift": display_shift,
#             "predicted_arrivals": predicted_arrivals,
#             "etu_capacity_used": etu_capacity,
#             "starting_occupancy": etu_starting_occupancy,
#             "optimization_plan": {
#                 "direct_admit": val_keep,
#                 "transfer_A": val_a,
#                 "transfer_B": val_b,
#                 "transfer_Gen": val_g,
#                 "surge_total": total_surge_used,
#                 "external_transfer": val_ext,
#                 "breakdown_surge": {"etu": val_keep_s, "ward_a": val_a_s, "ward_b": val_b_s, "gen": val_g_s},
#             },
#         }
#         history_collection.update_one(
#             {"target_date": target_date_str, "target_shift": display_shift},
#             {"$set": prediction_record},
#             upsert=True,
#         )
#     except Exception as e:
#         print(f"⚠️ Save Warning: {e}")

#     date_minus_3 = target_date_obj - timedelta(days=3)
#     date_minus_2 = target_date_obj - timedelta(days=2)
#     date_minus_1 = target_date_obj - timedelta(days=1)

#     graph_labels = [
#         date_minus_3.strftime("%b %d"),
#         date_minus_2.strftime("%b %d"),
#         date_minus_1.strftime("%b %d"),
#         f"{target_date_obj.strftime('%b %d')} (Pred)",
#     ]

#     recent_values = df["ETU_Admissions"].tail(3).tolist()

#     occupancy_pct = int((etu_starting_occupancy / etu_capacity) * 100) if etu_capacity > 0 else 100
#     risk = "Critical" if predicted_arrivals > 30 else ("High" if predicted_arrivals > 15 else "Normal")

#     rec_text = "Standard operation."
#     if total_surge_used > 0:
#         rec_text = "CRITICAL: Activate Corridor C Protocols immediately."
#     elif risk == "High":
#         rec_text = "High load expected. Approve overtime."
#     # include approvals summary for ETU so ETU nurse can see ward responses
#     approvals_summary = summarize_etu_approvals(target_date_str, display_shift)

#     return jsonify(
#         {
#             "current_occupancy": etu_starting_occupancy,
#             "total_capacity": etu_capacity,
#             "occupancy_percentage": occupancy_pct,
#             "predicted_arrivals": predicted_arrivals,
#             "system_status": "CRITICAL" if occupancy_pct > 90 else "NORMAL",
#             "primary_driver": "Weather-Driven Surge" if target_weather == "Rainy" else "Standard Load",
#             "timeframe_label": "Next Shift",
#             "graph_labels": graph_labels,
#             "observed_history": recent_values + [None],
#             "ai_prediction": [None] * 3 + [predicted_arrivals],
#             "capacity_line": etu_capacity,
#             "heatmap_risk_levels": ["Low", "Medium", "High", risk],
#             "confidence_score": "92%",
#             "model_used": "Ensemble (TFT + LSTM)",
#             "forecast_table_rows": [
#                 {
#                     "period": f"{target_date_obj.strftime('%b %d')} - {display_shift}",
#                     "prediction": predicted_arrivals,
#                     "min": int(low_ci),
#                     "max": int(high_ci),
#                 }
#             ],
#             "optimization_status": "MILP Solution Ready",
#             "shortage_count": max(0, predicted_arrivals - val_keep),
#             "action_plan_keep_etu": val_keep,
#             "action_plan_transfers": {"ward_a": val_a, "ward_b": val_b, "general": val_g},
#             "action_plan_surge": total_surge_used,
#             "action_plan_surge_breakdown": {"etu": val_keep_s, "ward_a": val_a_s, "ward_b": val_b_s, "general": val_g_s},
#             "action_plan_external": val_ext,
#             "recommendation_text": rec_text,
#             "ward_approvals": approvals_summary,
#             "target_date": target_date_str,
#             "target_shift": display_shift,
#         }
#     )

# @app.route("/api/optimization", methods=["GET"])
# def optimization_alias():
#     return predict()

# if __name__ == "__main__":
#     print(f"🚀 Backend Loading from: {BASE_DIR}")
#     print("🚀 Server starting on Port 5001...")
#     app.run(debug=True, port=5001, host="0.0.0.0")











from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
import os
import certifi
from datetime import datetime, timedelta
# Optional heavy ML / optimization libraries - import defensively so missing
# packages don't prevent the Flask app from starting for development.
try:
    from pytorch_forecasting import TemporalFusionTransformer
except Exception as _e:
    TemporalFusionTransformer = None
    print(f"⚠️ Optional import missing: pytorch_forecasting ({_e})")

try:
    from pulp import LpProblem, LpMinimize, LpVariable, value, LpStatus
except Exception as _e:
    LpProblem = LpMinimize = LpVariable = value = LpStatus = None
    print(f"⚠️ Optional import missing: pulp ({_e})")

try:
    import torch
    import torch.nn as nn
except Exception as _e:
    torch = None
    nn = None
    print(f"⚠️ Optional import missing: torch ({_e})")

try:
    import joblib
except Exception as _e:
    joblib = None
    print(f"⚠️ Optional import missing: joblib ({_e})")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ==========================================
# 1) DB CONNECTION
# ==========================================
MONGO_URI = "mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/test?appName=ITPM"

print("⏳ Connecting to MongoDB...")
try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client["Research"]
    collection = db["BedDailyinputs"]
    history_collection = db["BedPredictionHistory"]
    bed_inventory_collection = db["BedInventory"]
    surge_collection = db["BedSurgeArea"]
    etu_transfer_collection = db["Bed_TransferCount"]

    client.admin.command("ping")
    print("✅ Connected to Cloud Database!")
except Exception as e:
    print(f"❌ Database Error: {e}")

# Register previously-defined route functions now that `app` is available.
# These functions are declared earlier in the file but their decorators were
# commented out to avoid NameError at import time. Bind them to the Flask
# app here so the routes are active.
try:
    app.add_url_rule('/api/get-beds', 'get_beds', get_beds, methods=['GET'])
    app.add_url_rule('/api/ward-status/<ward_id>', 'get_ward_status_api', get_ward_status_api, methods=['GET'])
    app.add_url_rule('/api/transfer-count', 'get_transfer_count', get_transfer_count, methods=['GET'])
    app.add_url_rule('/api/get-trend-data', 'get_trend_data', get_trend_data, methods=['GET'])
    # bind the record and history endpoints too
    app.add_url_rule('/api/add-record', 'add_record', add_record, methods=['POST'])
    app.add_url_rule('/api/get-history', 'get_history', get_history, methods=['GET'])
except Exception as _e:
    # If binding fails, log it but continue; Flask app will raise on route collisions
    print(f"⚠️ Could not bind early routes: {_e}")

# ==========================================
# 2) LOAD MODELS
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_ROOT = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

def find_model_file(filename):
    candidates = [
        os.path.join(BASE_DIR, filename),
        os.path.join(AI_ROOT, filename),
        os.path.join(AI_ROOT, "Save_file", filename),
        os.path.join(AI_ROOT, "Save_file", "Bed", filename),
        os.path.join(AI_ROOT, "Bed", filename),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    find_model_file._last_tried = candidates
    return None

# TFT
tft_filename = "hospital_etu_tft_model_80split.ckpt"
tft_path = find_model_file(tft_filename)
best_tft = None

if tft_path and TemporalFusionTransformer is not None:
    print(f"⏳ Loading TFT AI Model from: {tft_path} (This may take a few seconds)")
    try:
        best_tft = TemporalFusionTransformer.load_from_checkpoint(tft_path, map_location="cpu")
        print("✅ TFT Engine Loaded Successfully!")
    except Exception as e:
        print(f"❌ TFT load error: {e}")
elif tft_path and TemporalFusionTransformer is None:
    print("⚠️ TFT model file found but `pytorch_forecasting` is not installed; skipping load.")
    best_tft = None
else:
    tried = getattr(find_model_file, "_last_tried", [])
    print(f"\n⚠️ CRITICAL ERROR: TFT MODEL FILE MISSING! searched: {tried}")

# LSTM (define and load only if torch/nn are available)
lstm_filename = "hospital_lstm_model.pt"
scaler_filename = "lstm_scaler.pkl"

lstm_path = find_model_file(lstm_filename)
scaler_path = find_model_file(scaler_filename)

lstm_model = None
lstm_scaler = None

if torch is not None and nn is not None:
    class HospitalLSTM(nn.Module):
        def __init__(self, input_size, hidden_size=32, num_layers=2):
            super().__init__()
            self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
            self.fc = nn.Linear(hidden_size, 1)

        def forward(self, x):
            out, _ = self.lstm(x)
            return self.fc(out[:, -1, :])

    if lstm_path and scaler_path and joblib is not None:
        print(f"⏳ Loading LSTM AI Model & Scaler from: {lstm_path}, {scaler_path}...")
        try:
            lstm_model = HospitalLSTM(input_size=3)
            state = torch.load(lstm_path, map_location=torch.device("cpu"))
            if isinstance(state, dict):
                lstm_model.load_state_dict(state)
            else:
                lstm_model = state
            lstm_model.eval()
            lstm_scaler = joblib.load(scaler_path)
            print("✅ LSTM Engine & Scaler Loaded Successfully!")
        except Exception as e:
            print(f"❌ LSTM load error: {e}")
    else:
        tried = getattr(find_model_file, "_last_tried", [])
        print(f"\n⚠️ LSTM model or scaler not loaded (torch/joblib missing or files not found). Searched: {tried}")
else:
    print("⚠️ Skipping LSTM definition — torch or nn not available in environment.")

# ==========================================
# 3) SAFE CATEGORY UTILITIES (fix unknown-category errors)
# ==========================================
def get_encoder_classes(model, varname):
    """
    Try to read known classes for a categorical variable from TFT checkpoint.
    Different versions store it differently, so we try multiple paths.
    """
    try:
        dp = getattr(model, "dataset_parameters", None)
        if dp and "categorical_encoders" in dp and varname in dp["categorical_encoders"]:
            enc = dp["categorical_encoders"][varname]
            if hasattr(enc, "classes_"):
                return list(enc.classes_)
    except:
        pass
    return None

def force_known_category(model, df, varname, fallback_value="nan"):
    """
    Ensure df[varname] exists and only contains values known to the model encoder.
    If not known, map to the first known class or fallback_value.
    """
    if varname not in df.columns:
        df[varname] = fallback_value

    df[varname] = df[varname].astype(str).fillna(fallback_value)

    classes = get_encoder_classes(model, varname)
    if classes and len(classes) > 0:
        known = set([str(x) for x in classes])
        # pick a safe default = first class
        safe_default = str(classes[0])
        df.loc[~df[varname].isin(known), varname] = safe_default
    else:
        # no classes found, just ensure string
        df[varname] = df[varname].astype(str)

    return df

def ensure_int_time_idx(df):
    df["time_idx"] = pd.to_numeric(df["time_idx"], errors="coerce").fillna(0).astype(int)
    return df

# ==========================================
# 4) HELPERS (DB)
# ==========================================
def get_surge_limit(ward_id):
    try:
        if ward_id:
            wid = str(ward_id).strip().upper()
            variants = [wid, wid.replace('_', '-'), wid.replace('-', '_')]
            latest = surge_collection.find_one({"Ward_ID": {"$in": variants}}, sort=[("Timestamp", -1)])
        else:
            latest = surge_collection.find_one(sort=[("Timestamp", -1)])

        if latest:
            return int(latest.get("Surge_Capacity_Available", 0))
        return 0
    except Exception as e:
        print(f"⚠️ Error fetching surge limit for {ward_id}: {e}")
        return 0

def get_ward_realtime_free_space(ward_id, occupancy_key="OccupiedBeds"):
    try:
        capacity = bed_inventory_collection.count_documents({"ward_id": ward_id, "status": "Functional"})
        latest_record = collection.find_one({"Ward_ID": ward_id}, sort=[("Date", -1), ("_id", -1)])
        occupancy = int(latest_record.get(occupancy_key, 0)) if latest_record else 0
        free_space = max(0, capacity - occupancy)
        return free_space, capacity
    except Exception as e:
        print(f"⚠️ Error checking {ward_id}: {e}")
        return 0, 0

def fetch_etu_history():
    """
    Must output the columns that TFT expects, including:
    Date, Shift_ID, DayOfWeek, IsHoliday, SpecialEvent, Weather, PublicTransportStatus, OutbreakAlert,
    ETU_Admissions, ETU_Discharges, ETU_OccupiedBeds, ETU_BedCapacity, Gender, group, time_idx
    """
    try:
        query = {"$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}]}
        cursor = collection.find(query).sort([("Date", 1), ("Shift_ID", 1)])
        df = pd.DataFrame(list(cursor))

        if df.empty:
            return None

        if "_id" in df.columns:
            df.drop("_id", axis=1, inplace=True)

        # Filter to ETU only
        if "Ward_ID" in df.columns:
            df = df[df["Ward_ID"].isna() | (df["Ward_ID"] == "ETU")]

        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        df = df.dropna(subset=["Date"]).copy()

        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        df = df[df["Date"] <= today].copy()

        df = df.sort_values(["Date", "Shift_ID"]).reset_index(drop=True)
        df["time_idx"] = np.arange(len(df), dtype=int)  # ✅ INT
        df["group"] = "ETU_Main"  # will be forced to match model

        # numeric
        for col in ["ETU_Admissions", "ETU_Discharges", "ETU_OccupiedBeds", "ETU_BedCapacity"]:
            if col not in df.columns:
                df[col] = 0
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(np.float32)

        # REQUIRED categoricals (if missing in DB, fill safe)
        for col, default in {
            "Shift_ID": "Morning (A)",
            "DayOfWeek": "Monday",
            "IsHoliday": "No",
            "SpecialEvent": "nan",
            "Weather": "Sunny",
            "PublicTransportStatus": "Normal",
            "OutbreakAlert": "No",
        }.items():
            if col not in df.columns:
                df[col] = default
            df[col] = df[col].astype(str).fillna(default)

        # ✅ Gender MUST exist for your new model
        if "Gender" not in df.columns:
            df["Gender"] = "Male"
        df["Gender"] = df["Gender"].astype(str).fillna("Male")
        df.loc[~df["Gender"].isin(["Male", "Female"]), "Gender"] = "Male"

        return df
    except Exception as e:
        print(f"Database Fetch Error: {e}")
        return None

def get_previous_shift_occupancy(target_date_str, target_shift):
    try:
        target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()

        if target_shift == "Morning (A)":
            prior_date = (target_date - timedelta(days=1)).strftime("%Y-%m-%d")
            prior_shift = "Night (C)"
        elif target_shift == "Evening (B)":
            prior_date = target_date.strftime("%Y-%m-%d")
            prior_shift = "Morning (A)"
        else:
            prior_date = target_date.strftime("%Y-%m-%d")
            prior_shift = "Evening (B)"

        query = {
            "$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}],
            "Date": prior_date,
            "Shift_ID": prior_shift,
        }
        record = collection.find_one(query)

        if record:
            return int(record.get("ETU_OccupiedBeds", 0))
        else:
            fallback_query = {"$or": [{"Ward_ID": "ETU"}, {"Ward_ID": {"$exists": False}}]}
            latest = collection.find_one(fallback_query, sort=[("Date", -1), ("_id", -1)])
            return int(latest.get("ETU_OccupiedBeds", 0)) if latest else 0

    except Exception as e:
        print(f"⚠️ Error finding prior occupancy: {e}")
        return 0

# ==========================================
# 5) ROUTES
# ==========================================
@app.route("/", methods=["GET"])
def home():
    return "<h1>✅ Server is Running!</h1>", 200

@app.route("/predict", methods=["GET"])
def predict():
    if best_tft is None:
        return jsonify({"error": "TFT AI Model not loaded."}), 500

    df = fetch_etu_history()
    if df is None or len(df) < 50:
        return jsonify({"error": f"Insufficient ETU history ({len(df) if df is not None else 0} records)."}), 500

    # ------------- decide next shift -------------
    current_dt = datetime.now()
    current_hour = current_dt.hour

    if 7 <= current_hour < 13:
        target_date_obj = current_dt.date()
        display_shift = "Evening (B)"
        target_weather = "Sunny"
    elif 13 <= current_hour < 19:
        target_date_obj = current_dt.date()
        display_shift = "Night (C)"
        target_weather = "Rainy"
    elif 19 <= current_hour <= 23:
        target_date_obj = current_dt.date() + timedelta(days=1)
        display_shift = "Morning (A)"
        target_weather = "Sunny"
    else:
        target_date_obj = current_dt.date()
        display_shift = "Morning (A)"
        target_weather = "Sunny"

    target_date_str = target_date_obj.strftime("%Y-%m-%d")
    print(f"\n🕒 Predicting for: {target_date_str} Shift: {display_shift}")

    # ==========================================================
    # A) TFT prediction per gender (Male + Female)
    # ==========================================================
    def tft_predict_for_gender(gender_value: str):
        # prepare last 60 history (force gender for ALL rows)
        history_data = df.tail(60).copy()
        history_data["Gender"] = gender_value

        # future row
        future_row = df.tail(1).copy()
        future_row["time_idx"] = int(df["time_idx"].max() + 1)  # ✅ INT
        future_row["Date"] = pd.to_datetime(target_date_obj)

        future_row["Shift_ID"] = display_shift
        future_row["DayOfWeek"] = pd.to_datetime(target_date_obj).strftime("%A")
        future_row["Weather"] = target_weather
        future_row["IsHoliday"] = "No"
        future_row["SpecialEvent"] = "nan"
        future_row["PublicTransportStatus"] = "Normal"
        future_row["OutbreakAlert"] = "No"
        future_row["Gender"] = gender_value
        future_row["group"] = "ETU_Main"

        predict_df = pd.concat([history_data, future_row], ignore_index=True)

        # ensure int time_idx
        predict_df = ensure_int_time_idx(predict_df)

        # numeric enforce
        for col in ["ETU_Admissions", "ETU_Discharges", "ETU_OccupiedBeds", "ETU_BedCapacity"]:
            predict_df[col] = pd.to_numeric(predict_df[col], errors="coerce").fillna(0).astype(np.float32)

        # enforce all categoricals exist & known to model
        cat_cols = ["Shift_ID", "DayOfWeek", "IsHoliday", "SpecialEvent",
                    "Weather", "PublicTransportStatus", "OutbreakAlert", "Gender", "group"]

        for c in cat_cols:
            predict_df = force_known_category(best_tft, predict_df, c, fallback_value="nan")

        # now predict
        raw_preds = best_tft.predict(predict_df, mode="raw", return_x=False)
        pred = float(raw_preds.prediction[0, 0, 3].item())
        low_ci = float(raw_preds.prediction[0, 0, 1].item())
        high_ci = float(raw_preds.prediction[0, 0, 5].item())
        return pred, low_ci, high_ci

    try:
        pred_m_tft, low_m, high_m = tft_predict_for_gender("Male")
        pred_f_tft, low_f, high_f = tft_predict_for_gender("Female")
        pred_tft_total = pred_m_tft + pred_f_tft
        low_ci_total = low_m + low_f
        high_ci_total = high_m + high_f
    except Exception as e:
        print(f"❌ TFT Error: {e}")
        return jsonify({"error": f"TFT Error: {str(e)}"}), 500

    # ==========================================================
    # B) LSTM total prediction (no gender feature)
    # ==========================================================
    try:
        if lstm_model is not None and lstm_scaler is not None:
            lstm_features = ["ETU_Admissions", "ETU_Discharges", "ETU_OccupiedBeds"]
            last_7_data = df[lstm_features].tail(7).copy()
            scaled_input = lstm_scaler.transform(last_7_data)
            tensor_input = torch.tensor(scaled_input, dtype=torch.float32).unsqueeze(0)

            with torch.no_grad():
                scaled_pred = lstm_model(tensor_input).item()

            dummy = np.zeros((1, 3))
            dummy[0, 0] = scaled_pred
            pred_lstm_total = float(lstm_scaler.inverse_transform(dummy)[0, 0])
        else:
            pred_lstm_total = pred_tft_total
    except Exception as e:
        print(f"❌ LSTM Error: {e}. Using TFT only.")
        pred_lstm_total = pred_tft_total

    # ==========================================================
    # C) ENSEMBLE total + distribute to genders using TFT ratio
    # ==========================================================
    ensemble_total = max(0.0, (pred_tft_total + pred_lstm_total) / 2.0)

    # split ratio based on TFT gender split
    if pred_tft_total > 0:
        male_ratio = pred_m_tft / pred_tft_total
    else:
        male_ratio = 0.5

    pred_male = int(round(ensemble_total * male_ratio))
    pred_female = int(round(ensemble_total - pred_male))
    predicted_arrivals = pred_male + pred_female

    print(f"🧠 Ensemble Total: {ensemble_total:.1f} => Male {pred_male}, Female {pred_female}")

    # ==========================================================
    # D) OPTIMIZATION (Gender locked wards)
    # Ward IDs: WARD-A = Male ward, WARD-B = Female ward
    # No GEN
    # ==========================================================
    etu_starting_occupancy = get_previous_shift_occupancy(target_date_str, display_shift)
    etu_capacity = bed_inventory_collection.count_documents({"ward_id": "ETU", "status": "Functional"})
    if etu_capacity == 0:
        etu_capacity = 25

    free_etu_slots = max(0, etu_capacity - etu_starting_occupancy)

    # Male ward (WARD-A)
    free_male, _ = get_ward_realtime_free_space("WARD-A", "OccupiedBeds")
    surge_male = get_surge_limit("WARD-A")

    # Female ward (WARD-B)
    free_female, _ = get_ward_realtime_free_space("WARD-B", "OccupiedBeds")
    surge_female = get_surge_limit("WARD-B")

    # ETU does not have surge beds; only ward-level surge is available
    print(f"🚑 Free slots: ETU={free_etu_slots}, MaleWard={free_male}, FemaleWard={free_female}")
    print(f"🚑 Surge limits: MaleWard={surge_male}, FemaleWard={surge_female}")

    # MILP
    prob = LpProblem("Hospital_Optimization_Gender", LpMinimize)

    # ETU shared keep slots split
    xKeepM = LpVariable("KeepMale_ETU", 0, free_etu_slots, cat="Integer")
    xKeepF = LpVariable("KeepFemale_ETU", 0, free_etu_slots, cat="Integer")

    # Male ward + male surge
    xM = LpVariable("MaleWard", 0, free_male, cat="Integer")
    xM_S = LpVariable("MaleWard_Surge", 0, surge_male, cat="Integer")

    # Female ward + female surge
    xF = LpVariable("FemaleWard", 0, free_female, cat="Integer")
    xF_S = LpVariable("FemaleWard_Surge", 0, surge_female, cat="Integer")

    # external transfers
    xExtM = LpVariable("ExternalMale", 0, None, cat="Integer")
    xExtF = LpVariable("ExternalFemale", 0, None, cat="Integer")

    # constraints
    # enforce gender-specific patient flow (male→male ward, female→female ward)
    prob += xKeepM + xM + xM_S + xExtM == pred_male
    prob += xKeepF + xF + xF_S + xExtF == pred_female

    # ETU keep capacity shared
    prob += xKeepM + xKeepF <= free_etu_slots

    # objective costs (same idea as before)
    # cost penalizes surge usage (ward surge) and external transfers
    prob += (
        1 * (xKeepM + xKeepF) +
        2 * (xM + xF) +
        10 * (xM_S + xF_S) +
        100 * (xExtM + xExtF)
    )

    prob.solve()
    status = LpStatus.get(prob.status, "Unknown")

    val = lambda v: int(value(v)) if value(v) is not None else 0

    plan = {
        "male": {
            "etu_keep": val(xKeepM),
            "etu_surge": 0,  # ETU has no surge beds
            "male_ward": val(xM),
            "male_ward_surge": val(xM_S),
            "external": val(xExtM),
        },
        "female": {
            "etu_keep": val(xKeepF),
            "etu_surge": 0,  # ETU has no surge beds
            "female_ward": val(xF),
            "female_ward_surge": val(xF_S),
            "external": val(xExtF),
        },
        "solver_status": status,
    }

    # ==========================================================
    # E) SAVE prediction
    # ==========================================================
    try:
        prediction_record = {
            "generated_at": datetime.now(),
            "target_date": target_date_str,
            "target_shift": display_shift,
            "predicted_arrivals_total": predicted_arrivals,
            "predicted_arrivals_male": pred_male,
            "predicted_arrivals_female": pred_female,
            "etu_capacity_used": etu_capacity,
            "starting_occupancy": etu_starting_occupancy,
            "optimization_plan_gender": plan,
        }
        history_collection.update_one(
            {"target_date": target_date_str, "target_shift": display_shift},
            {"$set": prediction_record},
            upsert=True,
        )
    except Exception as e:
        print(f"⚠️ Save Warning: {e}")

    # ==========================================================
    # F) RESPONSE
    # ==========================================================
    occupancy_pct = int((etu_starting_occupancy / etu_capacity) * 100) if etu_capacity > 0 else 100
    risk = "Critical" if predicted_arrivals > 30 else ("High" if predicted_arrivals > 15 else "Normal")

    rec_text = "Standard operation."
    # only ward-level surge triggers corridor activation
    if (plan["male"]["male_ward_surge"] + plan["female"]["female_ward_surge"]) > 0:
        rec_text = "CRITICAL: Surge beds activated."
    elif risk == "High":
        rec_text = "High load expected. Approve overtime."

    # Backwards-compatible fields so older frontends still work
    action_plan_transfers = {
        "ward_a": plan.get("male", {}).get("male_ward", 0),
        "ward_b": plan.get("female", {}).get("female_ward", 0),
        "general": 0,
    }

    # Surge beds are only allocated to gender-specific wards (WARD-A, WARD-B).
    # ETU does not get dedicated surge beds; ensure ETU surge is not counted here.
    action_plan_surge_breakdown = {
        "ward_a": int(plan.get("male", {}).get("male_ward_surge", 0)),
        "ward_b": int(plan.get("female", {}).get("female_ward_surge", 0)),
        "general": 0,
    }

    # total surge only counts ward-level surge (no ETU surge)
    action_plan_surge = int(action_plan_surge_breakdown["ward_a"] + action_plan_surge_breakdown["ward_b"])

    action_plan_external = int(plan.get("male", {}).get("external", 0) + plan.get("female", {}).get("external", 0))

    action_plan_keep_etu = int(plan.get("male", {}).get("etu_keep", 0) + plan.get("female", {}).get("etu_keep", 0))

    return jsonify({
        "current_occupancy": etu_starting_occupancy,
        "total_capacity": etu_capacity,
        "occupancy_percentage": occupancy_pct,

        "predicted_arrivals": predicted_arrivals,
        "predicted_arrivals_male": pred_male,
        "predicted_arrivals_female": pred_female,

        "system_status": "CRITICAL" if occupancy_pct > 90 else "NORMAL",
        "primary_driver": "Weather-Driven Surge" if target_weather == "Rainy" else "Standard Load",
        "timeframe_label": "Next Shift",

        "confidence_score": "92%",
        "model_used": "Ensemble (TFT gender-split + LSTM total)",

        "forecast_table_rows": [{
            "period": f"{target_date_obj.strftime('%b %d')} - {display_shift}",
            "prediction_total": predicted_arrivals,
            "prediction_male": pred_male,
            "prediction_female": pred_female,
            "min_total": int(low_ci_total),
            "max_total": int(high_ci_total),
        }],

        "optimization_status": f"MILP {status}",
        "optimization_plan_gender": plan,

        # compatibility mappings to previous flat keys
        "action_plan_transfers": action_plan_transfers,
        "action_plan_surge": action_plan_surge,
        "action_plan_surge_breakdown": action_plan_surge_breakdown,
        "action_plan_external": action_plan_external,
        "action_plan_keep_etu": action_plan_keep_etu,

        "recommendation_text": rec_text,
        "target_date": target_date_str,
        "target_shift": display_shift,
    }), 200

@app.route("/api/optimization", methods=["GET"])
def optimization_alias():
    return predict()


@app.route('/api/etu/approve', methods=['POST'])
def etu_approve():
    try:
        data = request.get_json(force=True) or {}
        required = ['ward_id', 'target_date', 'target_shift', 'approved']
        for r in required:
            if r not in data:
                return jsonify({'error': f'Missing field: {r}'}), 400

        transfer_record = {
            'ward_id': data.get('ward_id'),
            'target_date': data.get('target_date'),
            'target_shift': data.get('target_shift'),
            'approved': bool(data.get('approved', False)),
            'suggested_number': int(data.get('suggested_number')) if data.get('suggested_number') is not None else None,
            'reason': data.get('reason'),
            'nurse_id': data.get('nurse_id'),
            'submitted_at': datetime.now(),
        }

        # attach prediction snapshot if available
        try:
            hist = history_collection.find_one({'target_date': data.get('target_date'), 'target_shift': data.get('target_shift')})
            if hist:
                transfer_record['predicted_arrivals'] = int(hist.get('predicted_arrivals') or hist.get('predicted_arrivals_total') or 0)
                transfer_record['optimization_plan'] = hist.get('optimization_plan') or hist.get('optimization_plan_gender') or None
        except Exception:
            pass

        etu_transfer_collection.insert_one(transfer_record)
        return jsonify({'message': 'Approval saved'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/etu/approvals', methods=['GET'])
def etu_approvals_get():
    try:
        target_date = request.args.get('target_date')
        target_shift = request.args.get('target_shift')
        if not target_date or not target_shift:
            return jsonify({'error': 'target_date and target_shift required'}), 400

        query = {'target_date': target_date, 'target_shift': target_shift}
        cursor = etu_transfer_collection.find(query, {'_id': 0}).sort([('submitted_at', -1)])
        docs = list(cursor)

        latest_by_ward = {}
        # Accept both dash and underscore variations to match frontend and backend IDs
        wards_of_interest = ['WARD-A', 'WARD-B', 'WARD_A', 'WARD_B']
        for d in docs:
            wid_raw = (d.get('ward_id') or d.get('ward') or '')
            wid = str(wid_raw).strip().upper()
            if not wid:
                continue
            if wid not in latest_by_ward and wid in wards_of_interest:
                latest_by_ward[wid] = d

        per_ward = {}
        for w in wards_of_interest:
            if w in latest_by_ward:
                d = latest_by_ward[w]
                suggested_val = d.get('suggested_number')
                try:
                    suggested_num = int(suggested_val) if suggested_val is not None else None
                except Exception:
                    suggested_num = None
                approved_flag = bool(d.get('approved', False))
                if suggested_num == 0:
                    approved_flag = False
                per_ward[w] = {
                    'exists': True,
                    'approved': approved_flag,
                    'suggested_number': suggested_num,
                    'reason': d.get('reason'),
                    'nurse_id': d.get('nurse_id'),
                    'updated_at': d.get('submitted_at') or d.get('updated_at')
                }
            else:
                per_ward[w] = {'exists': False, 'approved': False, 'suggested_number': None, 'reason': None, 'nurse_id': None, 'updated_at': None}

        all_approved = all(per_ward[w]['exists'] and per_ward[w]['approved'] for w in wards_of_interest)
        suggested_total = sum((per_ward[w].get('suggested_number') or 0) for w in wards_of_interest)

        return jsonify({'per_ward': per_ward, 'all_approved': all_approved, 'suggested_total': suggested_total, 'raw': docs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/add-bed', methods=['POST'])
def add_bed():
    try:
        data = request.get_json(force=True) or {}
        bed_id = data.get('bed_id')
        ward_id = data.get('ward_id')
        if not bed_id or not ward_id:
            return jsonify({'error': 'Bed ID and Ward required'}), 400

        if bed_inventory_collection.find_one({'bed_id': bed_id}):
            return jsonify({'error': f"Bed ID '{bed_id}' exists!"}), 409

        bed_record = {
            'bed_id': bed_id,
            'bed_type': data.get('bed_type'),
            'ward_id': ward_id,
            'ward_name': data.get('ward_name'),
            'status': 'Functional',
            'added_at': datetime.now(),
        }
        bed_inventory_collection.insert_one(bed_record)
        return jsonify({'message': 'Bed added!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/update-bed-status', methods=['PUT'])
def update_bed_status():
    try:
        data = request.get_json(force=True) or {}
        bed_id = data.get('bed_id')
        status = data.get('status')
        if not bed_id or status is None:
            return jsonify({'error': 'bed_id and status required'}), 400

        result = bed_inventory_collection.update_one(
            {'bed_id': bed_id},
            {'$set': {'status': status, 'updated_at': datetime.now()}}
        )
        if result.matched_count == 0:
            return jsonify({'error': 'Bed not found'}), 404
        return jsonify({'message': 'Updated!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    print(f"🚀 Backend Loading from: {BASE_DIR}")
    print("🚀 Server starting on Port 5001...")
    app.run(debug=True, port=5001, host="0.0.0.0")