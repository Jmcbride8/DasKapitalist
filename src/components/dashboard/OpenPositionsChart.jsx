import TickerHistoryChart from './TickerHistoryChart';

export default function OpenPositionsChart({ trades }) {
    const openTrades = trades.filter(trade => trade.status === 'Open');
    
    return <TickerHistoryChart trades={openTrades} />;
}