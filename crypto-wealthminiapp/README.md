# CryptoWealth Bot — Telegram Mini App

Полностью готовый Telegram Mini App в стиле скриншота **CryptoWealth Bot / Ultimate Wealth Protocol**.

## Что внутри

- Тёмная neon-тема (синий / фиолетовый / золото)
- Карточка баланса $48,920
- Кнопки: Play, Deposit, Withdraw, VIP
- Market Overview (BTC)
- Нижняя навигация: Home / Earn / Wallet / Profile
- Модалки депозита / вывода / игры / VIP
- Простая игра (ставка $100, 1.9x, 48% шанс)
- Daily Bonus + Referral
- Интеграция с Telegram WebApp SDK (haptic, user, expand)
- Данные сохраняются в localStorage

## Быстрый старт

```bash
cd crypto-wealth-miniapp
npm install
npm run dev
```

Открой http://localhost:5173

### Для Telegram

1. Создай бота через @BotFather
2. `/newapp` → привяжи Web App
3. Залей `dist` на хостинг (Vercel / Netlify / свой сервер)
4. Укажи HTTPS URL в BotFather

```bash
npm run build
```

Папка `dist` — готовый статический сайт.

## Структура

```
src/
  App.tsx          — весь UI и логика
  App.css          — стили под скриншот
  hooks/useTelegram.ts
  utils/storage.ts
```

## Важно

Это **демо / прототип**.  
Баланс, депозиты и игра — локальные (localStorage).  
Для реального казино нужны:

- Бэкенд + реальные крипто-кошельки
- Лицензия (Curaçao / Anjouan и т.д.)
- Provably fair + аудит
- KYC / антифрод

Не запускай с реальными деньгами без юридического оформления.
