# Sentio 💙

## 🇧🇷 Português

Um app Android minimalista para registrar momentos de tristeza. Toque na tela quando estiver triste — cada toque crava uma agulha no coração, escurecendo-o progressivamente. No final do mês você recebe um resumo via push notification.

### Funcionalidades

- **Toque para registrar**: cada toque crava uma agulha no coração
- **Coração que escurece**: quanto mais toques, mais escuro e apagado o coração fica
- **Agulhas persistentes**: as agulhas do dia ficam visíveis enquanto o dia não acaba
- **Reset diário**: o contador e as agulhas zeram à meia-noite (horário de Brasília)
- **Dados persistidos**: todos os registros ficam salvos no servidor
- **Resumo mensal**: notificação push no último dia do mês com estatísticas
- **Rate limiting**: proteção contra abuso (10 taps/min)
- **API Key**: autenticação via header `X-API-Key`

### Tecnologias

| Camada | Stack |
|--------|-------|
| Mobile | React Native (Expo SDK 54) + TypeScript |
| Backend | FastAPI + asyncpg + slowapi |
| Banco | PostgreSQL (Soft Delete) |
| Notificações | Expo Push Notifications |

### Setup — Servidor (VPS)

```bash
# Na VPS (82.112.245.99):
apt-get update && apt-get install -y git
git clone https://github.com/BernardoMancia/app-triste.git /home/adm_luke/prod/apps/app-triste
chmod +x /home/adm_luke/prod/apps/app-triste/server/deploy.sh
bash /home/adm_luke/prod/apps/app-triste/server/deploy.sh
```

**API rodando em:** `http://82.112.245.99:2345`

Após o deploy, copie a `API_KEY` exibida no terminal e insira no `mobile/app.json` → `extra.apiKey`.

Para atualizar após novos commits:
```bash
cd /home/adm_luke/prod/apps/app-triste && git pull origin main && systemctl restart app-triste
```

### Setup — Mobile (dev)

```bash
cd mobile
npm install
npx expo start
# Pressione "a" para abrir no emulador Android
```

### Build APK

```bash
cd mobile
npx eas build --platform android --profile preview
```

### Endpoints da API

| Método | Rota | Rate Limit |
|--------|------|------------|
| `POST` | `/api/tap` | 10/min |
| `GET` | `/api/today/{device_id}` | 30/min |
| `POST` | `/api/monthly-summary` | 10/min |
| `POST` | `/api/register-token` | 5/min |
| `GET` | `/api/health` | Público |

---

## 🇺🇸 English

A minimalist Android app to track moments of sadness. Tap the screen when you feel sad — each tap drives a needle into the heart, progressively darkening it. At the end of the month you receive a summary via push notification.

### Features

- **Tap to register**: each tap drives a needle into the heart
- **Darkening heart**: the more taps, the darker and more lifeless the heart becomes
- **Persistent needles**: today's needles stay visible until the day ends
- **Daily reset**: counter and needles reset at midnight (Brazil timezone)
- **Persisted data**: all records are saved on the server
- **Monthly summary**: push notification on the last day of the month
- **Rate limiting**: abuse protection (10 taps/min)
- **API Key**: authentication via `X-API-Key` header

### Tech Stack

| Layer | Stack |
|-------|-------|
| Mobile | React Native (Expo SDK 54) + TypeScript |
| Backend | FastAPI + asyncpg + slowapi |
| Database | PostgreSQL (Soft Delete) |
| Notifications | Expo Push Notifications |

### Setup — Server (VPS)

```bash
# On VPS (82.112.245.99):
apt-get update && apt-get install -y git
git clone https://github.com/BernardoMancia/app-triste.git /home/adm_luke/prod/apps/app-triste
chmod +x /home/adm_luke/prod/apps/app-triste/server/deploy.sh
bash /home/adm_luke/prod/apps/app-triste/server/deploy.sh
```

**API running at:** `http://82.112.245.99:2345`

After deploy, copy the `API_KEY` shown in terminal and paste it into `mobile/app.json` → `extra.apiKey`.

To update after new commits:
```bash
cd /home/adm_luke/prod/apps/app-triste && git pull origin main && systemctl restart app-triste
```

### Setup — Mobile (dev)

```bash
cd mobile
npm install
npx expo start
# Press "a" to open in Android emulator
```

### Build APK

```bash
cd mobile
npx eas build --platform android --profile preview
```

### API Endpoints

| Method | Route | Rate Limit |
|--------|-------|------------|
| `POST` | `/api/tap` | 10/min |
| `GET` | `/api/today/{device_id}` | 30/min |
| `POST` | `/api/monthly-summary` | 10/min |
| `POST` | `/api/register-token` | 5/min |
| `GET` | `/api/health` | Public |

---

## License

Private project.
