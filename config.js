/* =============================================================
   Wasted — Telegram bot configuration
   --------------------------------------------------------------
   To enable order notifications to your Telegram bot:
   1. Open Telegram, talk to @BotFather, send /newbot, follow
      the prompts. You'll receive a BOT TOKEN like
      "123456789:AAH-abc...". Copy it.
   2. Start a chat with your new bot (tap the link BotFather
      sends you, then press Start).
   3. Open https://api.telegram.org/bot<TOKEN>/getUpdates in your
      browser. Find the "chat":{"id": ...} block. That number is
      your CHAT ID.
   4. Paste both below. Reload the site. Done.
   ============================================================= */

window.WASTED_CONFIG = {
  // 👇 Replace with your own values
  telegramBotToken: "REPLACE_WITH_YOUR_BOT_TOKEN",
  telegramChatId:   "REPLACE_WITH_YOUR_CHAT_ID",

  // Where to send the order. If the bot is not configured the
  // order will still succeed for the customer — it just won't
  // be forwarded.
  enabled: false
};