# Avinash Telegram Bot Server Guide

## Overview
This project runs a Telegram bot assistant for Avinash Sharma.
It supports:
- Personal profile Q&A
- Domain-wise resume PDF sending
- Render deployment with webhook mode
- Local development with polling mode

## Server Architecture
Main file: `server.js`

- Uses `express` for web server endpoints.
- Uses `node-telegram-bot-api` for Telegram bot handling.
- Uses `dotenv` for environment variables.

### HTTP Endpoints
- `GET /`
  - Health/status endpoint.
  - Returns mode (`webhook` or `polling`).
- `POST /telegram/webhook` (or custom `TELEGRAM_WEBHOOK_PATH`)
  - Receives Telegram updates in production webhook mode.

## Environment Variables
Use `.env` locally (refer `.env.example`).

- `TELEGRAM_BOT_TOKEN` (required)
- `PORT` (optional, default `3000`)
- `USE_WEBHOOK` (`true`/`false`)
- `TELEGRAM_WEBHOOK_PATH` (default `/telegram/webhook`)
- `TELEGRAM_SECRET_TOKEN` (optional security token)
- `TELEGRAM_WEBHOOK_URL` (required in webhook mode unless `RENDER_EXTERNAL_URL` is present)

## Resume PDFs
PDF files are stored in `assets/` and mapped by domain:

- `frontend` -> `Avinash_Sharma_Resume_Frontend.pdf`
- `backend` -> `Avinash_Sharma_Resume_Backend.pdf`
- `fullstack` -> `Avinash_Sharma_Resume_FullStack.pdf`
- `faang` -> `Avinash_Sharma_Resume_FAANG.pdf`
- `sde` -> `Avinash_Sharma_Resume_SDE.pdf`
- `dev` -> `Avinash_Sharma_Resume_Dev.pdf`

## Bot Commands
### Core
- `/start` - Welcome and quick keyboard menu
- `/help` - Command help and examples
- `/menu` - Show quick keyboard menu
- `/status` - Runtime status and uptime

### Profile
- `/about`
- `/skills`
- `/projects`
- `/experience`
- `/education`
- `/certifications`
- `/contact`
- `/links`

### Resume
- `/resume` (shows shortcut commands)
- `/frontend_resume`
- `/backend_resume`
- `/fullstack_resume`
- `/faang_resume`
- `/sde_resume`
- `/dev_resume`

Legacy style also works:
- `/resume frontend`
- `/resume backend`
- `/resume fullstack`
- `/resume faang`
- `/resume sde`
- `/resume dev`

All resume commands send PDF files instead of text resume output.

## Smart Behavior Added
- Handles greetings and thanks naturally.
- Suggests valid options on unknown command.
- Quick keyboard gives one-tap command access.
- Intent-based replies for normal text queries.

## Run Locally
```bash
npm install
npm start
```

For local polling mode, keep:
- `USE_WEBHOOK=false`

## Deploy on Render
- Keep `USE_WEBHOOK=true`
- Set `TELEGRAM_BOT_TOKEN`
- Ensure `TELEGRAM_WEBHOOK_URL` is set (or rely on `RENDER_EXTERNAL_URL`)
- Deploy as Web Service using `npm start`
