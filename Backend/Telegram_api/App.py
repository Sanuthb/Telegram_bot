from telegram import Update
from telegram.ext import Application, MessageHandler, filters, CommandHandler, CallbackContext
import logging
from fastapi import FastAPI, WebSocket
from threading import Thread
import uvicorn
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()
Token = os.getenv("TELEGRAM_TOKEN")

fastapi_app = FastAPI()
app = Application.builder().token(Token).build()
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

drug_keywords = ["drug", "cocaine", "heroin", "marijuana", "meth", "ecstasy", "mal", "brown sugar", "nicotine", "ganja"]

clients = []

# Define root route
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

async def notify_clients(message_data):
    for client in clients:
        await client.send_json(message_data)

async def start(update: Update, context: CallbackContext):
    await update.message.reply_text("Hello, Welcome to my bot!")

async def monitor_messages(update: Update, context: CallbackContext):
    message_text = None
    channel_name = None
    username = None
    timestamp = None 
    if update.message:     
        groupname = update.message.chat.title   
        message_text = update.message.text
        chat_id = update.message.chat_id
        username = update.message.from_user.first_name or "Unknown"
        userid = update.message.from_user.id
        timestamp = update.message.date

    if message_text and any(keyword.lower() in message_text.lower() for keyword in drug_keywords):
        latest_message = {
            "groupname": groupname,
            "chat_id": chat_id,
            "channel_name": channel_name or "none",
            "username": username,
            "userid": userid,
            "text": message_text,
            "timestamp": timestamp.isoformat(),
            "keywords_detected": [keyword for keyword in drug_keywords if keyword.lower() in message_text.lower()]
        }
        print(f"Detected drug-related message: {latest_message}")

        await notify_clients(latest_message)

app.add_handler(CommandHandler('start', start))
app.add_handler(MessageHandler(filters.ALL, monitor_messages))

def run_telegram_bot():
    print("Telegram Bot is running...")
    app.run_polling()

def run_fastapi():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=5002)

if __name__ == "__main__":
    fastapi_thread = Thread(target=run_fastapi)
    fastapi_thread.start()

    run_telegram_bot()
