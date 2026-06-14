import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

from config import EMAIL_ADDRESS
from config import EMAIL_PASSWORD


def send_otp_email(receiver_email, otp):

    subject = "[GPID Security] Email Verification OTP"

    body = f"""
Dear User,

Your verification OTP is:

{otp}

This OTP will expire in 60 seconds.

If you did not request this OTP, please ignore this email.

GPID Security Team
"""

    msg = MIMEMultipart()

    msg["From"] = EMAIL_ADDRESS
    msg["To"] = receiver_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)

        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_ADDRESS,
            receiver_email,
            msg.as_string()
        )

        server.quit()

        return True

    except Exception as e:
        print("SMTP Error:", e)
        return False