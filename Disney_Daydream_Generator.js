/* Wishes, Whips & Wonder — Daydream Generator add-on for Edition 5.2.
   Keeps the original storage key and all existing data intact. */
(function(){
'use strict';
const rouletteIndex=sections.findIndex(s=>s.id==='roulette');
if(rouletteIndex>=0)sections.splice(rouletteIndex,1);
const routeEntry=sections.find(s=>s.id==='routes');
if(routeEntry)routeEntry.sub='Classic routes · Daydream Generator · Roulette · Saved days';
const originalRoutes=renderRoutes;
const parks=['Magic Kingdom','EPCOT','Animal Kingdom','Hollywood Studios'];
const destinations=[...parks,'Disney Springs'];
const placeData={
'Magic Kingdom':[
 {area:'Main Street, U.S.A.',name:'Castle photo and Main Street',type:'photos',minutes:20},
 {area:'Main Street, U.S.A.',name:'Main Street pin and souvenir browse',type:'pins',minutes:20},
 {area:'Adventureland',name:'Jungle Cruise',type:'rides',minutes:50},
 {area:'Adventureland',name:'Aloha Isle pineapple treat',type:'snacks',minutes:20},
 {area:'Adventureland',name:'Pirates of the Caribbean',type:'rides',minutes:40},
 {area:'Frontierland',name:'Frontierland photos',type:'photos',minutes:15},
 {area:'Liberty Square',name:'Haunted Mansion',type:'rides',minutes:45},
 {area:'Fantasyland',name:'Fantasyland pin and gift browsing',type:'pins',minutes:20},
 {area:'Fantasyland',name:'Peter Pan’s Flight',type:'rides',minutes:45},
 {area:'Fantasyland',name:'Storybook Treats snack',type:'snacks',minutes:20},
 {area:'Tomorrowland',name:'Space Mountain',type:'rides',minutes:45},
 {area:'Tomorrowland',name:'Tomorrowland photo stop',type:'photos',minutes:15}],
'EPCOT':[
 {area:'World Celebration',name:'Spaceship Earth photo',type:'photos',minutes:15},
 {area:'World Celebration',name:'Disney Traders pin hunt',type:'pins',minutes:25},
 {area:'World Celebration',name:'Connections Café snack',type:'snacks',minutes:20},
 {area:'World Nature',name:'Soarin’ Around the World',type:'rides',minutes:50},
 {area:'World Nature',name:'Living with the Land',type:'rides',minutes:35},
 {area:'World Showcase · Mexico',name:'Mexico pavilion photos and browsing',type:'photos',minutes:25},
 {area:'World Showcase · Norway',name:'Frozen Ever After',type:'rides',minutes:50},
 {area:'World Showcase · Norway',name:'School bread at Kringla Bakeri',type:'snacks',minutes:20},
 {area:'World Showcase · Germany',name:'Karamell-Küche caramel treat',type:'snacks',minutes:25},
 {area:'World Showcase · Germany',name:'Germany pavilion shopping',type:'shopping',minutes:20}],
'Animal Kingdom':[
 {area:'Discovery Island',name:'Tree of Life photo',type:'photos',minutes:20},
 {area:'Pandora',name:'Avatar Flight of Passage',type:'rides',minutes:85},
 {area:'Pandora',name:'Na’vi River Journey',type:'rides',minutes:45},
 {area:'Pandora',name:'Pongu Lumpia or Night Blossom',type:'snacks',minutes:20},
 {area:'Pandora',name:'Windtraders browse',type:'shopping',minutes:20},
 {area:'Africa',name:'Kilimanjaro Safaris',type:'rides',minutes:60},
 {area:'Africa',name:'Harambe street photos',type:'photos',minutes:15},
 {area:'Africa',name:'Tamu Tamu treat',type:'snacks',minutes:20},
 {area:'Asia',name:'Expedition Everest',type:'rides',minutes:50},
 {area:'Asia',name:'Everest mountain photo',type:'photos',minutes:15},
 {area:'Discovery Island',name:'Discovery Trading Company pin hunt',type:'pins',minutes:25}],
'Hollywood Studios':[
 {area:'Hollywood Boulevard',name:'Hollywood Boulevard photo',type:'photos',minutes:15},
 {area:'Hollywood Boulevard',name:'Mickey & Minnie’s Runaway Railway',type:'rides',minutes:50},
 {area:'Echo Lake',name:'Echo Lake snack',type:'snacks',minutes:20},
 {area:'Grand Avenue',name:'BaseLine Tap House pretzel',type:'snacks',minutes:20},
 {area:'Galaxy’s Edge',name:'Millennium Falcon: Smugglers Run',type:'rides',minutes:50},
 {area:'Galaxy’s Edge',name:'Blue or Green Milk',type:'snacks',minutes:20},
 {area:'Galaxy’s Edge',name:'Star Wars photo stop',type:'photos',minutes:20},
 {area:'Toy Story Land',name:'Slinky Dog Dash',type:'rides',minutes:60},
 {area:'Toy Story Land',name:'Lunch Box Tart',type:'snacks',minutes:20},
 {area:'Sunset Boulevard',name:'Tower of Terror',type:'rides',minutes:50},
 {area:'Hollywood Boulevard',name:'Pin and souvenir hunt',type:'pins',minutes:25}],
'Disney Springs':[
 {area:'Marketplace',name:'Disney’s Pin Traders',type:'pins',minutes:30},
 {area:'Marketplace',name:'World of Disney merchandise browse',type:'shopping',minutes:35},
 {area:'Marketplace',name:'Marketplace sweet treat',type:'snacks',minutes:25},
 {area:'Marketplace',name:'Waterfront photo and seated break',type:'photos',minutes:20},
 {area:'Town Center',name:'Town Center window shopping',type:'shopping',minutes:30},
 {area:'The Landing',name:'The Landing waterfront photos',type:'photos',minutes:20},
 {area:'The Landing',name:'Gideon’s Bakehouse (if queue permits)',type:'snacks',minutes:30}]
};
const interests=[['rides','🎢 Rides'],['snacks','🍦 Snacks & treats'],['pins','📍 Pin hunting'],['photos','📸 Photos & memories'],['shopping','🛍️ Shopping'],['shows','🎭 Shows']];
const config={who:'both',energy:'medium',duration:'medium',destination:'surprise',interests:['rides','snacks','pins','photos'],priority:'rides'};
let routeTab='classic',currentPark='Magic Kingdom',generated=null,viewSaved=null;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const safe=s=>esc(s==null?'':s);
function state(){data.daydreams??={saved:[],history:[],current:null};return data.daydreams}
function newId(){return 'dd-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
function buttonTabs(){return `<div class="tabs"><button class="${routeTab==='classic'?'active':''}" onclick="ddTab('classic')">🗺️ Classic Routes</button><button class="${routeTab==='generator'?'active':''}" onclick="ddTab('generator')">✨ Daydream Generator</button><button class="${routeTab==='roulette'?'active':''}" onclick="ddTab('roulette')">🎲 Surprise Me!</button><button class="${routeTab==='saved'?'active':''}" onclick="ddTab('saved')">❤️ Saved Daydreams</button></div><div id="dd-content">${tabBody()}</div>`}
renderRoutes=function(){return `<p class="note">All your original park routes and saved visits are preserved. Plan a flexible day, spin for a park, or revisit a favorite itinerary.</p>${buttonTabs()}`};
window.ddTab=function(t){routeTab=t;document.getElementById('dd-content').innerHTML=tabBody()};
function tabBody(){if(routeTab==='classic')return originalRoutes(currentPark);if(routeTab==='roulette')return renderRoulette();if(routeTab==='saved')return savedBody();return generatorBody()}
function select(label,id,values){return `<label class="tiny" for="${id}">${label}</label><select class="field" id="${id}" onchange="ddConfig('${id}',this.value)">${values.map(([v,t])=>`<option value="${safe(v)}" ${config[id]===v?'selected':''}>${safe(t)}</option>`).join('')}</select>`}
window.ddConfig=function(k,v){config[k]=v;if(k==='destination'&&v==='Disney Springs'){}if(k==='priority'&&!config.interests.includes(v))config.interests.push(v)};
window.ddInterest=function(k,on){config.interests=on?[...new Set([...config.interests,k])]:config.interests.filter(x=>x!==k);if(!config.interests.includes(config.priority))config.priority=config.interests[0]||'snacks';document.getElementById('dd-priority').innerHTML=priorityOptions()};
function priorityOptions(){return `<label class="tiny">⭐ Top priority (protect this stop)</label><select class="field" id="priority" onchange="ddConfig('priority',this.value)">${config.interests.map(k=>`<option value="${k}" ${config.priority===k?'selected':''}>${safe(interests.find(x=>x[0]===k)?.[1]||k)}</option>`).join('')}</select>`}
function generatorBody(){return `<div class="panel"><h3>✨ Disney Daydream Generator</h3><p>Tell us your mood. Get a varied, geographically sensible plan with breaks and flexible ride allowances.</p>${select('Who’s going?','who',[['mom','👩 Mom'],['nicholas','⚾ Nicholas'],['both','💕 Both']])}${select('Energy level','energy',[['low','🌸 Low'],['medium','✨ Medium'],['high','⚡ High']])}${select('Time available','duration',[['short','2–3 hours'],['medium','4–6 hours'],['full','Full day']])}${select('Destination','destination',[['surprise','🎲 Surprise me'],...destinations.map(x=>[x,x]),['combo','Park + Disney Springs']])}<div class="subhead">Today’s interests</div><div class="parkgrid">${interests.map(([k,label])=>`<label class="parkbtn" style="font-size:12px"><input type="checkbox" ${config.interests.includes(k)?'checked':''} onchange="ddInterest('${k}',this.checked)"> ${label}</label>`).join('')}</div><div id="dd-priority">${priorityOptions()}</div><p class="note">Shows depend on schedules and are not automatically included in short plans. All attraction times are flexible planning allowances, never live wait times.</p><div class="row"><button class="btn" onclick="ddGenerate()">✨ Generate My Day</button>${generated?'<button class="btn secondary" onclick="ddGenerate()">🔀 Mix It Up!</button>':''}</div></div>${generated?itineraryBody(generated,false):''}`}
function shuffled(a){let out=[...a];for(let i=out.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function build(){let dest=config.destination;if(dest==='surprise')dest=pick(destinations);if(dest==='combo')dest=pick(parks);let combo=config.destination==='combo';let cap=config.duration==='short'?165:config.duration==='medium'?315:450;let effective=combo?cap-105:cap;let available=placeData[dest];let chosen=[];let used=0;let types=new Set(config.interests);types.add(config.priority);let budget=config.energy==='low'?Math.min(effective,190):effective;
// Select an ordered route, choosing varied stops without geographic backtracking.
let areaNames=[...new Set(available.map(x=>x.area))];let allowedAreas=dest==='EPCOT'?pick([areaNames.slice(0,5),areaNames.slice(0,3).concat(areaNames.slice(-2))]):areaNames;
let candidates=available.filter(x=>allowedAreas.includes(x.area)&&types.has(x.type));
let must=candidates.filter(x=>x.type===config.priority);if(must.length)chosen.push(pick(must));
let typesWanted=shuffled(config.interests.filter(x=>x!==config.priority));for(let type of typesWanted){let opts=candidates.filter(x=>x.type===type&&!chosen.includes(x));if(opts.length)chosen.push(pick(opts))}
let remaining=shuffled(candidates.filter(x=>!chosen.includes(x)));for(let x of remaining){if(used+chosen.reduce((s,y)=>s+y.minutes,0)+x.minutes>budget-45)continue;if(config.energy==='low'&&chosen.length>=4)break;if(chosen.length>= (config.duration==='full'?10:config.duration==='short'?4:7))break;chosen.push(x)}
chosen.sort((a,b)=>available.indexOf(a)-available.indexOf(b));let steps=[];let minutes=0;for(let i=0;i<chosen.length;i++){let x=chosen[i];steps.push({id:newId(),name:x.name,area:x.area,type:x.type,minutes:x.minutes,done:false});minutes+=x.minutes;if(i===1||i===4){steps.push({id:newId(),name:'Sit, hydrate and recharge',area:x.area,type:'break',minutes:15,done:false});minutes+=15}}
if(combo){steps.push({id:newId(),name:'Return to car and drive to Disney Springs',area:'Transfer',type:'transfer',minutes:50,done:false});let springs=placeData['Disney Springs'];let pin=springs.find(x=>x.type==='pins');let snack=springs.find(x=>x.type==='snacks');let shop=springs.find(x=>x.type==='shopping');let springStops=shuffled([pin,snack,shop]).slice(0,2).sort((a,b)=>springs.indexOf(a)-springs.indexOf(b));for(let x of springStops){steps.push({id:newId(),name:x.name,area:'Disney Springs · '+x.area,type:x.type,minutes:x.minutes,done:false})}}
let previous=state().history.slice(-4).map(x=>x.signature);let signature=dest+'|'+steps.filter(x=>!['break','transfer'].includes(x.type)).map(x=>x.name).join('|');return {id:newId(),name:pick(['A Little Disney Magic','The Great Disney Escape','Snacks, Pins & Pixie Dust','A Day of Disney Wonder','My Magical Adventure']),destination:dest+(combo?' + Disney Springs':''),who:config.who,energy:config.energy,duration:config.duration,priority:config.priority,interests:[...config.interests],steps,created:new Date().toISOString(),signature};}
window.ddGenerate=function(){let s=state(),result;for(let i=0;i<12;i++){result=build();if(!s.history.slice(-5).some(x=>x.signature===result.signature))break}s.history.push({signature:result.signature,created:result.created});if(s.history.length>30)s.history.shift();generated=result;s.current=result;persist();ddTab('generator')};
function itineraryBody(it,saved){let total=it.steps.length,done=it.steps.filter(x=>x.done).length;let label=it.who==='mom'?'Mom':it.who==='nicholas'?'Nicholas':'Both';let id=safe(it.id);return `<div class="panel"><div class="tag">${safe(it.destination)} · ${safe(label)} · ${safe(it.energy)} energy</div><h3>✨ ${safe(it.name)}</h3><p class="note">${done}/${total} stops completed · Your #1 priority: ${safe(interests.find(x=>x[0]===it.priority)?.[1]||it.priority)}. Timing is approximate, including ride allowances; check the Disney app for current hours and queues.</p><div class="row"><button class="btn secondary mini" onclick="ddSave('${id}')">❤️ ${saved?'Save a copy':'Save this daydream'}</button><button class="btn secondary mini" onclick="ddRename('${id}')">✏️ Rename</button>${!saved?'<button class="btn secondary mini" onclick="ddGenerate()">🔀 Mix It Up!</button>':''}</div></div><div class="panel"><h3>🗺️ Your route</h3>${it.steps.map((x,i)=>`<div class="check"><input type="checkbox" id="dd-${safe(x.id)}" ${x.done?'checked':''} onchange="ddCheck('${id}','${safe(x.id)}',this.checked)"><label for="dd-${safe(x.id)}"><strong>${x.type==='break'?'🌸 ':x.type==='transfer'?'🚗 ':''}${safe(x.name)}</strong><div class="tiny">${safe(x.area)} · allow about ${x.minutes} min ${x.type==='rides'?'(not a live wait estimate)':''}</div></label></div>`).join('')}<p class="note">The route is ordered by area. If an attraction’s actual wait is too long, skip it or regenerate; ride completion is never assumed.</p></div>`}
function findIt(id){if(generated?.id===id)return generated;return state().saved.find(x=>x.id===id)}
window.ddCheck=function(itId,stepId,on){let it=findIt(itId);if(!it)return;let step=it.steps.find(x=>x.id===stepId);if(step)step.done=on;persist();ddTab(routeTab)};
window.ddRename=function(id){let it=findIt(id);if(!it)return;let name=prompt('Name this Disney daydream',it.name);if(name===null||!name.trim())return;it.name=name.trim().slice(0,90);persist();ddTab(routeTab)};
window.ddSave=function(id){let it=findIt(id);if(!it)return;let clone=JSON.parse(JSON.stringify(it));clone.id=newId();clone.steps.forEach(x=>x.id=newId());let name=prompt('Save this itinerary as:',clone.name);if(name===null)return;clone.name=name.trim()||clone.name;state().saved.push(clone);persist();alert('Saved to ❤️ Saved Daydreams!');ddTab(routeTab)};
window.ddDelete=function(id){if(!confirm('Delete this saved daydream?'))return;state().saved=state().saved.filter(x=>x.id!==id);persist();ddTab('saved')};
window.ddOpenSaved=function(id){viewSaved=id;ddTab('saved')};
function savedBody(){let a=state().saved;return `<div class="panel"><h3>❤️ Saved Daydreams</h3><p>Reopen a favorite anytime. Saved itineraries are included in your existing JSON backup.</p>${a.length?a.map(x=>`<div class="foodcard"><strong>${safe(x.name)}</strong><div class="tiny">${safe(x.destination)} · ${safe(x.who)} · ${x.steps.length} stops</div><div class="row"><button class="btn secondary mini" onclick="ddOpenSaved('${safe(x.id)}')">Open</button><button class="btn secondary mini" onclick="ddReuse('${safe(x.id)}')">Reuse as new</button><button class="btn danger mini" onclick="ddDelete('${safe(x.id)}')">Delete</button></div></div>`).join(''):'<p class="note">No saved daydreams yet. Generate one and tap Save!</p>'}</div>${viewSaved&&a.length?itineraryBody(a.find(x=>x.id===viewSaved)||a[0],true):''}`}
window.ddReuse=function(id){let src=state().saved.find(x=>x.id===id);if(!src)return;generated=JSON.parse(JSON.stringify(src));generated.id=newId();generated.steps.forEach(x=>{x.id=newId();x.done=false});state().current=generated;persist();routeTab='generator';openSection('routes')};
// Restore a generated itinerary after reload; do not overwrite any existing section data.
generated=state().current||null;
renderHome();
})();
