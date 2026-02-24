from flask import Flask
from flask_cors import CORS

# Import the blueprints from your component files
# (You will define these in the component files first)
from components.bed_logic import bed_blueprint
from components.noshow_logic import noshow_blueprint
from components.illness_logic import illness_blueprint
from components.medicine_logic import medicine_blueprint

app = Flask(__name__)
CORS(app)

# Registering all 4 components under one "roof"
app.register_blueprint(bed_blueprint, url_prefix='/api/beds')
app.register_blueprint(noshow_blueprint, url_prefix='/api/no-show')
app.register_blueprint(illness_blueprint, url_prefix='/api/illness')
app.register_blueprint(medicine_blueprint, url_prefix='/api/medicine')

if __name__ == "__main__":
    # This runs the whole project on one port
    app.run(host='0.0.0.0', port=5000, debug=True)