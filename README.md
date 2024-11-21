# Ticker: Long duration stopwatch
A small tool for recording your incomes and expenses. Designed to be simple, fast, and mobile-first.
No integrations, no fancy analytics, just simply add your expenses and incomes and get a clear
picture of where your money goes.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## About

Built for personal usage, designed with personal preferences. The application is bare-featured with
minimalistic design and functionality. Loads fast and animated appropriately. Mobile first design.
No onboarding. No tracking. No ads, ever.

## Features
- Manually record your incomes and expenses
- Cloud-synced across devices
- Get a clear picture of your finance
- Automatically add vendors and categories

## Installation

### Prerequisites

- Node.js (version ^20.12.2)
- npm (version ^10.5.0)
- A supabase account (free tier available)
- A logo.dev account

### Logo.dev account

The application uses the [logo.dev](https://www.logo.dev/) API to generate logos for vendors. You need to create an account on logo.dev and
generate a public and secret key.

### Steps

To run the development server, follow these steps:

1. **Clone the repository**
```bash
git clone https://github.com/pingSubhajit/irene.git
```
2. **Install dependencies**
```bash
yarn install
```

3. **Create a `.env` file in the root directory**
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
MAIN_URL=http://192.168.0.1:3000 // Change this to your local IP address with port number
DATABASE_URL=YOUR_SUPABASE_DATABASE_URL
NEXT_PUBLIC_LOGO_DEV_TOKEN=YOUR_LOGO_DEV_TOKEN
LOGO_DEV_SECRET=YOUR_LOGO_DEV_SECRET
```
4. **Run Drizzle migrations**

- Run a single command to run DB migration to your Supabase database
```bash
npx drizzle-kit migrate
```

5. **Run the development server**
```bash
yarn run dev
```

## Contributing

The product is free to use. However, no new features, bug fixes, or any meaningful support will be guaranteed. Although
I welcome contributions and acknowledge that contributions are the building blocks of open-source software. If you want
to contribute, please open an issue describing the problem or feature you want to work on. I will try to respond as soon
as possible. The project does not enforce any strict guidelines for contributions.


## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/pingSubhajit/ticker/blob/main/LICENSE) for more
information. The project is completely open source and feel free to fork, modify and host your own version.
No attribution required.
