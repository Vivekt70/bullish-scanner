// Utility functions for indicators

export function ema(data, period=40, field='close'){
  let k = 2/(period+1);
  let emaArray = [];
  let prev;
  for(let i=0;i<data.length;i++){
    let price = data[i][field];
    if(price==null) { emaArray.push(null); continue; }
    if(prev==null){
      prev = price;
    } else {
      prev = price*k + prev*(1-k);
    }
    emaArray.push(prev);
  }
  return emaArray;
}

export function supertrend(data, atrPeriod=10, multiplier=3){
  // simplified supertrend (not exact but usable)
  let result = [];
  let atrs = [];
  for(let i=0;i<data.length;i++){
    if(i==0){
      atrs.push(0);
    } else {
      let tr = Math.max(
        data[i].high - data[i].low,
        Math.abs(data[i].high - data[i-1].close),
        Math.abs(data[i].low - data[i-1].close)
      );
      let prevAtr = atrs[atrs.length-1]||tr;
      atrs.push((prevAtr*(atrPeriod-1)+tr)/atrPeriod);
    }
  }
  let trend = null;
  for(let i=0;i<data.length;i++){
    let mid = (data[i].high+data[i].low)/2;
    let band = multiplier*atrs[i];
    let upper = mid+band;
    let lower = mid-band;
    if(trend==null){
      trend = data[i].close>upper? 'bull':'bear';
    } else {
      if(data[i].close>upper) trend='bull';
      if(data[i].close<lower) trend='bear';
    }
    result.push(trend);
  }
  return result;
}

export function renkoBricks(data, brickPct=1){
  if(!data || data.length==0) return [];
  let bricks = [];
  let brickSize = data[0].close*brickPct/100;
  let lastClose = data[0].close;
  for(let i=1;i<data.length;i++){
    let diff = data[i].close - lastClose;
    while(Math.abs(diff) >= brickSize){
      if(diff>0){
        lastClose += brickSize;
        bricks.push({dir:'up', close:lastClose});
      } else {
        lastClose -= brickSize;
        bricks.push({dir:'down', close:lastClose});
      }
      diff = data[i].close - lastClose;
    }
  }
  return bricks;
}

export function avgVolume(data, period=20){
  if(!data || data.length<period) return 0;
  let vols = data.slice(-period).map(d=>d.volume||0);
  return vols.reduce((a,b)=>a+b,0)/vols.length;
}
