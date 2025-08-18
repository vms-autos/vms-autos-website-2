document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

let CARS = [];
const qs = (s)=>document.querySelector(s);
const qsa = (s)=>Array.from(document.querySelectorAll(s));

async function loadCars() {
  try {
    const res = await fetch('data/cars.json');
    CARS = await res.json();
    initFilters(CARS);
    // Homepage featured
    const featured = CARS.slice(0,6);
    renderCars('#featured-cars', featured);
    // Cars page
    renderCars('#car-grid', CARS);
  } catch(e){ console.error('Failed to load cars.json', e); }
}

function renderCars(selector, list) {
  const el = qs(selector);
  if (!el) return;
  el.innerHTML = list.map(car => `
    <article class="car-card">
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
  const makes = [...new Set(data.map(c=>c.make))].sort();
  const models = [...new Set(data.map(c=>c.model))].sort();
  const fuels  = [...new Set(data.map(c=>c.fuel))].sort();
  const trans  = [...new Set(data.map(c=>c.transmission))].sort();
  const years  = [...new Set(data.map(c=>c.year))].sort((a,b)=>a-b);

  const addOpts = (id, arr)=>{ const el = qs('#'+id); if(!el) return; arr.forEach(v=>el.innerHTML += `<option value="${v}">${v}</option>`); };
  addOpts('filter-make', makes);
  addOpts('filter-model', models);
  addOpts('filter-fuel', fuels);
  addOpts('filter-trans', trans);
  addOpts('filter-year-min', years);
  addOpts('filter-year-max', years.slice().reverse());
}

function applyFilters(scrollToCars){
  const make = qs('#filter-make')?.value || '';
  const model = qs('#filter-model')?.value || '';
  const fuel = qs('#filter-fuel')?.value || '';
  const trans = qs('#filter-trans')?.value || '';
  const yMin = parseInt(qs('#filter-year-min')?.value || '0',10);
  const yMax = parseInt(qs('#filter-year-max')?.value || '9999',10);
  const maxPrice = parseInt(qs('#filter-price')?.value || '999999',10);

  let list = CARS.filter(c=>
    (!make || c.make===make) &&
    (!model || c.model===model) &&
    (!fuel || c.fuel===fuel) &&
    (!trans || c.transmission===trans) &&
    (c.year >= yMin) && (c.year <= yMax) &&
    (c.price <= maxPrice)
  );
  renderCars('#featured-cars', list.slice(0,6));
  renderCars('#car-grid', list);
  if(scrollToCars && qs('#featured-cars')) qs('#featured-cars').scrollIntoView({behavior:'smooth'});
}

loadCars();
