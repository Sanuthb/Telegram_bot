from telegram import Update
from telegram.ext import Application, MessageHandler, filters, CommandHandler, CallbackContext
import logging
from fastapi import FastAPI
from threading import Thread
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()
Token = os.getenv("TELEGRAM_TOKEN")

fastapi_app = FastAPI()


app = Application.builder().token(Token).build()
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

latest_message = None

drug_keywords = ["drug", "cocaine", "heroin", "marijuana", "meth", "ecstasy","mal","brown sugar","nicotine","ganja"]  

async def start(update: Update, context: CallbackContext):
    await update.message.reply_text("Hello, Welcome to my bot!")

async def monitor_messages(update: Update, context: CallbackContext):
    global latest_message
    message_text = None
    channel_name = None
    username = None
    timestamp = None

    if update.channel_post:
        message_text = update.channel_post.text
        chat_id = update.channel_post.chat_id
        channel_name = update.channel_post.chat.title
        username = update.channel_post.author_signature or "Unknown"
        timestamp = update.channel_post.date
    elif update.message:
        message_text = update.message.text
        chat_id = update.message.chat_id
        username = update.message.from_user.username or "Unknown"
        timestamp = update.message.date

    if message_text and any(keyword.lower() in message_text.lower() for keyword in drug_keywords):
        latest_message = {
            "chat_id": chat_id,
            "channel_name": channel_name,
            "username": username,
            "text": message_text,
            "timestamp": timestamp.isoformat(),
            "keywords_detected": [keyword for keyword in drug_keywords if keyword.lower() in message_text.lower()]
        }
        print(f"Detected drug-related message: {latest_message}")

app.add_handler(CommandHandler('start', start))
app.add_handler(MessageHandler(filters.ALL, monitor_messages))

def run_telegram_bot():
    print("Bot is running...")
    app.run_polling()

@fastapi_app.get("/")
async def home():
    if latest_message:
        return {"message": "Drug-related content detected!", "data": latest_message}
    else:
        return {"message": "No drug-related messages detected yet."}

def run_fastapi():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=5002)

if __name__ == "__main__":
    fastapi_thread = Thread(target=run_fastapi)
    fastapi_thread.start()

    run_telegram_bot()