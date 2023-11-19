# Hedera Dashboard

This is a dashboard app built for Hedera using **React 18**, **Material UI 5**, and **Chart.js 4**. The app uses the **Hedera REST API, CoinGecko API, CoinMetrics API, and StakingRewards API** to get data such as live prices, historical data, and more.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the application](#run-the-application)
- [Demo](#demo)
- [Customizing the application](#customize-the-application)

### Prerequisites

Install the following prerequisites:

1. [Node.js](https://nodejs.org/en/)
2. [Visual Studio Code](https://code.visualstudio.com/download)

### Installation

#### Install required dependencies

From the **root** directory, run:

```bash
npm install
```

### Run the application

From the **root** directory, run:

```bash
npm start
```

### View the application

Go to http://localhost:3000/ to view the application.

### Demo

### Customize the application

This section describes how to customize the application.

#### Changing Colors

To modify the colors in the application, make changes in the `src/theme/theme.js` file.

#### Changing Fonts

To modify the fonts in the application, first, add a new font to the `public/index.html` file and then make changes in the `src/theme/typography.js` file.

#### Changing Logo

To modify the logo in the application, make changes in the `src/layout/Header.js` and `src/layout/Sidebar.js` files.
