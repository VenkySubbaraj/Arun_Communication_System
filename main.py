from flask import Flask, request, redirect, url_for, render_template, jsonify
from twilio.rest import Client
from werkzeug.datastructures import ImmutableMultiDict

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")  # Render the form

@app.route("/", methods=["POST"])  # Keep handling form submission at "/"
def submit_form():
    try:
        data = request.get_json()  # Read JSON data from the request
        name = data.get("name", "")
        phone = data.get("phone", "")
        address = data.get("address", "")  # Ensure lowercase "address"
        inquiry = data.get("inquiry", "")
        message_content = data.get("message", "")

        # Format the message
        message = f"""
        New Inquiry Received:
        Name: {name}
        Phone: {phone}
        Address: {address}
        Inquiry Type: {inquiry}
        Message: {message_content}
        """

        # Send SMS via Twilio
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        client.messages.create(
            body=message.strip(),
            from_=TWILIO_PHONE,
            to=OWNER_NUMBER  # Send to owner number
        )

        return jsonify({"status": "success", "message": "Form submitted successfully!"})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Submission failed!"}), 500  # Return HTTP 500 on failure

if __name__ == "__main__":
    app.run(debug=True)