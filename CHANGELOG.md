# Changelog — Sentio

All notable changes to this project will be documented in this file.
Versioning: `0.1` (alpha) → `0.2` (beta) → `1.0+` (production)

---

## [1.0] — 2026-04-21 — Production

### 🇧🇷 Notas de versão (pt-BR)

<pt-BR>
Bem-vindo ao Sentio!

Esta é a primeira versão oficial do app. Registre seus momentos de tristeza com um simples toque — cada toque crava uma agulha no coração, que escurece progressivamente ao longo do dia.

O que há nesta versão:
• Toque para registrar momentos de tristeza
• Coração que escurece conforme o número de toques
• Agulhas visíveis que acumulam durante o dia
• Contador que persiste ao fechar e reabrir o app no mesmo dia
• Reset automático à meia-noite (horário de Brasília)
• Resumo mensal por notificação push no último dia de cada mês
• Dados salvos com segurança — sem cadastro necessário
</pt-BR>

### 🇺🇸 Release Notes (en-US)

Welcome to Sentio!

This is the first official release. Record your moments of sadness with a single tap — each tap drives a needle into the heart, which progressively darkens throughout the day.

What's new in this version:
• Tap to record moments of sadness
• Heart that darkens progressively with each tap
• Needles accumulate visibly throughout the day
• Counter persists when closing and reopening the app on the same day
• Automatic reset at midnight (Brazil timezone)
• Monthly summary via push notification on the last day of each month
• Data saved securely — no account required

### Technical
- Package: `com.sentio.app`
- APK + AAB generated at `F:\Finais-app-postagem\Sentio\`
- Backend: FastAPI + asyncpg + slowapi on `82.112.245.99:2345`
- Rate limiting: 10 req/min (tap), 30 req/min (today), 5 req/min (token)
- API Key auth via `X-API-Key` header

---

*Previous versions: none (initial release)*
