// Rick & Morty version - no API key required
document.addEventListener('DOMContentLoaded', ()=> {
  const form = document.getElementById('weather-form'); // keeps same form id
  const cityInput = document.getElementById('city');   // use this input for character name
  const errorEl = document.getElementById('error');
  const resultSection = document.getElementById('result');
  const locationEl = document.getElementById('location'); // will show "Name (Origin)"
  const tempEl = document.getElementById('temp');        // will show species
  const feelsEl = document.getElementById('feels');      // will show status (Alive/Dead/unknown)
  const descEl = document.getElementById('desc');        // will show gender
  const humidityEl = document.getElementById('humidity');// will show current location
  const windEl = document.getElementById('wind');        // will show episode count
  const iconEl = document.getElementById('icon');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    errorEl.textContent = '';
    const q = cityInput.value.trim();
    if(!q){
      errorEl.textContent = 'Enter a name';
      resultSection.classList.add('hidden');
      return;
    }
    if(q.length < 2){
      errorEl.textContent = 'Name too short';
      resultSection.classList.add('hidden');
      return;
    }

    try{
      const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if(!res.ok){
        if(res.status === 404){
          errorEl.textContent = 'Character not found';
        } else {
          errorEl.textContent = 'Error fetching data';
        }
        resultSection.classList.add('hidden');
        return;
      }
      const data = await res.json();
      if(!data.results || data.results.length === 0){
        errorEl.textContent = 'No results';
        resultSection.classList.add('hidden');
        return;
      }

      // take first match
      const c = data.results[0];

      // Map character fields into existing UI
      locationEl.textContent = `${c.name}${c.origin && c.origin.name ? ' ('+c.origin.name+')' : ''}`;
      tempEl.textContent = c.species || '—';
      feelsEl.textContent = c.status || 'unknown';
      descEl.textContent = c.gender || '—';
      humidityEl.textContent = c.location && c.location.name ? c.location.name : '—';
      windEl.textContent = Array.isArray(c.episode) ? `${c.episode.length} episode(s)` : '—';
      iconEl.src = c.image || '';
      iconEl.alt = c.name || 'character image';

      // set simple background based on status / episodes
      setBackgroundByCharacter(c);

      resultSection.classList.remove('hidden');
    }catch(err){
      errorEl.textContent = 'Network error';
      resultSection.classList.add('hidden');
    }
  });

  function setBackgroundByCharacter(c){
    document.body.classList.remove('cold','cool','warm','hot');
    // status-based backgrounds: Alive -> warm, Dead -> cold, unknown -> cool.
    if(c.status === 'Alive') document.body.classList.add('warm');
    else if(c.status === 'Dead') document.body.classList.add('cold');
    else document.body.classList.add('cool');

    // if very many episodes, make it "hot" (fan-favorite)
    if(Array.isArray(c.episode) && c.episode.length >= 10) {
      document.body.classList.remove('cold','cool','warm','hot');
      document.body.classList.add('hot');
    }
  }
});
