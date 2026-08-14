const schedule = [
  {
    name: 'Codes Dispensary',
    address: '1450 W. Smith St, Springfield, MO 65807',
    start: '2026-08-14',
    end: '2026-08-15',
    hours: '10:00 AM – 6:00 PM',
    lat: 37.2089,
    lon: -93.2923
  },
  {
    name: 'West Plains Civic Center',
    address: '1100 W. Broadway St, West Plains, MO 65775',
    start: '2026-08-21',
    end: '2026-08-22',
    hours: '11:00 AM – 7:00 PM',
    lat: 36.7281,
    lon: -91.8522
  },
  {
    name: 'Wages Brewery',
    address: '214 E. Chestnut St, Springfield, MO 65806',
    start: '2026-08-27',
    end: '2026-08-29',
    hours: '2:00 PM – 8:00 PM',
    lat: 37.2086,
    lon: -93.2925
  }
];

function toDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function formatDateOnly(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(toDate(dateString));
}

function formatRange(start, end) {
  const startDate = toDate(start);
  const endDate = toDate(end);

  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();

  if (start === end) {
    return formatDateOnly(start);
  }

  if (sameMonth) {
    return `${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(startDate)} & ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(endDate)}`;
  }

  return `${formatDateOnly(start)} & ${formatDateOnly(end)}`;
}

function getCurrentOrNextStop() {
  const today = new Date();
  const activeStop = schedule.find((stop) => {
    const start = toDate(stop.start);
    const end = toDate(stop.end);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  });

  if (activeStop) {
    return { mode: 'current', stop: activeStop };
  }

  const nextStop = schedule.find((stop) => toDate(stop.start) >= new Date(today.toDateString()));

  return {
    mode: 'next',
    stop: nextStop || schedule[0]
  };
}

function updateHomeStatus() {
  const statusNode = document.getElementById('dynamic-location-status');
  if (!statusNode) return;

  const result = getCurrentOrNextStop();
  const stop = result.stop;

  if (result.mode === 'current') {
    statusNode.textContent = `Open today: ${stop.name} — ${stop.address} — ${stop.hours}.`;
    return;
  }

  statusNode.textContent = `Currently closed. Next public stop: ${formatRange(stop.start, stop.end)} — ${stop.name}, ${stop.hours}.`;
}

let selectedLocationIndex = null;

function getStopMapEmbedUrl(stop) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${stop.name}, ${stop.address}`)}&z=14&output=embed`;
}

function renderLocationPage() {
  const titleNode = document.getElementById('location-title');
  const summaryNode = document.getElementById('location-summary');
  const listNode = document.getElementById('upcoming-stops-list');
  const mapLink = document.getElementById('map-link');
  const mapAddress = document.getElementById('map-address');
  const mapFrame = document.getElementById('google-map');

  if (!titleNode || !summaryNode || !listNode || !mapLink || !mapAddress || !mapFrame) return;

  const result = getCurrentOrNextStop();
  const defaultStop = result.stop;
  const selectedStop = selectedLocationIndex !== null ? schedule[selectedLocationIndex] : defaultStop;

  if (selectedLocationIndex !== null) {
    titleNode.textContent = `Viewing stop: ${formatRange(selectedStop.start, selectedStop.end)}`;
    summaryNode.textContent = `${selectedStop.name} — ${selectedStop.address} — ${selectedStop.hours}`;
  } else if (result.mode === 'current') {
    titleNode.textContent = `Current location: ${formatRange(defaultStop.start, defaultStop.end)}`;
    summaryNode.textContent = `${defaultStop.name} — ${defaultStop.address} — ${defaultStop.hours}`;
  } else {
    titleNode.textContent = `Next public stop: ${formatRange(defaultStop.start, defaultStop.end)}`;
    summaryNode.textContent = `${defaultStop.name} — ${defaultStop.address} — ${defaultStop.hours}`;
  }

  const stopMarkup = schedule.map((stop, index) => `
    <article
      class="schedule-item ${selectedStop.name === stop.name && selectedStop.address === stop.address ? 'is-selected' : ''}"
      data-stop-index="${index}"
      tabindex="0"
      role="button"
      aria-label="View map for ${stop.name}"
    >
      <span class="day">${formatRange(stop.start, stop.end)}</span>
      <strong>${stop.name}</strong><br>
      ${stop.address}<br>
      ${stop.hours}
    </article>
  `).join('');

  listNode.innerHTML = stopMarkup;

  listNode.querySelectorAll('.schedule-item').forEach((item) => {
    item.addEventListener('click', () => {
      selectedLocationIndex = Number(item.dataset.stopIndex);
      renderLocationPage();
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectedLocationIndex = Number(item.dataset.stopIndex);
        renderLocationPage();
      }
    });
  });

  mapAddress.textContent = selectedStop.address;
  mapFrame.src = getStopMapEmbedUrl(selectedStop);
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStop.address)}`;
  mapLink.textContent = `Open in Google Maps: ${selectedStop.name}`;
}

function initLocationSystem() {
  updateHomeStatus();
  renderLocationPage();
}

document.addEventListener('DOMContentLoaded', initLocationSystem);
