# 🪣 Budget Buckets

A personal budgeting app built with React and TypeScript. Create spending categories as visual buckets, log your expenses, and watch them fill up as you spend. Built as a mobile-first PWA so it lives on your phone like a native app.

---

## Features

- **Visual buckets** — each category is represented as an SVG bucket that fills up as you spend
- **Ring layout** — buckets are arranged in a circle for at-a-glance visibility
- **Spend logging** — tap any bucket to log a transaction against it
- **Transaction history** — view a full list of expenses per bucket
- **Animated warnings** — buckets shake at 75% capacity and drip water when overflowing at 100%
- **New month reset** — zero out all buckets at the start of a new budget period
- **Persistent storage** — all data is saved locally to your device via localStorage
- **PWA** — installable on your phone home screen, works offline

---

## Tech Stack

- [React](https://react.dev/) — UI components
- [TypeScript](https://www.typescriptlang.org/) — type safety throughout
- [Vite](https://vitejs.dev/) — build tool and dev server
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — PWA support
- localStorage — client-side data persistence, no backend required

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/bucket-budget.git
cd bucket-budget

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist` folder, ready to deploy.

---

## Project Structure

```
src/
├── types.ts              # Bucket and Transaction interfaces
├── store.ts              # localStorage read/write and data helpers
├── App.tsx               # Root component, state management, ring layout
├── App.css               # Global styles and animations
├── BucketCard.tsx        # SVG bucket visual with fill and animations
├── BucketForm.tsx        # Form for creating a new bucket
├── TransactionForm.tsx   # Form for logging a spend against a bucket
└── TransactionHistory.tsx # List of past transactions for a bucket
```

---

## Usage

### Adding a Bucket
Fill in a name, spending limit, and pick a color in the form at the top, then tap **Add Bucket**.

### Logging a Transaction
Tap any bucket in the list to open the transaction form. Enter an amount and an optional description, then tap **Log**.

### Viewing History
Tap the **history** button under any bucket to see all transactions logged against it.

### Deleting/Editing a bucket
Slide the bucket row to the left to expose the two buttons

### Starting a New Pay Period
Tap **Reset Data** in the top right to zero out all bucket spending for a new budget period.

---

## Deployment

This app is deployed via [Netlify](https://netlify.com) with automatic deploys on every push to `main`.

---

## Future Ideas

- Delete individual transactions from history
- Haptic feedback on mobile when logging a transaction

---

## License

MIT
