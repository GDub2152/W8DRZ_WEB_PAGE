
function el(id,v){const n=document.getElementById(id); if(n) n.textContent=v}
async function getJSON(url){const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error(r.status); return r.json()}
(async()=>{try{const w=await getJSON('https://api.open-meteo.com/v1/forecast?latitude=41.4048&longitude=-81.7229&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York');const c=w.current;el('weatherTemp',Math.round(c.temperature_2m)+'°F');el('weatherMore','Humidity '+c.relative_humidity_2m+'% • Baro '+(c.pressure_msl*0.0295299830714).toFixed(2)+' inHg • Wind '+Math.round(c.wind_speed_10m)+' mph')}catch(e){el('weatherTemp','Open-Meteo');el('weatherMore','Live weather link unavailable')}
try{const k=await getJSON('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');const last=k[k.length-1];el('kindex',Array.isArray(last)?last[last.length-1]:'—')}catch(e){el('kindex','SWPC')}
try{const iss=await getJSON('https://api.wheretheiss.at/v1/satellites/25544');el('issPos',Number(iss.latitude).toFixed(1)+'°, '+Number(iss.longitude).toFixed(1)+'°')}catch(e){el('issPos','ISS links')}
})();
