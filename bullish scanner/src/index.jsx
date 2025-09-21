import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ema, supertrend, renkoBricks, avgVolume } from './utils/indicators';
import RenkoChart from './components/RenkoChart';

function App(){
  const [symbols, setSymbols] = useState(['RELIANCE.NS','TCS.NS']);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  async function fetchData(){
    setLoading(true);
    const out = [];
    for (const s of symbols){
      const r = await window.electronAPI.fetchChart({ symbol: s });
      if(r.ok){
        const chart = r.data.chart?.result?.[0];
        const ts = chart?.timestamp||[];
        const quotes = chart?.indicators?.quote?.[0]||{};
        let data = ts.map((t,i)=>({
          time:new Date(t*1000),
          open:quotes.open?.[i],
          high:quotes.high?.[i],
          low:quotes.low?.[i],
          close:quotes.close?.[i],
          volume:quotes.volume?.[i],
        })).filter(d=>d.close!=null);

        let ema40 = ema(data,40);
        let st = supertrend(data,10,3);
        let renko = renkoBricks(data,1);
        let avgVol = avgVolume(data,20);
        let todayVol = data[data.length-1]?.volume||0;
        let volSignal = todayVol>avgVol? 'High Volume':'Normal';

        let trend = st[st.length-1];
        let emaOk = data[data.length-1]?.close>ema40[ema40.length-1] ? 'Above' : 'Below';
        let renkoDir = renko.length? renko[renko.length-1].dir : '-'

        out.push({
          symbol:s,
          trend, emaOk, volSignal,
          candles:data.length,
          renkoDir, renkoCount:renko.length,
          renko
        });
      } else {
        out.push({ symbol:s, error:r.error });
      }
    }
    setResults(out);
    setLoading(false);
  }

  function addSymbol(){
    if(input && !symbols.includes(input)){
      setSymbols([...symbols,input]);
      setInput('');
    }
  }

  function toggleChart(sym){
    setExpanded(prev=>({...prev,[sym]:!prev[sym]}));
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>Bullish Screener Desktop (With Renko Chart)</h2>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Symbol" />
      <button onClick={addSymbol}>Add</button>
      <button onClick={fetchData} disabled={loading}>
        {loading?'Loading...':'Fetch'}
      </button>
      <table border="1" cellPadding="5" style={{marginTop:20,borderCollapse:'collapse',width:'100%'}}>
        <thead>
          <tr>
            <th>Symbol</th><th>Trend</th><th>EMA40</th><th>Volume</th><th>RenkoDir</th><th>RenkoCount</th><th>Candles</th><th>Chart</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r,i)=>(
            <React.Fragment key={i}>
              <tr>
                <td>{r.symbol}</td>
                <td>{r.error? 'Error' : r.trend}</td>
                <td>{r.emaOk}</td>
                <td>{r.volSignal}</td>
                <td>{r.renkoDir}</td>
                <td>{r.renkoCount}</td>
                <td>{r.candles}</td>
                <td><button onClick={()=>toggleChart(r.symbol)}>Toggle</button></td>
              </tr>
              {expanded[r.symbol] && (
                <tr>
                  <td colSpan="8">
                    <RenkoChart bricks={r.renko}/>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>);
