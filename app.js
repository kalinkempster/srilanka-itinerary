/* Sri Lanka trip site: map, day-by-day plan, budget tracker and checklist. No build step. */
"use strict";
(function(){
const K=120, LON0=79.45, LAT0=10.0, PAD=12;
const P=(lat,lon)=>[((lon-LON0)*K+PAD).toFixed(1),((LAT0-lat)*K+PAD).toFixed(1)];

const coast=[[9.83,80.25],[9.75,80.05],[9.66,79.95],[9.52,80.08],[9.35,80.05],[9.05,79.93],[8.95,79.92],[8.6,79.92],[8.3,79.82],[8.03,79.83],[7.57,79.79],[7.21,79.83],[6.93,79.85],[6.58,79.96],[6.42,80.0],[6.2,80.07],[6.03,80.22],[5.95,80.45],[5.92,80.59],[6.02,80.79],[6.12,81.12],[6.25,81.3],[6.37,81.52],[6.55,81.75],[6.88,81.83],[7.3,81.85],[7.72,81.7],[8.15,81.43],[8.57,81.23],[8.95,80.95],[9.27,80.82],[9.55,80.55],[9.75,80.38]];

const stops=[
 {id:"neg",name:"Negombo",lat:7.21,lon:79.86,dx:16,dy:18,anchor:"start",nights:"1 night",dates:"05/12",
  intro:"JQ5 lands in the evening, so you sleep near the airport instead of driving 4–5 hours in the dark.",
  hotel:{name:"Airport-area hotel in Negombo",price:"~A$150–200",note:"Estimate. Pick one with a free airport pick-up and a pool for the next morning. About 20 minutes from CMB."},
  acts:["Jetstar JQ5 departs Melbourne 1:00pm Saturday 05/12","Hotel pick-up from arrivals","Dinner and sleep"],
  tip:"Have the ETA approval and the hotel's address on your phone before you land."},
 {id:"sig",name:"Sigiriya",lat:7.957,lon:80.76,dx:-16,dy:5,anchor:"end",nights:"3 nights",dates:"06–08/12",
  intro:"The Cultural Triangle, with Lara's three nights kept. Two climbs, a cooking class and an elephant safari, with pool time in the heat of the day.",
  hotel:{name:"Kumbukgaha Villa or Aliya Resort & Spa",price:"~A$230–280",note:"Both have pools. From about US$150–159 a night in shoulder season; expect more in December. Jetwing Vil Uyana (~A$570) is the splurge option."},
  acts:["Elephant jeep safari at Hurulu or Kaudulla on arrival afternoon","Sigiriya Lion Rock at 7am (US$35 pp)","Village cooking class and lunch","Pidurangala sunrise, looking across to Sigiriya","Optional: cycle the Polonnaruwa ruins","Dambulla cave temple on the way out"],
  tip:"The driver collects you from Negombo on 06/12 and stays with you until the coast."},
 {id:"ell",name:"Ella",lat:6.866,lon:81.046,dx:14,dy:5,anchor:"start",nights:"2 nights",dates:"09–10/12",
  intro:"Cut to two nights. You arrive by train, get one full day for the big sights, and see Ravana Falls on the way out.",
  hotel:{name:"Mountain-view boutique hotel with a pool",price:"~A$250–350",note:"Estimate. Options with pools and views include Morning Dew Boutique (rooftop infinity pool) and Mountain Heavens. 98 Acres (~A$700+) is the splurge."},
  acts:["Train from Haputale into Ella","Little Adam's Peak at sunrise","Nine Arches Bridge as a train passes","Tea factory tour","Ella Rock instead, if you'd rather do one big hike","Ravana Falls on the drive south"],
  tip:"With one full day, pick either Little Adam's Peak plus Nine Arches, or Ella Rock. Doing both is a long day."},
 {id:"wel",name:"Weligama · Mirissa",lat:5.975,lon:80.44,dx:0,dy:-18,anchor:"middle",nights:"6 nights",dates:"11–16/12",
  intro:"One beach base for the last six nights, with Galle as a day trip. Six nights in one place leaves plenty of unscheduled time.",
  hotel:{name:"Boutique hotel in Weligama or Mirissa",price:"~A$200–230",note:"Estimate, not a verified rate. Skip the Weligama Marriott: it averages around US$722 a night in December."},
  acts:["Whale watching from Mirissa (US$60 pp), with a buffer day","Beginner surf lesson on Weligama Bay","Galle Fort day trip, with Jungle Beach snorkelling","Hiriketiya Bay day","Coconut Tree Hill sunset, Secret Beach","A full free day at the end"],
  tip:"JQ6 leaves at 7:55pm on 17/12. Leave Weligama by about 2pm for the 2.5-hour expressway run."}
];
const pois=[
 {name:"Dambulla",lat:7.856,lon:80.649,dx:-7,dy:16,anchor:"end"},
 {name:"Kandy",lat:7.29,lon:80.633,dx:-7,dy:4,anchor:"end"},
 {name:"Haputale",lat:6.768,lon:80.958,dx:-7,dy:4,anchor:"end"},
 {name:"Ravana Falls",lat:6.83,lon:81.05,dx:7,dy:14},
 {name:"Hurulu",lat:8.22,lon:80.86,dx:7,dy:4},
 {name:"Polonnaruwa",lat:7.94,lon:81.0,dx:7,dy:4},
 {name:"Galle",lat:6.03,lon:80.217,dx:-7,dy:4,anchor:"end"},
 {name:"Hiriketiya",lat:5.965,lon:80.71,dx:6,dy:12}
];

const segs=[
 {a:"neg",b:"sig",mode:"road",via:[[7.6,80.3]]},
 {a:"sig",b:[6.768,80.958],mode:"road",via:[[7.856,80.649],[7.29,80.633],[6.97,80.77]]},
 {a:"sig",b:[8.22,80.86],mode:"alt",via:[[8.1,80.82]]},
 {a:"sig",b:[7.94,81.0],mode:"alt",via:[[7.96,80.88]]},
 {a:[6.768,80.958],b:"ell",mode:"trip",via:[[6.82,81.0]]},
 {a:"ell",b:"wel",mode:"road",via:[[6.83,81.05],[6.47,80.9],[6.1,80.6]]},
 {a:"wel",b:[6.03,80.217],mode:"alt",via:[[5.99,80.33]]},
 {a:"wel",b:[5.965,80.71],mode:"alt",via:[[5.95,80.58]]},
 {a:"wel",b:"neg",mode:"road",via:[[6.5,80.1],[6.95,79.95]]}
];

const days=[
 {d:"05/12",w:"Fly JQ5 MEL → CMB, night in Negombo",b:"Negombo",base:"neg",scene:"flight",img:"images/negombo.jpg",cap:"Negombo beach, a short hop from the airport",
  lede:"Booked. Colombo runs 5½ hours behind Melbourne in December, so JQ5 lands in the evening local time.",
  slots:[["1:00pm","JQ5 departs Melbourne","Saturday 05/12. Check your booking for the exact landing time"],["Evening","Land at CMB, immigration with your ETA","Have the approval email on your phone"],["+20 min","Hotel pick-up to Negombo",""],["Night","Dinner and sleep","Driver collects you in the morning"]],
  photos:[["Negombo beach","Negombo beach Sri Lanka"]]},
 {d:"06/12",w:"Drive to Sigiriya, afternoon elephant safari",b:"Sigiriya",base:"sig",scene:"elephant",img:"images/elephant.jpg",imgPos:"50% 55%",cap:"A tusker in the grasslands. Elephants gather at Hurulu or Kaudulla in December",
  lede:"A proper night's sleep, then north into the Cultural Triangle in time for an afternoon safari.",
  slots:[["8:30","Driver pick-up in Negombo","About 4 hours to Sigiriya"],["12:30","Check in, lunch",""],["15:00","Jeep safari at Hurulu or Kaudulla","Your driver or hotel will know which park the herds are in"],["Evening","Dinner at the hotel",""]],
  photos:[["Hurulu elephants","Hurulu Eco Park elephants"],["Kaudulla elephants","Kaudulla National Park elephants"]]},
 {d:"07/12",w:"Sigiriya Lion Rock, village cooking class",b:"Sigiriya",base:"sig",scene:"rock",img:"images/lion-rock.jpg",imgPos:"50% 38%",cap:"Sigiriya from above: the palace terraces and pools on the summit",
  lede:"The big climb first thing, then a long lunch you cook yourselves.",
  slots:[["7:00","Climb Sigiriya Rock (US$35 pp)","Water gardens, the frescoes, the Lion's Paws, then the summit. About 2–3 hours"],["11:00","Village cooking class and lunch","Curries, coconut sambol and roti, cooked in a village kitchen"],["14:00","Pool and rest","The middle of the day is very hot"],["Evening","Dinner at the hotel",""]],
  photos:[["Sigiriya Rock","Sigiriya Lion Rock"],["Lion's Paws","Sigiriya lion paws staircase"]]},
 {d:"08/12",w:"Pidurangala sunrise, slow day or Polonnaruwa",b:"Sigiriya",base:"sig",scene:"temple",img:"images/pidurangala.jpg",cap:"Pidurangala: the best view of Sigiriya, at dawn",
  lede:"Sunrise on Pidurangala with Sigiriya in front of you. The rest of the day is yours.",
  slots:[["5:00","Pidurangala Rock for sunrise","Short scramble at the top. Shoulders covered at the temple near the start"],["8:00","Breakfast back at the hotel",""],["Option","Cycle the Polonnaruwa ruins","About an hour's drive. Go mid-morning, back for a late lunch"],["Afternoon","Pool or a massage",""],["Evening","Dinner at a local restaurant",""]],
  photos:[["Pidurangala sunrise","Pidurangala Rock sunrise view Sigiriya"],["Polonnaruwa","Polonnaruwa ancient city"]]},
 {d:"09/12",w:"Dambulla caves, tea country, train into Ella",b:"Ella",base:"ell",scene:"temple",img:"images/dambulla.jpg",cap:"Dambulla: five cave shrines full of painted Buddhas",
  lede:"The long transfer day, broken up with a cave temple, tea country, and the best section of the railway.",
  slots:[["7:30","Check out","Ask the hotel for a packed breakfast"],["8:00","Dambulla Cave Temple","About an hour. Cover shoulders and knees; shoes off"],["Midday","Drive through the hills via Kandy","Lunch with a tea-estate view near Ramboda"],["Afternoon","Train from Haputale to Ella","About an hour on the best stretch. If the timetable doesn't fit, the driver goes straight to Ella"],["Evening","Check in at Ella",""]],
  photos:[["Dambulla Cave Temple","Dambulla Cave Temple"],["Haputale train","Haputale Ella train"]]},
 {d:"10/12",w:"Little Adam's Peak, Nine Arches, tea factory",b:"Ella",base:"ell",scene:"bridge",img:"images/nine-arches.jpg",cap:"Nine Arches Bridge at Demodara, built in 1921",
  lede:"Your one full day in Ella. The two famous walks in the morning, then tea. If you'd rather do one big hike, swap the morning for Ella Rock (3–5 h with a guide).",
  slots:[["6:00","Little Adam's Peak for sunrise","About 45 minutes up an easy path"],["9:00","Nine Arches Bridge","Ask the hotel when the next train passes"],["12:00","Lunch in Ella town",""],["14:30","Tea factory tour","Uva Halpewatte, about 20 minutes from town"],["Evening","Sunset drinks over the valley",""]],
  photos:[["Nine Arches Bridge","Nine Arches Bridge Ella"],["Little Adam's Peak","Little Adam's Peak Ella"]]},
 {d:"11/12",w:"Ravana Falls, drive down to the coast",b:"Weligama",base:"wel",scene:"beach",img:"images/ravana-falls.jpg",cap:"Ravana Falls, ten minutes out of Ella",
  lede:"Downhill to the beach, with a waterfall stop just out of Ella. The driver's last day with you.",
  slots:[["9:00","Check out, Ravana Falls","10 minutes down the road"],["9:30","Drive south","About 4 hours with stops"],["14:00","Check in, swim",""],["17:00","Coconut Tree Hill for sunset",""],["Evening","Seafood dinner on Mirissa beach",""]],
  photos:[["Ravana Falls","Ravana Falls Ella"],["Coconut Tree Hill","Coconut Tree Hill Mirissa"]]},
 {d:"12/12",w:"Whale watching from Mirissa",b:"Weligama",base:"wel",scene:"whale",img:"images/mirissa.jpg",cap:"Secret Beach, Mirissa: the afternoon swim after the whale boat",
  lede:"Lara's plan had whales as optional. In December they're one of the best things you can do in Sri Lanka, so they're in.",
  slots:[["6:00","Pick-up to Mirissa harbour",""],["6:30","Whale-watching boat (US$60 pp)","About 4–5 hours. Choose an operator that keeps its distance from the whales"],["12:00","Lunch and a nap",""],["15:00","Secret Beach","Small cove, good for a swim"]],
  photos:[["Blue whales Mirissa","Mirissa blue whale watching"],["Secret Beach","Secret Beach Mirissa"]]},
 {d:"13/12",w:"Surf lesson in Weligama, whale-boat buffer",b:"Weligama",base:"wel",scene:"surf",img:"images/weligama.jpg",cap:"Sunset on Weligama beach, home for the last six nights",
  lede:"Your first surf. If yesterday's boat was cancelled for rough seas, it moves to this morning.",
  slots:[["Morning","Backup whale-boat slot","Only if 12/12 was cancelled"],["9:00","Two-hour beginner surf lesson","Board, rash vest and instructor included at most schools"],["12:00","Lunch at a Weligama café",""],["Afternoon","Beach and pool",""]],
  photos:[["Weligama surf","Weligama beach surf"]]},
 {d:"14/12",w:"Galle Fort day trip",b:"Weligama",base:"wel",scene:"fort",img:"images/jungle-beach.jpg",cap:"Jungle Beach, where the Galle day starts",
  lede:"About an hour west. Snorkel in the morning, then the fort in the afternoon light.",
  slots:[["8:30","Drive to Jungle Beach","About 50 minutes"],["9:30","Snorkel and swim","Water shoes help"],["12:30","Lunch inside the fort","Then galleries, design shops, Pedlar and Church Streets"],["16:30","Ramparts walk to the lighthouse and Flag Rock","Stay for sunset"],["19:00","Dinner in the fort, drive back",""]],
  photos:[["Galle Fort","Galle Fort ramparts"],["Jungle Beach","Jungle Beach Unawatuna"]]},
 {d:"15/12",w:"Hiriketiya Bay day",b:"Weligama",base:"wel",scene:"beach",img:"images/hiriketiya.jpg",imgPos:"50% 35%",cap:"Hiriketiya: a horseshoe bay 40 minutes east",
  lede:"A different beach for a day, with good cafés and a gentle break if you want another surf.",
  slots:[["9:30","Tuk-tuk or taxi to Hiriketiya","About 40 minutes"],["10:30","Swim, or a second surf","Board hire on the beach"],["13:00","Lunch in the bay",""],["16:00","Back to Weligama, massage",""]],
  photos:[["Hiriketiya Bay","Hiriketiya Bay"]]},
 {d:"16/12",w:"Free final beach day",b:"Weligama",base:"wel",scene:"cooking",img:"images/coconut-tree-hill.jpg",cap:"Coconut Tree Hill, Mirissa: worth a second visit on the free day",
  lede:"Kept free, as Lara's plan suggested. Go back to whatever you liked most.",
  slots:[["Morning","Slow breakfast, beach walk",""],["Afternoon","Pool, souvenir shopping",""],["Evening","Special farewell dinner by the water","Book ahead"]],
  photos:[["Mirissa sunset","Mirissa beach sunset"]]},
 {d:"17/12",w:"Lazy morning, JQ6 home at 7:55pm",b:"Depart",base:"wel",scene:"flight",cap:"Jetstar JQ6, Colombo to Melbourne",
  lede:"No rush. Arrange a late check-out if you can.",
  slots:[["Morning","Swim, pack, long breakfast",""],["13:00","Lunch",""],["14:00","Drive to CMB","About 2.5 hours on the expressway, plus a traffic buffer"],["4:55pm","Check in for JQ6","3 hours before departure. Spend your rupees before security"],["7:55pm","JQ6 departs Colombo","Overnight to Melbourne"]],
  photos:[["Colombo airport","Bandaranaike International Airport"]]},
 {d:"18/12",w:"Land in Melbourne",b:"Home",base:"neg",scene:"home",cap:"Home again",
  lede:"Back in time for Christmas.",
  slots:[["Morning","JQ6 lands at Tullamarine","Allow a recovery day before work if the roster allows"]],
  photos:[]}
];



const checks=[["Flights: JQ5 out 05/12, JQ6 home 17/12","Done"],["Negombo airport hotel for 05/12","Now"],["Sigiriya, Ella and Weligama/Mirissa hotels","Now"],["Both ETAs at eta.gov.lk","Now"],["Driver for 06–11/12 plus airport transfer on 17/12","October"],["Whale boat (12/12) and surf lesson (13/12)","November"],["Check the Haputale → Ella train time for 09/12","Early Nov"]];

const NS="http://www.w3.org/2000/svg", svg=document.getElementById("map");
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e};
const byId=Object.fromEntries(stops.map(s=>[s.id,s]));
const ll=x=>typeof x==="string"?[byId[x].lat,byId[x].lon]:x;

el("polygon",{points:coast.map(c=>P(c[0],c[1]).join(",")).join(" "),fill:"var(--land)",stroke:"var(--land-edge)","stroke-width":1.5,"stroke-linejoin":"round"});
const sea=P(6.0,81.3);const st=el("text",{x:sea[0],y:sea[1],"font-size":13,"font-style":"italic",fill:"var(--muted)","font-family":"var(--f-display)"});st.textContent="Indian Ocean";

const segEls=segs.map(s=>{const pts=[ll(s.a),...s.via,ll(s.b)].map(c=>P(c[0],c[1]));
  let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=1;i<pts.length;i++){const m=pts[i-1],n=pts[i];d+=` Q${m[0]},${m[1]} ${((+m[0]+ +n[0])/2).toFixed(1)},${((+m[1]+ +n[1])/2).toFixed(1)}`}
  const l=pts[pts.length-1];d+=` T${l[0]},${l[1]}`;
  return Object.assign(el("path",{d,class:"seg "+s.mode}),{_s:s})});

pois.forEach(p=>{const g=el("g",{class:"poi"});const [x,y]=P(p.lat,p.lon);el("circle",{cx:x,cy:y,r:3},g);const t=el("text",{x:+x+p.dx,y:+y+p.dy,"text-anchor":p.anchor||"start","font-size":11},g);t.textContent=p.name;});

const stopEls={};
stops.forEach((s,i)=>{const [x,y]=P(s.lat,s.lon);const g=el("g",{class:"stop",tabindex:0,role:"button","aria-label":`${s.name}, ${s.dates}`});
  el("circle",{class:"dot",cx:x,cy:y,r:11},g);
  const n=el("text",{class:"num",x,y:+y+4,"text-anchor":"middle","font-size":12},g);n.textContent=i+1;
  const t=el("text",{x:+x+s.dx,y:+y+s.dy,"text-anchor":s.anchor,"font-size":14},g);t.textContent=s.name;
  g.addEventListener("click",()=>select(s.id));
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(s.id)}});
  stopEls[s.id]=g;});

let gid=0;
const F=v=>`style="fill:var(--${v})"`;
const skyGrad=(a,b)=>{const id="g"+(++gid);return {id,def:`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--${a})"/><stop offset="1" style="stop-color:var(--${b})"/></linearGradient></defs><rect width="320" height="140" fill="url(#${id})"/>`}};
const palm=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C 4 -20 2 -45 10 -70" style="fill:none;stroke:var(--silh);stroke-width:3.5;stroke-linecap:round"/><g ${F("leaf2")}><path d="M10 -70 C 25 -78 38 -72 46 -62 C 34 -68 22 -68 10 -70Z"/><path d="M10 -70 C 0 -82 -16 -82 -26 -72 C -12 -74 -2 -72 10 -70Z"/><path d="M10 -70 C 20 -88 34 -92 42 -88 C 30 -84 20 -78 10 -70Z"/><path d="M10 -70 C 4 -90 -8 -96 -16 -94 C -6 -86 2 -78 10 -70Z"/><path d="M10 -70 C 22 -66 30 -54 32 -44 C 24 -54 18 -62 10 -70Z"/></g></g>`;
const SCENES={
 rock:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="270" cy="40" r="15" ${F("sun")}/><path d="M0 104 Q160 94 320 104 V140 H0Z" ${F("leaf")}/><path d="M104 108 C104 80 110 52 122 34 L198 30 C212 46 218 78 220 108Z" ${F("wall")}/><path d="M122 34 L198 30" style="fill:none;stroke:var(--silh);stroke-width:1.5;opacity:.4"/><path d="M130 108 C132 84 136 62 142 46" style="fill:none;stroke:var(--silh);stroke-width:1.2;opacity:.25"/><path d="M150 108 L152 96 L158 92 L164 96 L166 108Z" ${F("silh")} opacity=".55"/><g ${F("water")}><rect x="40" y="116" width="44" height="6" rx="2"/><rect x="236" y="116" width="44" height="6" rx="2"/><rect x="124" y="122" width="72" height="6" rx="2"/></g>${palm(30,138,.6)}${palm(296,140,.65)}<g ${F("leaf2")}><ellipse cx="80" cy="104" rx="26" ry="9"/><ellipse cx="250" cy="104" rx="30" ry="9"/></g>`},
 bridge:()=>{const g=skyGrad("sky","sky2");let arches="";for(let i=0;i<9;i++){const x=38+i*28;arches+=`<path d="M${x} 118 L${x} 92 Q${x+12} 74 ${x+24} 92 L${x+24} 118" style="fill:var(--leaf2)"/>`;}return g.def+`<path d="M0 66 Q60 40 140 56 T320 44 V140 H0Z" ${F("leaf")} opacity=".7"/><path d="M0 92 Q80 70 160 86 T320 80 V140 H0Z" ${F("leaf")}/><rect x="28" y="66" width="270" height="56" ${F("wall")}/>${arches}<rect x="24" y="62" width="278" height="6" ${F("silh")} opacity=".6"/><g transform="translate(70 46)"><rect x="0" y="0" width="56" height="14" rx="3" ${F("flag")}/><rect x="60" y="0" width="52" height="14" rx="2" ${F("water2")}/><rect x="116" y="0" width="52" height="14" rx="2" ${F("water2")}/><g ${F("white")}><rect x="8" y="4" width="8" height="5"/><rect x="66" y="4" width="10" height="5"/><rect x="82" y="4" width="10" height="5"/><rect x="122" y="4" width="10" height="5"/><rect x="138" y="4" width="10" height="5"/></g></g>`},
 hills:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="60" cy="40" r="14" ${F("sun")}/><path d="M0 140 L0 90 L70 50 L120 78 L170 30 L210 60 L250 40 L320 84 L320 140Z" ${F("leaf2")} opacity=".55"/><path d="M0 140 L0 110 L60 86 L110 100 L180 62 L230 94 L280 80 L320 100 L320 140Z" ${F("leaf")}/><g ${F("white")} opacity=".7"><ellipse cx="100" cy="96" rx="60" ry="6"/><ellipse cx="250" cy="104" rx="50" ry="5"/></g><g transform="translate(170 20)" style="stroke:var(--silh);stroke-width:2.6;stroke-linecap:round;fill:none"><path d="M0 0 L0 -12 M0 -10 L-6 -4 M0 -10 L7 -16 M0 0 L-5 9 M0 0 L5 9"/></g><circle cx="170" cy="3" r="3" ${F("silh")}/>`},
 flight:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="250" cy="100" r="26" ${F("sun")} opacity=".85"/><g ${F("white")} opacity=".9"><ellipse cx="70" cy="95" rx="40" ry="10"/><ellipse cx="95" cy="88" rx="26" ry="10"/><ellipse cx="200" cy="40" rx="34" ry="8"/><ellipse cx="222" cy="35" rx="20" ry="8"/></g><g transform="translate(118 52) rotate(-12)" ${F("silh")}><path d="M0 8 L70 4 Q82 4 84 8 Q82 12 70 12 L0 10Z"/><path d="M34 8 L20 -14 L28 -14 L52 8Z"/><path d="M34 10 L22 30 L30 30 L52 10Z"/><path d="M2 8 L-6 -4 L2 -4 L10 8Z"/></g><path d="M40 70 Q100 60 120 64" style="fill:none;stroke:var(--white);stroke-width:2;stroke-dasharray:4 5"/>`},
 home:()=>SCENES.flight(),
 fort:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="60" cy="58" r="16" ${F("sun")}/><rect y="96" width="320" height="44" ${F("water")}/><path d="M0 112 Q40 108 80 112 T160 112 T240 112 T320 112 V140 H0Z" ${F("water2")}/><path d="M0 98 L150 98 L170 88 L320 88 L320 118 L180 118 L160 126 L0 126Z" ${F("wall")}/><path d="M0 98 L150 98 L170 88 L320 88" style="fill:none;stroke:var(--silh);stroke-width:1.2;opacity:.35"/><g ${F("white")}><path d="M228 88 L232 30 L248 30 L252 88Z"/><rect x="227" y="22" width="26" height="8"/></g><rect x="231" y="10" width="18" height="12" ${F("silh")} opacity=".8"/><path d="M226 10 L240 2 L254 10Z" ${F("flag")}/><rect x="229" y="50" width="22" height="5" ${F("flag")}/><g ${F("white")} opacity=".9"><rect x="270" y="72" width="22" height="16"/><rect x="296" y="66" width="18" height="22"/><path d="M268 72 L281 64 L294 72Z" ${F("flag")}/></g>${palm(196,90,.55)}`},
 beach:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="210" cy="70" r="20" ${F("sun")}/><rect y="78" width="320" height="30" ${F("water")}/><path d="M0 92 Q40 88 80 92 T160 92 T240 92 T320 92 V108 H0Z" ${F("water2")} opacity=".6"/><path d="M0 104 Q80 96 160 104 T320 100 V140 H0Z" ${F("sand")}/><path d="M0 104 Q80 96 160 104 T320 100" style="fill:none;stroke:var(--white);stroke-width:2;opacity:.8"/>${palm(60,136,1)}${palm(96,138,.75)}<g ${F("silh")} opacity=".8"><path d="M250 118 l26 0 l-4 4 l-18 0z"/><path d="M262 118 l0 -14 l10 6z"/></g>`},
 surf:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="270" cy="34" r="14" ${F("sun")}/><path d="M0 70 Q80 64 160 70 T320 70 V140 H0Z" ${F("water")}/><path d="M0 140 L0 104 Q60 100 110 86 Q160 70 196 54 Q230 42 244 56 Q252 66 238 70 Q222 64 214 76 Q200 104 320 108 V140Z" ${F("water2")}/><path d="M196 54 Q230 42 244 56 Q252 66 238 70" style="fill:none;stroke:var(--white);stroke-width:3;stroke-linecap:round"/><path d="M0 104 Q60 100 110 86" style="fill:none;stroke:var(--white);stroke-width:2;opacity:.7"/><g transform="translate(150 76) rotate(-14)"><ellipse cx="0" cy="0" rx="22" ry="3.2" ${F("flag")}/><g style="stroke:var(--silh);stroke-width:3;stroke-linecap:round;fill:none"><path d="M-6 -2 L-2 -12 L4 -2"/><path d="M-2 -12 L0 -24"/><path d="M0 -20 L-10 -16 M0 -20 L10 -24"/></g><circle cx="0" cy="-28" r="3.6" ${F("silh")}/></g>`},
 whale:()=>{const g=skyGrad("sky","sky2");return g.def+`<rect y="66" width="320" height="74" ${F("water")}/><path d="M0 92 Q40 88 80 92 T160 92 T240 92 T320 92 V140 H0Z" ${F("water2")}/><g ${F("silh")}><path d="M150 100 C150 86 148 78 140 66 C126 60 112 58 100 50 C118 52 134 52 146 58 L154 58 C166 52 182 52 200 50 C188 58 174 60 160 66 C152 78 150 86 150 100Z"/></g><path d="M118 100 Q150 94 182 100" style="fill:none;stroke:var(--white);stroke-width:2.2;opacity:.85"/><g ${F("white")} opacity=".9"><circle cx="128" cy="62" r="1.6"/><circle cx="172" cy="60" r="1.6"/><circle cx="160" cy="54" r="1.2"/></g><g transform="translate(250 60)"><path d="M-22 4 L22 4 L16 12 L-16 12Z" ${F("white")}/><rect x="-8" y="-6" width="14" height="10" ${F("white")}/><rect x="-2" y="-16" width="2" height="10" ${F("silh")}/></g>`},
 tea:()=>{const g=skyGrad("sky","sky2");const rows=(y,c)=>Array.from({length:6},(_,i)=>`<path d="M-10 ${y+i*9} Q80 ${y-10+i*9} 160 ${y+i*9} T330 ${y+i*9}" style="fill:none;stroke:var(--${c});stroke-width:3;stroke-dasharray:6 3;opacity:.7"/>`).join("");return g.def+`<circle cx="70" cy="40" r="14" ${F("sun")}/><path d="M0 70 Q60 40 140 58 T320 50 V140 H0Z" ${F("leaf")} opacity=".75"/><path d="M0 92 Q90 64 190 84 T320 76 V140 H0Z" ${F("leaf")}/>${rows(96,"leaf2")}<g ${F("white")}><rect x="236" y="60" width="44" height="18"/><path d="M232 60 L258 48 L284 60Z" ${F("flag")}/></g><g transform="translate(110 112)"><circle r="5" cy="-18" ${F("silh")}/><path d="M-7 0 L-4 -13 L4 -13 L7 0Z" ${F("flag")}/><path d="M2 -14 Q10 -22 6 -28 Q14 -24 10 -12Z" ${F("wall")}/></g>`},
 elephant:()=>{const g=skyGrad("sky2","sky2");return g.def+`<circle cx="250" cy="52" r="22" ${F("sun")}/><path d="M0 100 Q160 90 320 100 V140 H0Z" ${F("sand")}/><path d="M0 108 Q160 98 320 110 V140 H0Z" ${F("leaf")} opacity=".45"/><g ${F("silh")}><path d="M44 104 L46 70" style="stroke:var(--silh);stroke-width:4"/><ellipse cx="46" cy="66" rx="34" ry="8"/><ellipse cx="62" cy="60" rx="18" ry="5"/></g><g transform="translate(150 56)" ${F("silh")}><ellipse cx="30" cy="22" rx="34" ry="22"/><rect x="6" y="30" width="11" height="28" rx="3"/><rect x="22" y="34" width="11" height="24" rx="3"/><rect x="40" y="34" width="11" height="24" rx="3"/><rect x="54" y="30" width="11" height="28" rx="3"/><circle cx="68" cy="14" r="15"/><path d="M60 6 Q48 4 50 22 Q54 32 62 26Z" style="fill:var(--wall);opacity:.55"/><path d="M78 18 Q90 34 84 52 Q82 58 88 58" style="fill:none;stroke:var(--silh);stroke-width:6;stroke-linecap:round"/><path d="M-4 22 Q-10 30 -8 38" style="fill:none;stroke:var(--silh);stroke-width:2"/></g><g transform="translate(90 84) scale(.5)" ${F("silh")}><ellipse cx="30" cy="22" rx="34" ry="22"/><rect x="8" y="30" width="11" height="28" rx="3"/><rect x="48" y="30" width="11" height="28" rx="3"/><circle cx="66" cy="14" r="15"/><path d="M76 18 Q88 34 82 52" style="fill:none;stroke:var(--silh);stroke-width:6;stroke-linecap:round"/></g>`},
 safari:()=>{const g=skyGrad("sky","sky2");return g.def+`<circle cx="70" cy="76" r="30" ${F("sun")} opacity=".9"/><path d="M0 100 Q160 92 320 100 V140 H0Z" ${F("sand")}/><path d="M180 100 Q200 64 250 62 Q290 66 300 100Z" ${F("wall")}/><g transform="translate(222 52)" ${F("silh")}><path d="M0 10 Q10 2 26 4 Q40 4 46 10 L46 14 Q30 16 4 14Z"/><circle cx="52" cy="6" r="6"/><path d="M48 2 l2 -5 l3 4z M54 1 l3 -5 l2 5z"/><path d="M0 10 Q-14 6 -20 -6" style="fill:none;stroke:var(--silh);stroke-width:2.5;stroke-linecap:round"/><rect x="6" y="12" width="3" height="8"/><rect x="38" y="12" width="3" height="8"/></g><g transform="translate(40 92)" ${F("silh")}><rect x="0" y="0" width="78" height="20" rx="3"/><rect x="18" y="-16" width="44" height="16"/><rect x="22" y="-13" width="16" height="10" style="fill:var(--sky)"/><rect x="42" y="-13" width="16" height="10" style="fill:var(--sky)"/><circle cx="16" cy="22" r="8"/><circle cx="62" cy="22" r="8"/><circle cx="16" cy="22" r="3" ${F("wall")}/><circle cx="62" cy="22" r="3" ${F("wall")}/></g><g ${F("silh")}><path d="M150 102 L152 70" style="stroke:var(--silh);stroke-width:3.5"/><ellipse cx="152" cy="66" rx="26" ry="7"/></g>`},
 temple:()=>{const g=skyGrad("sky","sky2");return g.def+`<path d="M60 140 Q70 60 150 50 Q230 56 250 140Z" ${F("wall")}/><g ${F("white")} transform="translate(0 8)"><path d="M120 50 Q150 14 180 50Z"/><rect x="118" y="50" width="64" height="6"/><rect x="146" y="8" width="8" height="10"/><path d="M147 8 L150 -2 L153 8Z"/></g><rect x="138" y="88" width="34" height="18" rx="8" ${F("silh")} opacity=".7"/><path d="M0 140 Q60 112 120 126 Q180 112 320 130 V140Z" ${F("leaf")}/>${palm(270,138,.8)}`},
 turtle:()=>{const g=skyGrad("night","water2");const stars=[[30,20],[70,40],[110,16],[160,30],[220,14],[280,36],[300,12],[190,52],[50,60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.3" ${F("white")}/>`).join("");return g.def+stars+`<circle cx="250" cy="34" r="14" ${F("white")}/><circle cx="256" cy="30" r="12" style="fill:var(--night)"/><rect y="78" width="320" height="22" ${F("water2")}/><path d="M0 90 Q80 84 160 90 T320 88" style="fill:none;stroke:var(--white);stroke-width:1.5;opacity:.5"/><path d="M0 100 Q160 92 320 100 V140 H0Z" ${F("sand")} opacity=".8"/><path d="M30 104 C60 112 80 118 110 120" style="fill:none;stroke:var(--silh);stroke-width:3;stroke-dasharray:2 4;opacity:.5"/><g transform="translate(160 118)"><ellipse cx="0" cy="0" rx="30" ry="14" ${F("leaf2")}/><path d="M-18 -6 L0 -10 L18 -6 M-20 4 L0 8 L20 4 M0 -10 L0 8" style="fill:none;stroke:var(--sand);stroke-width:1.4;opacity:.7"/><ellipse cx="36" cy="-2" rx="8" ry="6" ${F("leaf2")}/><path d="M-18 8 Q-30 18 -40 14 Q-30 8 -22 4Z M18 8 Q30 18 40 16 Q30 8 22 4Z M-20 -8 Q-34 -16 -40 -10 Q-30 -6 -24 -4Z M20 -8 Q32 -18 40 -14 Q30 -6 24 -4Z" ${F("leaf2")}/></g>`},
 cooking:()=>{const g=skyGrad("sand","sky2");const bowl=(x,y,r,c)=>`<ellipse cx="${x}" cy="${y+2}" rx="${r+2}" ry="${r*.45}" ${F("silh")} opacity=".2"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.42}" ${F("white")}/><ellipse cx="${x}" cy="${y-1}" rx="${r*.82}" ry="${r*.3}" ${F(c)}/>`;return g.def+`<path d="M20 120 Q20 60 110 50 Q220 44 300 70 Q310 120 260 132 Q120 140 20 120Z" ${F("leaf")}/><path d="M30 112 Q150 70 290 76" style="fill:none;stroke:var(--leaf2);stroke-width:2"/><ellipse cx="160" cy="98" rx="52" ry="16" ${F("white")}/>${bowl(84,82,22,"sun")}${bowl(240,84,22,"flag")}${bowl(118,110,16,"leaf2")}${bowl(206,112,18,"wall")}<g ${F("white")}><circle cx="150" cy="94" r="3"/><circle cx="160" cy="97" r="3"/><circle cx="170" cy="93" r="3"/><circle cx="156" cy="100" r="3"/><circle cx="166" cy="102" r="3"/></g>`}
};

const dayBox=document.getElementById("days");
const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const dayEls=days.map((d,i)=>{
  const row=document.createElement("div");row.className="drow";
  const b=document.createElement("button");b.type="button";b.className="day";b.id="day-"+i;
  b.setAttribute("aria-expanded","false");b.setAttribute("aria-controls","xp-"+i);
  b.innerHTML=`<span class="d">${d.d}</span><span class="w">${esc(d.w)}</span><span class="b">${d.b}</span><span class="chev" aria-hidden="true">▶</span>`;
  const xp=document.createElement("div");xp.className="xp";xp.id="xp-"+i;xp.hidden=true;xp.setAttribute("role","region");xp.setAttribute("aria-labelledby","day-"+i);
  const links=d.photos.map(([l,q])=>`<a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}" target="_blank" rel="noopener">Photos: ${esc(l)} ↗</a>`).join("");
  const pic=d.img?`<img class="photo" src="${d.img}" alt="${esc(d.cap)}" style="object-position:${d.imgPos||"50% 50%"}" loading="lazy">`:`<svg viewBox="0 0 320 140" role="img" aria-label="${esc(d.cap)}">${SCENES[d.scene]()}</svg>`;
  xp.innerHTML=`<figure>${pic}<figcaption>${esc(d.cap)}</figcaption></figure>
    <div style="min-width:0"><div class="eyebrow">${d.d} · ${d.b}</div><h3>${esc(d.w)}</h3><p class="lede">${esc(d.lede)}</p>
    <div class="eyebrow howday">How the day goes</div><ul class="tl">${d.slots.map(([t,w,n])=>`<li><span class="t">${t}</span><span>${esc(w)}${n?`<span class="n">${esc(n)}</span>`:""}</span></li>`).join("")}</ul>
    ${links?`<div class="links">${links}</div>`:""}</div>`;
  b.addEventListener("click",()=>{const open=b.getAttribute("aria-expanded")==="true";openDay(open?-1:i);if(!open)select(d.base)});
  row.appendChild(b);row.appendChild(xp);dayBox.appendChild(row);return {b,xp};
});
function openDay(idx){dayEls.forEach(({b,xp},i)=>{const on=i===idx;b.setAttribute("aria-expanded",on);xp.hidden=!on})}

let current="gal";
function select(id,dayIdx){current=id;const s=byId[id];const idx=stops.indexOf(s);
  for(const k in stopEls)stopEls[k].classList.toggle("active",k===id);
  segEls.forEach(p=>p.classList.toggle("dim",!(p._s.a===id||p._s.b===id)));
  const h=`<div class="hotel"><div class="name">${s.hotel.name}</div><div class="price">${s.hotel.price}<span style="color:var(--muted);font-size:12px"> /night</span></div><div class="note">${s.hotel.note}</div></div>`;
  document.getElementById("dossier").innerHTML=`
    <div class="top"><div><div class="eyebrow">Base ${idx+1} of ${stops.length}</div><h3>${s.name}</h3></div><span class="chip mono">${s.dates} · ${s.nights}</span></div>
    <div>${s.intro}</div>
    <ul class="acts">${s.acts.map(a=>`<li>${a}</li>`).join("")}</ul>${h}
    <div class="tip">${s.tip}</div>`;
}
document.getElementById("prev").onclick=()=>{const i=stops.findIndex(s=>s.id===current);select(stops[(i-1+stops.length)%stops.length].id)};
document.getElementById("next").onclick=()=>{const i=stops.findIndex(s=>s.id===current);select(stops[(i+1)%stops.length].id)};

/* ---- budget tracker (saved in this browser) ---- */
const CAP=10000, EXP_KEY="sl-expenses-v1";
const cats=[["Flights",2584.02,2584.02],["Hotels",2540,3120],["Driver & transfers",870,1000],["Activities",650,800],["Food, drinks & spa",900,1100],["Insurance",150,200],["Other",0,0]];
const SEED=[{id:"flights-jq5-jq6",item:"Jetstar JQ5/JQ6 return, 2 adults",category:"Flights",amount:2584.02,status:"paid",date:"2026-10-12",note:"Plus 71,739 Qantas Points"}];
const fmt=n=>"A$"+Number(n).toLocaleString("en-AU",{minimumFractionDigits:0,maximumFractionDigits:0});
const fmt2=n=>"A$"+Number(n).toLocaleString("en-AU",{minimumFractionDigits:2,maximumFractionDigits:2});
const trk=document.getElementById("trkStatus");
const catSel=document.getElementById("tCat");
cats.forEach(([c])=>{const o=document.createElement("option");o.value=c;o.textContent=c;catSel.appendChild(o)});
document.getElementById("tDate").value=new Date().toISOString().slice(0,10);

let rows=null;
try{const raw=localStorage.getItem(EXP_KEY);if(raw)rows=JSON.parse(raw)}catch(e){}
if(!Array.isArray(rows))rows=SEED.slice();
function saveRows(){try{localStorage.setItem(EXP_KEY,JSON.stringify(rows));return true}catch(e){trk.textContent="This browser isn't saving data (private window?). Changes will be lost on reload.";return false}}

function renderTracker(){
  const by={};cats.forEach(([c])=>by[c]={com:0,quote:0});
  rows.forEach(r=>{const c=by[r.category]?r.category:"Other";if(r.status==="quote")by[c].quote+=+r.amount||0;else by[c].com+=+r.amount||0});
  let com=0,proj=0;const tb=document.getElementById("catRows");tb.innerHTML="";
  cats.forEach(([c,lo,hi])=>{const v=by[c];com+=v.com;const mid=(lo+hi)/2;proj+=Math.max(v.com+v.quote,mid);
    if(c==="Other"&&!v.com&&!v.quote)return;
    const top=Math.max(hi,v.com+v.quote,1);const over=v.com>hi&&hi>0;
    const tr=document.createElement("div");tr.className="crow";
    tr.innerHTML=`<span class="cn">${c}</span><span class="cp mono">${lo===hi?fmt(lo):fmt(lo)+"–"+fmt(hi).slice(2)}</span><div class="cbar"><span class="q" style="width:${Math.min((v.com+v.quote)/top*100,100)}%"></span><span class="c${over?" over":""}" style="width:${Math.min(v.com/top*100,100)}%"></span>${hi?`<i style="left:${Math.min(hi/top*100,100)}%"></i>`:""}</div><span class="cc mono">${v.com?fmt(v.com):"–"}</span>`;
    tb.appendChild(tr)});
  document.getElementById("sCom").textContent=fmt(com);
  document.getElementById("sProj").textContent=fmt(proj);
  const hdr=document.getElementById("hdrTotal");if(hdr)hdr.textContent="~"+fmt(proj);
  const left=CAP-proj;const sl=document.getElementById("sLeft");sl.textContent=(left<0?"−":"")+fmt(Math.abs(left));sl.className="v mono "+(left<0?"bad":"good");
  document.getElementById("capCom").style.width=Math.min(com/CAP*100,100)+"%";
  document.getElementById("capProj").style.width=Math.min(proj/CAP*100,100)+"%";
  const list=document.getElementById("exp");list.innerHTML="";
  const sorted=[...rows].sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  document.getElementById("expEmpty").hidden=sorted.length>0;
  sorted.forEach(r=>{const li=document.createElement("li");
    li.innerHTML=`<span class="ed mono"></span><span class="ei"><span class="t"></span><span class="n"></span></span><span class="chip st-${r.status}">${r.status==="quote"?"Quote":r.status==="booked"?"Booked":"Paid"}</span><span class="ea mono">${fmt2(r.amount)}</span>`;
    li.querySelector(".ed").textContent=(r.date||"").split("-").reverse().slice(0,2).join("/");
    li.querySelector(".t").textContent=r.item;li.querySelector(".n").textContent=r.category+(r.note?" · "+r.note:"");
    const del=document.createElement("button");del.type="button";del.className="del";del.textContent="Remove";
    del.addEventListener("click",()=>{if(del.dataset.armed!=="1"){del.dataset.armed="1";del.textContent="Confirm";setTimeout(()=>{del.dataset.armed="";del.textContent="Remove"},3000);return}
      rows=rows.filter(x=>x.id!==r.id);saveRows();renderTracker();trk.textContent="Removed."});
    li.appendChild(del);list.appendChild(li)});
}
renderTracker();

document.getElementById("tForm").addEventListener("submit",ev=>{ev.preventDefault();
  const item=document.getElementById("tItem").value.trim(),amount=parseFloat(document.getElementById("tAmt").value);
  if(!item||!(amount>0)){trk.textContent="Add a description and an amount above zero.";return}
  rows.push({id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),item,amount:Math.round(amount*100)/100,category:catSel.value,status:document.getElementById("tStatus").value,date:document.getElementById("tDate").value,note:document.getElementById("tNote").value.trim()});
  if(saveRows())trk.textContent="Added.";
  document.getElementById("tItem").value="";document.getElementById("tAmt").value="";document.getElementById("tNote").value="";
  renderTracker()});

/* export / import so two people can swap data */
document.getElementById("tExport").addEventListener("click",()=>{
  const data={expenses:rows,checklist:checkState(),custom:customItems,exported:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="sri-lanka-trip-data.json";document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);trk.textContent="Exported. Send the file to Lara so she can import it."});
document.getElementById("tImportFile").addEventListener("change",ev=>{const f=ev.target.files&&ev.target.files[0];if(!f)return;
  const rd=new FileReader();rd.onload=()=>{try{const d=JSON.parse(rd.result);
      if(!Array.isArray(d.expenses))throw new Error("no expenses");
      rows=d.expenses.filter(r=>r&&typeof r.item==="string"&&+r.amount>0).map(r=>({id:String(r.id||("e"+Math.random().toString(36).slice(2,9))),item:r.item,amount:+r.amount,category:String(r.category||"Other"),status:["paid","booked","quote"].includes(r.status)?r.status:"paid",date:String(r.date||""),note:String(r.note||"")}));
      saveRows();
      if(d.checklist&&typeof d.checklist==="object"){saved=d.checklist;try{localStorage.setItem(CHK_KEY,JSON.stringify(saved))}catch(e){}}
      if(Array.isArray(d.custom)){customItems=d.custom.filter(x=>typeof x==="string");try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(customItems))}catch(e){}}
      renderTracker();renderChecks();trk.textContent="Imported "+rows.length+" expenses."}
    catch(e){trk.textContent="That file isn't a trip data export. Choose the .json file from Export."}
    ev.target.value=""};rd.readAsText(f)});

/* ---- checklist (saved in this browser) ---- */
const CHK_KEY="sl-checks-v3", CUSTOM_KEY="sl-custom-v1";
let saved={};try{saved=JSON.parse(localStorage.getItem(CHK_KEY)||"{}")}catch(e){}
let customItems=[];try{customItems=JSON.parse(localStorage.getItem(CUSTOM_KEY)||"[]")}catch(e){}
const checkState=()=>saved;
const cb=document.getElementById("checks");
function renderChecks(){cb.innerHTML="";
  const all=checks.map(([t,w],i)=>({key:"b"+i,t,w})).concat(customItems.map((t,i)=>({key:"c"+i,t,w:"Added",custom:i})));
  all.forEach(({key,t,w,custom})=>{const l=document.createElement("label");
    const def=w==="Done";const on=(key in saved)?saved[key]:def;
    l.innerHTML=`<input type="checkbox" id="chk-${key}" ${on?"checked":""}><span><span class="tt"></span><span class="when">${w}</span></span>`;
    l.querySelector(".tt").textContent=t;
    l.querySelector("input").addEventListener("change",e=>{saved[key]=e.target.checked;try{localStorage.setItem(CHK_KEY,JSON.stringify(saved))}catch(err){}});
    if(custom!==undefined){const x=document.createElement("button");x.type="button";x.className="del";x.textContent="Remove";x.setAttribute("aria-label","Remove "+t);
      x.addEventListener("click",ev=>{ev.preventDefault();customItems.splice(custom,1);
        const ns={};Object.keys(saved).forEach(k=>{if(!k.startsWith("c"))ns[k]=saved[k]});saved=ns;
        try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(customItems));localStorage.setItem(CHK_KEY,JSON.stringify(saved))}catch(err){}renderChecks()});
      l.appendChild(x)}
    cb.appendChild(l)})}
renderChecks();
document.getElementById("cForm").addEventListener("submit",ev=>{ev.preventDefault();const inp=document.getElementById("cItem");const t=inp.value.trim();if(!t)return;
  customItems.push(t);try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(customItems))}catch(e){}inp.value="";renderChecks()});

select("neg");openDay(0);
document.getElementById("expandAll").addEventListener("click",()=>dayEls.forEach(({b,xp})=>{b.setAttribute("aria-expanded","true");xp.hidden=false}));
document.getElementById("collapseAll").addEventListener("click",()=>openDay(-1));
})();
