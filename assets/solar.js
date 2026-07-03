
function set(id,val){const n=document.getElementById(id); if(n) n.textContent=val}
async function json(url){const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error(r.status); return r.json()}
(async()=>{try{const k=await json('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');const last=k[k.length-1];set('solarK',Array.isArray(last)?last[last.length-1]:'—')}catch(e){set('solarK','SWPC')}
try{const x=await json('https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json');const last=x[x.length-1];let v=last&&(last.flux||last.observed_flux);set('xray',v?Number(v).toExponential(1):'—')}catch(e){set('xray','SWPC')}
try{const a=await json('https://services.swpc.noaa.gov/products/alerts.json');set('alerts',Array.isArray(a)?String(Math.max(a.length-1,0)):'—')}catch(e){set('alerts','SWPC')}
try{const w=await json('https://api.open-meteo.com/v1/forecast?latitude=41.4048&longitude=-81.7229&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York');const c=w.current;set('solarWeather',Math.round(c.temperature_2m)+'°F');set('solarWeatherMore','Humidity '+c.relative_humidity_2m+'% • Baro '+(c.pressure_msl*0.0295299830714).toFixed(2)+' inHg • Wind '+Math.round(c.wind_speed_10m)+' mph')}catch(e){set('solarWeather','Open-Meteo')}
set('updated',new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}));})();
