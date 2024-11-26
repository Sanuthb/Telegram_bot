from telegram import Update, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import Application, MessageHandler, filters, CommandHandler, CallbackContext
import logging
from fastapi import FastAPI, WebSocket
from threading import Thread
import uvicorn
import os
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()
Token = os.getenv("TELEGRAM_TOKEN")

# Initialize FastAPI and Telegram Application
fastapi_app = FastAPI()
app = Application.builder().token(Token).build()
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# Keywords to monitor
drug_keywords = ["drug", "cocaine", "heroin", "marijuana", "meth", "ecstasy", "mal", "brown sugar", "nicotine", "ganja"]

# Dictionary to store user locations
user_locations = {}

# List of connected WebSocket clients
clients = []

# FastAPI Routes
@fastapi_app.get("/")
async def root():
    return {"message": "Welcome to the Telegram Bot FastAPI Server"}

@fastapi_app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        clients.remove(websocket)

# Notify WebSocket clients
async def notify_clients(message_data):
    for client in clients:
        await client.send_json(message_data)

# Start command
async def start(update: Update, context: CallbackContext):
    await update.message.reply_text(
        "Hello, Welcome to the bot! This bot monitors messages and may request location data when certain keywords are detected."
    )

# Monitor messages in groups and channels
async def monitor_messages(update: Update, context: CallbackContext):
    if update.message:
        groupname = update.message.chat.title if update.message.chat.type in ["group", "supergroup"] else "Private"
        message_text = update.message.text
        chat_id = update.message.chat_id
        username = update.message.from_user.first_name or "Unknown"
        userid = update.message.from_user.id
        timestamp = update.message.date

        # Check for drug-related keywords
        if message_text and any(keyword.lower() in message_text.lower() for keyword in drug_keywords):
            # Get user's last known location (if any)
            user_location = user_locations.get(userid, {"latitude": None, "longitude": None})

            # Prepare the notification data
            latest_message = {
                "groupname": groupname,
                "chat_id": chat_id,
                "username": username,
                "userid": userid,
                "text": message_text,
                "timestamp": timestamp.isoformat(),
                "keywords_detected": [keyword for keyword in drug_keywords if keyword.lower() in message_text.lower()],
                "location": user_location,  # Add location to the message
            }
            print(f"Detected drug-related message: {latest_message}")
            await notify_clients(latest_message)

            # Request location only in groups
            if update.message.chat.type in ["group", "supergroup"]:
                try:
                    # Send a private message to the user
                    location_keyboard = ReplyKeyboardMarkup(
                        [[KeyboardButton("Share Location", request_location=True)]],
                        resize_keyboard=True,
                        one_time_keyboard=True,
                    )
                    await context.bot.send_message(
                        chat_id=userid,
                        text=f"Hi {username}, we detected sensitive content in your message in the group '{groupname}'. Please share your location for verification purposes.",
                        reply_markup=location_keyboard,
                    )
                except Exception as e:
                    if "Forbidden" in str(e):
                        print(f"Cannot message user {username} (ID: {userid}): {e}")
                        # Optionally notify in the group
                        await update.message.reply_text(
                            f"{username}, please start a private chat with me and share your location."
                        )
                    else:
                        print(f"Failed to send private message: {e}")

# Handle location messages
async def handle_location(update: Update, context: CallbackContext):
    if update.message and update.message.location:
        latitude = update.message.location.latitude
        longitude = update.message.location.longitude
        userid = update.message.from_user.id

        # Store the user's location
        user_locations[userid] = {"latitude": latitude, "longitude": longitude}

        location_data = {
            "userid": userid,
            "latitude": latitude,
            "longitude": longitude,
        }

        print(f"Received location: {location_data}")
        await notify_clients(location_data)
        await update.message.reply_text("Thank you for sharing your location!")

# Add handlers to the bot
app.add_handler(CommandHandler('start', start))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, monitor_messages))
app.add_handler(MessageHandler(filters.LOCATION, handle_location))

# Run Telegram Bot
def run_telegram_bot():
    print("Telegram Bot is running...")
    app.run_polling()

# Run FastAPI
def run_fastapi():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=5002)

if __name__ == "__main__":
    fastapi_thread = Thread(target=run_fastapi)
    fastapi_thread.start()
    run_telegram_bot()
