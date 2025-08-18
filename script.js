// Footer year
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

/* -------- Cars data + filters -------- */
const DEFAULT_CARS = [
  { make: "Audi", model: "A3 S Line", price: 14995, year: 2020, mileage: 32500, fuel: "Petrol", transmission: "Automatic", image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg" },
  { make: "BMW", model: "320d M Sport", price: 16995, year: 2019, mileage: 42000, fuel: "Diesel", transmission: "Automatic", image: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg" },
  { make: "Mercedes", model: "A180 AMG Line", price: 15995, year: 2019, mileage: 38000, fuel: "Petrol", transmission: "Automatic", image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg" },
  { make: "VW", model: "Golf R-Line", price: 17995, year: 2021, mileage: 22000, fuel: "Petrol", transmission: "Manual", image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg" },
  { make: "Ford", model: "Focus ST-Line", price: 11995, year: 2018, mileage: 51000, fuel: "Petrol", transmission: "Manual", image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg" },
  { make: "Toyota", model: "C-HR Icon", price: 19995, year: 2022, mileage: 14500, fuel: "Hybrid", transmission: "Automatic", image: "https://images.pexels.com/photos/3954424/pexels-photo-3954424.jpeg" }
];

let CARS = [];
const qs = (s)=>document.querySelector(s);
async function loadCars() {
  try {
    const res = await fetch('data/cars.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No cars.json yet');
    CARS = await res.json();
  } catch { CARS = DEFAULT_CARS; }
  initFilters(CARS);
  renderCars('#featured-cars', CARS.slice(0,6));
  renderCars('#car-grid', CARS);
  revealPrepare();
}
function renderCars(selector, list) {
  const el = qs(selector);
  if (!el) return;
  el.innerHTML = list.map(car => `
    <article class="car-card reveal">
      <div class="car-thumb" style="${car.image ? `background-image:url('${car.image}');background-size:cover;background-position:center;` : ''}"></div>
      <div class="car-body">
        <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
        <div class="badges">
          <span class="badge">${car.mileage.toLocaleString()} mi</span>
          <span class="badge">${car.fuel}</span>
          <span class="badge">${car.transmission}</span>
        </div>
        <p class="price">£${car.price.toLocaleString()}</p>
        <a class="btn" href="contact.html">Enquire</a>
      </div>
    </article>
  `).join('');
}
function initFilters(data){
  const add = (id, arr)=>{ const el = qs('#'+id); if(!el) return; arr.forEach(v=> el.innerHTML += `<option value="${v}">${v}</option>`); };
  const makes = [...new Set(data.map(c=>c.make))].sort();
  const models= [...new Set(data.map(c=>c.model))].sort();
  const fuels = [...new Set(data.map(c=>c.fuel))].sort();
  const trans = [...new Set(data.map(c=>c.transmission))].sort();
  const years = [...new Set(data.map(c=>c.year))].sort((a,b)=>a-b);
  add('filter-make', makes); add('filter-model', models); add('filter-fuel', fuels); add('filter-trans', trans);
  add('filter-year-min', years); add('filter-year-max', years.slice().reverse());
}
function applyFilters(scrollToCars){
  const g = id => qs('#'+id)?.value || '';
  const make=g('filter-make'), model=g('filter-model'), fuel=g('filter-fuel'), trans=g('filter-trans');
  const yMin=parseInt(g('filter-year-min')||'0',10), yMax=parseInt(g('filter-year-max')||'9999',10);
  const maxPrice=parseInt(g('filter-price')||'999999',10);
  const list = CARS.filter(c =>
    (!make || c.make===make) && (!model || c.model===model) &&
    (!fuel || c.fuel===fuel) && (!trans || c.transmission===trans) &&
    c.year>=yMin && c.year<=yMax && c.price<=maxPrice
  );
  renderCars('#featured-cars', list.slice(0,6));
  renderCars('#car-grid', list);
  if(scrollToCars && qs('#featured-cars')) qs('#featured-cars').scrollIntoView({behavior:'smooth'});
  revealPrepare();
}

/* -------- Reveal animations -------- */
function revealPrepare(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold:0.2});
  els.forEach(el=>io.observe(el));
}

/* -------- Sticky contact bar (mobile) -------- */
(function(){
  const bar = document.createElement('div');
  bar.className='sticky-bar';
  bar.innerHTML = `
    <a href="tel:+447853882184">Call</a>
    <a href="mailto:sen@vms-autos.co.uk">Email</a>
    <a href="https://wa.me/447853882184" target="_blank" rel="noopener">WhatsApp</a>
  `;
  document.body.appendChild(bar);
})();
loadCars();
