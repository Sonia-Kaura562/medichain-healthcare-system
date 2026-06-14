from flask import Flask
from flask_cors import CORS
from routes.blockchain_routes import blockchain_bp
from routes.record_routes import record_bp
from routes.auth_routes import auth_bp
from routes.patient_routes import patient_bp
from routes.doctor_routes import doctor_bp

app = Flask(__name__)
CORS(app)
# =========================================
# REGISTER ROUTES
# =========================================
app.register_blueprint(record_bp)

app.register_blueprint(auth_bp)

app.register_blueprint(patient_bp)

app.register_blueprint(doctor_bp)

app.register_blueprint(blockchain_bp)

# =========================================
# START SERVER
# =========================================
if __name__ == '__main__':

    app.run(
        host="0.0.0.0",
        debug=True,
        port=5000
    )