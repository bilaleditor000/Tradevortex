import React, { useState } from 'react';
import { playClickSound } from '../utils/sound';
import { Download, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TradingJournalDownload: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  const sampleRows = [
    { date: '2026-10-20', asset: 'XAU/USD', side: 'BUY', entry: '2642.50', exit: '2668.00', lots: '0.40', risk: '$150', pnl: '+$1,020.00', rr: '1:6.8', notes: 'Asian sweep + 15M hammer at daily support' },
    { date: '2026-10-21', asset: 'EUR/USD', side: 'SELL', entry: '1.0865', exit: '1.0815', lots: '0.60', risk: '$120', pnl: '+$300.00', rr: '1:2.5', notes: '200 EMA rejection on 1H chart' },
    { date: '2026-10-22', asset: 'BTC/USDT', side: 'BUY', entry: '67800', exit: '67300', lots: '0.20', risk: '$100', pnl: '-$100.00', rr: '1:2.0', notes: 'Stopped out during NY open chop' },
  ];

  const handleDownloadCsv = () => {
    playClickSound('calculate');

    const headers = 'Trade #,Date,Asset,Direction,Entry Price,Exit Price,Lot Size,Risk Amount ($),Realized PnL ($),Risk:Reward,Emotion Rating (1-5),Strategy Setup Notes\n';
    const rows = [
      '1,2026-10-20,XAU/USD,BUY,2642.50,2668.00,0.40,150.00,+1020.00,1:6.8,5,Asian low sweep and 15M hammer rejection',
      '2,2026-10-21,EUR/USD,SELL,1.0865,1.0815,0.60,120.00,+300.00,1:2.5,4,200 EMA rejection on 1H timeframe',
      '3,2026-10-22,BTC/USDT,BUY,67800.00,67300.00,0.20,100.00,-100.00,1:2.0,3,Stopped out during NY open volatility',
      '4,2026-10-23,US30,BUY,42200.00,42550.00,1.00,200.00,+350.00,1:1.75,4,Opening Range Breakout (ORB) strategy'
    ].join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', 'TradeVortex_Risk_Management_Trading_Journal.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">
              Downloadable Risk Management Trading Journal
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional spreadsheet lead magnet pre-built with automatic Win Rate, Expectancy, and Drawdown formulas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wide"
        >
          {downloaded ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download Excel/CSV Template</span>
            </>
          )}
        </button>
      </div>

      {/* Spreadsheet Preview Table */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Sample Journal Entries Preview (Excel / Google Sheets Compatible)
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Asset</th>
                <th className="px-3 py-2.5">Side</th>
                <th className="px-3 py-2.5">Entry</th>
                <th className="px-3 py-2.5">Exit</th>
                <th className="px-3 py-2.5">Lots</th>
                <th className="px-3 py-2.5">Risk $</th>
                <th className="px-3 py-2.5">Realized PnL</th>
                <th className="px-3 py-2.5">R:R</th>
                <th className="px-3 py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {sampleRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="px-3 py-2">{row.date}</td>
                  <td className="px-3 py-2 font-bold text-white">{row.asset}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        row.side === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {row.side}
                    </span>
                  </td>
                  <td className="px-3 py-2">{row.entry}</td>
                  <td className="px-3 py-2">{row.exit}</td>
                  <td className="px-3 py-2">{row.lots}</td>
                  <td className="px-3 py-2 text-rose-400">{row.risk}</td>
                  <td className={`px-3 py-2 font-bold ${row.pnl.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.pnl}
                  </td>
                  <td className="px-3 py-2 text-cyan-300">{row.rr}</td>
                  <td className="px-3 py-2 text-slate-400 max-w-xs truncate">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-400 leading-relaxed flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0" />
        <span>
          Includes automated summary metrics: Win Rate %, Profit Factor, Average Win / Average Loss, and Max Drawdown tracking. 100% free to download.
        </span>
      </div>
    </div>
  );
};
