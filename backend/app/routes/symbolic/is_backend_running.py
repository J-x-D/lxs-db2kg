from flask import Blueprint, Flask, jsonify

app = Flask(__name__)
is_backend_running_blueprint = Blueprint("is_backend_running", __name__)


@is_backend_running_blueprint.route("/is_backend_running", methods=["GET"])
def is_backend_running():
    return jsonify({"status": "running"})


if __name__ == "__main__":
    app.run(debug=True)
