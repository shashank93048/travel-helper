const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const slides = $$(".hero-slide"), dots = $$(".slide-dots i");
let slideIndex = 0;
setInterval(() => {
  slides[slideIndex].classList.remove("active"); dots[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active"); dots[slideIndex].classList.add("active");
}, 5000);

window.addEventListener("scroll", () => $("#topbar")?.classList.toggle("scrolled", scrollY > 20));

const where = $(".where-field"), destination = $("#destination"), suggestions = $("#suggestions");
destination?.addEventListener("focus", () => where.classList.add("open"));
destination?.addEventListener("input", () => where.classList.add("open"));
$$(".suggestions button").forEach(b => b.addEventListener("click", () => {
  destination.value = b.dataset.value; where.classList.remove("open");
}));
document.addEventListener("click", e => { if (!where?.contains(e.target)) where?.classList.remove("open"); });

let currentFilter = "All";
$$(".category").forEach(btn => btn.addEventListener("click", () => {
  $$(".category").forEach(x => x.classList.remove("active")); btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  $$(".card").forEach(card => {
    const show = currentFilter === "All" || card.dataset.type === currentFilter;
    card.classList.toggle("hidden", !show);
  });
}));

// Card image carousels
$$(".card").forEach(card => {
  const images = $$(".card-images img", card), indicators = $$(".image-dots i", card);
  let index = 0;
  const update = () => {
    images.forEach((im,i)=>im.classList.toggle("active", i===index));
    indicators.forEach((d,i)=>d.classList.toggle("active", i===index));
  };
  $$(".carousel", card).forEach(btn => btn.addEventListener("click", e => {
    e.preventDefault(); e.stopPropagation();
    index = (index + Number(btn.dataset.dir) + images.length) % images.length; update();
  }));
  $(".heart", card)?.addEventListener("click", e => {
    e.preventDefault(); e.stopPropagation();
    const heart = $(".heart", card); heart.classList.toggle("saved");
    heart.textContent = heart.classList.contains("saved") ? "♥" : "♡";
    heart.classList.remove("pop"); void heart.offsetWidth; heart.classList.add("pop");
    if (heart.classList.contains("saved")) {
      const burst = document.createElement("span"); burst.textContent = "✦"; burst.className = "burst";
      heart.appendChild(burst); setTimeout(()=>burst.remove(),600);
    }
  });
});

// Price toggle
$("#priceToggle")?.addEventListener("change", e => {
  $$(".price").forEach(p => {
    const total = e.target.checked;
    p.innerHTML = `${total ? p.dataset.total : p.dataset.nightly} <small>${total ? "3 nights + fees" : "/ night"}</small>`;
  });
});

// Grid/map
const grid = $("#listingGrid"), map = $("#mapView");
$("#mapBtn")?.addEventListener("click", () => { grid.classList.add("map-hidden"); map.classList.add("active"); $("#mapBtn").classList.add("active"); $("#gridBtn").classList.remove("active"); });
$("#gridBtn")?.addEventListener("click", () => { grid.classList.remove("map-hidden"); map.classList.remove("active"); $("#gridBtn").classList.add("active"); $("#mapBtn").classList.remove("active"); });
$$(".map-pin").forEach(pin => pin.addEventListener("mouseenter", () => { $("#mapCard").textContent = `${pin.dataset.title} · ${pin.dataset.price}/night`; }));

// Theme
const savedTheme = localStorage.getItem("travel-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$("#themeToggle")?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next; localStorage.setItem("travel-theme", next);
});

// Date modal calendar
const dateModal = $("#dateModal"), dateOpen = $("#dateOpen"), dateLabel = $("#dateLabel");
let month = new Date(); month.setDate(1); let startDate = null, endDate = null;
function renderCalendar(){
  const cal = $("#calendar"), title = $("#monthTitle"); if(!cal) return;
  const y=month.getFullYear(), m=month.getMonth();
  title.textContent = month.toLocaleString("en-US",{month:"long",year:"numeric"});
  cal.innerHTML = ["S","M","T","W","T","F","S"].map(x=>`<div><b>${x}</b></div>`).join("");
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  for(let i=0;i<first;i++) cal.innerHTML += "<div></div>";
  for(let d=1;d<=days;d++){
    const dt=new Date(y,m,d), iso=dt.toISOString().slice(0,10);
    const selected=(startDate===iso||endDate===iso), range=startDate&&endDate&&iso>startDate&&iso<endDate;
    cal.innerHTML += `<button class="day ${selected?"selected":""} ${range?"range":""}" data-date="${iso}">${d}</button>`;
  }
  $$(".day",cal).forEach(b=>b.addEventListener("click",()=>{
    if(!startDate || (startDate && endDate)){startDate=b.dataset.date;endDate=null}
    else if(b.dataset.date<startDate){endDate=startDate;startDate=b.dataset.date}else endDate=b.dataset.date;
    renderCalendar();
  }));
}
dateOpen?.addEventListener("click",()=>{dateModal.classList.add("open");renderCalendar()});
$("#prevMonth")?.addEventListener("click",()=>{month.setMonth(month.getMonth()-1);renderCalendar()});
$("#nextMonth")?.addEventListener("click",()=>{month.setMonth(month.getMonth()+1);renderCalendar()});
$("#applyDates")?.addEventListener("click",()=>{
  if(startDate) dateLabel.textContent = endDate ? `${startDate.slice(5)} → ${endDate.slice(5)}` : startDate.slice(5);
  dateModal.classList.remove("open");
});
$$(".close").forEach(b=>b.addEventListener("click",()=>b.closest(".modal").classList.remove("open")));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));

// Surprise/flexible
const destinations=["Goa","Manali","Udaipur","Rishikesh","Jaisalmer","Delhi"];
$("#surpriseBtn")?.addEventListener("click",()=>{destination.value=destinations[Math.floor(Math.random()*destinations.length)];destination.animate([{transform:"scale(1)"},{transform:"scale(1.04)"},{transform:"scale(1)"}],{duration:350});});
$("#flexibleBtn")?.addEventListener("click",()=>{document.querySelector("#stays").scrollIntoView({behavior:"smooth"}); setTimeout(()=>$("#flexibleBtn").textContent="Showing flexible stays ✨",300);});

// Mini quiz
const quizModal=$("#quizModal"), quizContent=$("#quizContent");
const questions=[
  {q:"What's your travel style?",a:[["🏖️","Slow beach days"],["🏔️","Adventure & mountains"],["🌆","Food, culture & city life"]]},
  {q:"Pick your ideal morning.",a:[["☕","Coffee with a view"],["🥾","Early hike"],["🥐","Walk to a local café"]]},
  {q:"Choose your vibe.",a:[["🌊","Relaxed"],["🔥","Adventurous"],["✨","Curious"]]}
];
let qi=0;
function renderQuiz(){
  if(qi>=questions.length){quizContent.innerHTML=`<h2>Your vibe is ready ✨</h2><p>We recommend exploring <b>${["Goa and Udaipur","Manali and Rishikesh","Delhi and Goa"][Math.floor(Math.random()*3)]}</b>.</p><button class="primary" onclick="document.querySelector('#quizModal').classList.remove('open');document.querySelector('#stays').scrollIntoView({behavior:'smooth'})">Show my stays</button>`;return}
  const q=questions[qi]; quizContent.innerHTML=`<h2>${q.q}</h2>${q.a.map(x=>`<button class="quiz-option">${x[0]} &nbsp; ${x[1]}</button>`).join("")}`;
  $$(".quiz-option",quizContent).forEach(b=>b.addEventListener("click",()=>{qi++;renderQuiz()}));
}
$("#startQuiz")?.addEventListener("click",()=>{qi=0;renderQuiz();quizModal.classList.add("open")});