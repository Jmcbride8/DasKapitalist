# DasKapitalist - Trading Portfolio Management System

A sophisticated web application for tracking, analyzing, and managing options trading portfolios. Built on the Base44 platform with React, Tailwind CSS, and Recharts for data visualization.

## 🎯 Overview

DasKapitalist provides traders with comprehensive tools to manage their options positions, including covered calls, cash-secured puts, spreads, and other strategies. The application offers real-time portfolio tracking, performance analytics, and detailed reporting capabilities.

## ✨ Key Features

### Portfolio Management
- **Trade Tracking**: Full lifecycle management of trades from opening to closing
- **Multiple Strategy Support**: Trades, Covered Calls, Cash Secured Puts, Long Calls, Long Puts, Naked Puts, Naked Calls
- **Position Monitoring**: Real-time tracking of open positions with collateral and profit/loss metrics
- **Quick Updates**: Streamlined interface for updating position status and closing trades

### Analytics & Dashboards

#### Track Record Dashboard
- Historical P&L analysis with cumulative growth charts
- Ticker-specific performance metrics
- Win rate and profit factor calculations
- Trade type breakdown and analysis

#### Streaks Dashboard
- Weekly performance tracking
- Profit/loss streak analysis
- Best and worst week identification
- Period-over-period comparisons

#### Edge Dashboard
- Ticker-specific conviction analysis
- Realized vs unrealized profit ratios
- Profit impact filtering
- Historical performance by asset

#### Exposure Dashboard
- Open positions visualization
- Collateral allocation by ticker
- Unrealized P&L tracking
- Portfolio concentration analysis

### Home Page - Today's Exposure
- **Interactive Treemap**: Visual representation of portfolio exposure sized by collateral and colored by daily price movement
- **Real-time Price Updates**: Integration with market data for current pricing
- **Position Summary**: Quick stats on positions up/down for the day
- **S&P 500 Benchmark**: Market context with SPY performance

### Trade Management
- **Bulk Operations**: Import/export trades via CSV/Excel
- **Advanced Filtering**: Filter by status, type, account, ticker, date ranges
- **Profit Tracking**: Automatic calculation of yields, profits, and returns
- **Income Week Tracking**: Organize trades by weekly income periods

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Charts & Visualization**: Recharts, Framer Motion
- **UI Components**: Radix UI primitives with custom styling
- **Backend**: Base44 Platform (Deno runtime)
- **Database**: Base44 Entities (built-in)

### Project Structure

```
├── pages/                      # Application pages
│   ├── Home.jsx               # Main portfolio overview with treemap
│   ├── Dashboards.jsx         # Analytics hub (Track Record, Streaks, Edge, Exposure)
│   ├── Trades.jsx             # Trade list and management
│   ├── QuickUpdate.jsx        # Fast position updates
│   └── Summaries.jsx          # Summary reports
├── components/
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── TimeComparisonsChart.jsx
│   │   ├── WeeklyTotalsChart.jsx
│   │   ├── OpenPositionsChart.jsx
│   │   ├── TickerHistoryChart.jsx
│   │   ├── DashboardKPIs.jsx
│   │   └── ...
│   ├── trades/                # Trade management components
│   │   ├── TradeForm.jsx
│   │   ├── TradesTable.jsx
│   │   ├── CloseTradeModal.jsx
│   │   ├── BulkUpload.jsx
│   │   └── ...
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── entities/
│   └── Trade.json             # Trade data schema
├── functions/                 # Backend functions (Deno)
├── Layout.js                  # App layout with navigation
└── App.jsx                    # Main application router
```

## 📊 Data Model

### Trade Entity

The core data structure tracks all aspects of an options trade:

```json
{
  "status": "Open" | "Closed",
  "account": string,
  "type": "Trade" | "Covered Call" | "Covered Call" | "Cash Secured Put" | 
          "Long Call" | "Long Put" | "Naked Put" | "Naked Call",
  "ticker": string,
  "open_date": date,
  "expiration": date,
  "strike_price": number,
  "open_premium": number,        // Premium received when opening
  "collateral_start": number,    // Capital at risk
  "potential_yield": number,     // Expected return percentage
  "close_premium": number,       // Premium paid when closing
  "close_date": date,
  "income_week": date,           // Week trade is attributed to
  "close_type": "Assigned" | "Bought to Close" | "Sold to Close" | 
                "Rolled" | "Expired Worthless",
  "collateral_gain": number,     // Additional collateral returns
  "profit": number               // Net P&L
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald green for profits, gains, and positive metrics
- **Danger**: Rose/red for losses and negative metrics
- **Neutral**: Slate grays for UI elements and text

### Typography
- Clean, modern sans-serif fonts
- Hierarchical sizing for data density
- High contrast for readability

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Base44 account and app
- Node.js 18+ (for local development)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd DasKapitalist
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
- Set up Base44 app credentials in dashboard
- Configure any required API keys for market data

4. **Start development**
```bash
npm run dev
```

## 📱 Usage Guide

### Adding a New Trade

1. Navigate to **Trades** page
2. Click **Add Trade** button
3. Fill in trade details:
   - Select trade type (Covered Call, CSP, etc.)
   - Enter ticker, dates, strike price
   - Input premium received and collateral
   - System auto-calculates potential yield
4. Submit to create the trade

### Updating Open Positions

1. Go to **Quick Update** page
2. View all open positions in editable table
3. Update current prices, status, or notes
4. Changes save automatically

### Closing a Trade

1. Find trade in **Trades** list
2. Click **Close** action
3. Enter close premium and close type
4. System calculates final profit/loss

### Analyzing Performance

#### Track Record
- Toggle between weekly/monthly views
- Review cumulative P&L growth
- Identify top-performing tickers
- Analyze win rates by strategy type

#### Streaks
- Monitor consecutive profitable/losing weeks
- Compare current performance to historical averages
- Identify performance patterns

#### Edge
- Assess conviction levels per ticker
- Filter by minimum profit impact
- Review realized vs unrealized gains

#### Exposure
- Visualize portfolio allocation
- Monitor concentration risk
- Track unrealized P&L by position

## 🔧 Customization

### Adding New Dashboards

1. Create component in `components/dashboard/`
2. Add route in `App.jsx`
3. Update navigation in `Layout.js`
4. Implement data fetching with React Query

### Extending Trade Types

1. Update `entities/Trade.json` schema
2. Add new enum values to `type` field
3. Update form options in `TradeForm.jsx`
4. Ensure all calculations support new type

### Custom Metrics

1. Add calculation logic in relevant dashboard component
2. Use `useMemo` for performance optimization
3. Display in KPI cards or charts
4. Consider adding to export formats

## 📈 Performance Considerations

- **Data Loading**: Uses React Query for efficient caching and background updates
- **Chart Rendering**: Memoized data transformations for large datasets
- **Responsive Design**: Tailwind CSS with mobile-first breakpoints
- **State Management**: Minimal global state, component-level state where possible

## 🔐 Security

- **Authentication**: Handled by Base44 platform
- **Authorization**: Role-based access (admin/user)
- **Data Privacy**: All data stored in Base44 secure database
- **API Keys**: Managed through Base44 secrets

## 🤝 Contributing

This is a private trading application. For customization requests or bug reports, contact the development team.

## 📄 License

Private proprietary software. All rights reserved.

## 🆘 Support

For issues or questions:
1. Check this README
2. Review component documentation in code comments
3. Contact application administrator

## 🗺️ Roadmap

- [ ] Real-time market data integration
- [ ] Automated trade import from broker
- [ ] Advanced options analytics (Greeks, IV analysis)
- [ ] Tax lot tracking and reporting
- [ ] Mobile app (iOS/Android)
- [ ] Alert system for position management
- [ ] Integration with trading journals
- [ ] Multi-currency support

---

**Built with ❤️ using Base44 Platform**

*Last Updated: May 2026*