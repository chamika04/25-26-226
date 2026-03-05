"""
Application bootstrapper for the AI service.

This loader tries to use the Bed module's Flask `app` if available; otherwise
it registers the Bed blueprint or provides lightweight fallback routes so the
frontend doesn't get raw 404 HTML pages. Illness blueprint is loaded when
present. CORS is applied to allow local frontend development.
"""

import os
import importlib.util
from flask import Flask
from flask_cors import CORS

# base folder for ai_service
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# primary Flask app (may be replaced by Bed module if it exports its own)
app = Flask(__name__)
# allow cross-origin requests for local development
CORS(app, resources={r"/*": {"origins": "*"}})

def load_module_logic(folder_name, file_name, blueprint_name):
    """Helper function to safely load blueprints dynamically."""
    file_path = os.path.join(BASE_DIR, folder_name, file_name)
    if os.path.exists(file_path):
        try:
            spec = importlib.util.spec_from_file_location(blueprint_name, file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # Check if the module has the Blueprint
            if hasattr(module, blueprint_name):
                blueprint = getattr(module, blueprint_name)
                app.register_blueprint(blueprint)
                print(f"{folder_name.capitalize()} module loaded successfully.")
                return True
            else:
                print(f"{folder_name} file found, but '{blueprint_name}' is missing.")
        except Exception as e:
            print(f"Error loading {folder_name}: {str(e)}")
    else:
        print(f"{folder_name} module not found at: {file_path}")
    return False

# --- LOAD MODULE 1: BED MANAGEMENT ---
# Try to import a full app from Bed/bed_logic if it exports `app`. This allows the
# Bed module to run as the Flask app (with its own routes like `/predict`). If not
# present, fall back to loading a `bed_bp` blueprint.
try:
    spec_path = os.path.join(BASE_DIR, 'Bed', 'bed_logic.py')
    if os.path.exists(spec_path):
        spec = importlib.util.spec_from_file_location('bed_logic', spec_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        if hasattr(mod, 'app'):
            app = getattr(mod, 'app')
            # If the bed module created its own app, ensure CORS is applied
            try:
                CORS(app, resources={r"/*": {"origins": "*"}})
            except Exception:
                pass
            print('Bed module provided a Flask app; using it.')
        else:
            # no app exported; attempt to register a blueprint if present
            load_module_logic('Bed', 'bed_logic.py', 'bed_bp')
    else:
        load_module_logic('Bed', 'bed_logic.py', 'bed_bp')
except Exception as e:
    print(f'Error loading Bed module: {e}')

# If bed module was loaded as `mod`, try to attach its route functions to the
# running `app` when those routes are missing. This ensures `/predict` exists
# even if the Bed module defined routes on its own Flask app instance.
try:
    # list current routes
    existing = set(rule.rule for rule in app.url_map.iter_rules())
    print('Registered routes after module load:')
    for r in sorted(existing):
        print('  ', r)

    # Only attempt when bed_logic module was loaded above
    if 'mod' in locals():
        wanted = [('/predict', 'predict'), ('/api/get-beds', 'get_beds'), ('/api/ward-status/<ward_id>', 'get_ward_status_api'), ('/api/get-trend-data', 'get_trend_data'), ('/api/etu/approvals', 'get_etu_approvals'), ('/api/etu/approve', 'etu_approve'), ('/api/add-record', 'add_record'), ('/api/get-history', 'get_history'), ('/api/transfer-count', 'get_transfer_count')]
        for path, name in wanted:
            if path not in existing and hasattr(mod, name):
                try:
                    func = getattr(mod, name)
                    # guess methods: GET for most, POST for approve/add
                    methods = ['GET']
                    if name in ('etu_approve', 'add_record'):
                        methods = ['POST']
                    app.add_url_rule(path, name, func, methods=methods)
                    print(f"Bound missing route {path} -> {name}")
                except Exception as e:
                    print(f"Failed to bind {path}: {e}")
except Exception as e:
    print(f'Error during route reconciliation: {e}')


# Ensure a predict route exists on the active `app` instance. If the Bed module
# defines `predict` as a function we can call it directly; otherwise return a
# helpful JSON so frontends don't see a raw 404 page.
try:
    if '/predict' not in set(rule.rule for rule in app.url_map.iter_rules()):
        from flask import jsonify

        def _predict_proxy():
            # If the bed module was loaded and exposes a predict() function, call it.
            if 'mod' in locals() and hasattr(mod, 'predict'):
                try:
                    return getattr(mod, 'predict')()
                except Exception as e:
                    return jsonify({'error': 'Bed predict() raised exception', 'detail': str(e)}), 500
            # otherwise provide a friendly JSON response
            return jsonify({'error': 'Predict endpoint not available', 'hint': 'Bed module not loaded or predict() missing'}), 404

        app.add_url_rule('/predict', 'predict_proxy', _predict_proxy, methods=['GET'])
        print('Added fallback /predict proxy on main app')
except Exception as e:
    print(f'Could not ensure /predict exists: {e}')

# --- LOAD MODULE 2: ILLNESS PREDICTION ---
# Looks for 'illness_bp' inside 'illness/illness_logic.py'
load_module_logic('illness', 'illness_logic.py', 'illness_bp')

# --- ROOT ROUTE (For Health Check) ---
@app.route('/')
def index():
    return {
        "status": "online",
        "message": "Hospital AI System Backend is Running",
        "modules": ["Bed Management", "Illness Prediction"]
    }

# --- SERVER START ---
if __name__ == '__main__':
    print("\n" + "="*60)
    print("INITIALIZING HOSPITAL AI SYSTEM (Beds + Illness)")
    print(f"Base Directory: {BASE_DIR}")
    print("Server running on: http://127.0.0.1:5001")
    print("="*60 + "\n")
    
    # use_reloader=False is CRITICAL for heavy AI models to prevent memory errors
    app.run(debug=True, use_reloader=False, port=5001, host='0.0.0.0')