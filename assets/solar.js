
async function json(url){const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error(r.status); return r.json()}
function set(id,val){document.getElementById(id).textContent=val}
(async()=>{try{const k=await json('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'); const last=k[k.length-1]; set('kindex', Array.isArray(last)? last[last.length-1] : '—')}catch(e){set('kindex','Link only')}
try{const x=await json('https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json'); const last=x[x.length-1]; let v=last && (last.flux||last.observed_flux); set('xray', v? Number(v).toExponential(1):'—')}catch(e){set('xray','Link only')}
try{const a=await json('https://services.swpc.noaa.gov/products/alerts.json'); set('alerts', Array.isArray(a)? String(Math.max(a.length-1,0)):'—')}catch(e){set('alerts','Link only')}
set('updated', new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));})();
