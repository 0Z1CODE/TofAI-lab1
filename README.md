# TofAi Pravtice1

## Libraries

- "axios": "^1.7.7",
- "dotenv": "^16.4.5",
- "mongoose": "^8.7.0",
- "node-telegram-bot-api": "^0.66.0"

see package.json for more

## General dev loop

1. restore dependencies

```
npm install
```

2. Start dev env

```shell
npm run dev 
```

## Deployment

### Environment variables required to be injected into .env

ENV | Required? | Notes
----|-----------|------
BOT_TOKEN | Yes | Telegram bot access token
Geocoder | Yes | https://locationiq.com/ api 
MONGO_DB_URI | Yes | coonect mongo db collection 
