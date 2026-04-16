# App Triste 💙

## 🇧🇷 Português

Um app Android minimalista para registrar momentos de tristeza. Toque na tela quando estiver triste — o app conta, salva e no final do mês te envia um resumo com estatísticas.

### Funcionalidades

- **Toque para registrar**: cada toque na tela incrementa o contador
- **Coração animado**: fundo com coração SVG estilo doodle com glow neon
- **Reset diário**: o contador zera à meia-noite (horário de Brasília)
- **Dados persistidos**: todos os registros ficam salvos no servidor
- **Resumo mensal**: notificação push no último dia do mês com estatísticas

### Tecnologias

| Camada | Stack |
|--------|-------|
| Mobile | React Native (Expo) + TypeScript |
| Backend | FastAPI + asyncpg |
| Banco | PostgreSQL |
| Notificações | Expo Push Notifications |

### Setup — Servidor

```bash
cd server
python -m venv venv
source venv/bin/activate  # Linux
pip install -r requirements.txt
cp .env.example .env
# Edite o .env com suas credenciais PostgreSQL
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Setup — Mobile

```bash
cd mobile
npm install
npx expo start
# Escaneie o QR code com o app Expo Go no seu Android
```

### Build APK

```bash
cd mobile
npx eas build --platform android --profile preview
```

---

## 🇺🇸 English

A minimalist Android app to track moments of sadness. Tap the screen when you feel sad — the app counts, saves, and sends you a monthly summary with statistics.

### Features

- **Tap to register**: each screen tap increments the counter
- **Animated heart**: SVG doodle-style heart background with neon glow
- **Daily reset**: counter resets at midnight (Brazil timezone)
- **Persisted data**: all records are saved on the server
- **Monthly summary**: push notification on the last day of the month

### Tech Stack

| Layer | Stack |
|-------|-------|
| Mobile | React Native (Expo) + TypeScript |
| Backend | FastAPI + asyncpg |
| Database | PostgreSQL |
| Notifications | Expo Push Notifications |

### Setup — Server

```bash
cd server
python -m venv venv
source venv/bin/activate  # Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your PostgreSQL credentials
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Setup — Mobile

```bash
cd mobile
npm install
npx expo start
# Scan the QR code with Expo Go on your Android device
```

### Build APK

```bash
cd mobile
npx eas build --platform android --profile preview
```

---

## License

Private project.
