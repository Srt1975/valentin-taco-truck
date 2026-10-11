const MENU_STORAGE_KEY = 'valentin.menu.items.v1';

const DEFAULT_MENU_ITEMS = [
  {
    name: 'Carnitas Classic',
    description: 'Slow-cooked pork perfection with onion and cilantro.',
    price: '$3.50',
    image: 'images/food1.jpg',
    showOnLanding: true
  },
  {
    name: 'Chicken Pastor',
    description: 'Marinated chicken with smoky spice and fresh salsa.',
    price: '$3.25',
    image: 'images/food2.jpg',
    showOnLanding: true
  },
  {
    name: 'Combo Plate',
    description: 'Two tacos with rice and beans on the side.',
    price: '$8.95',
    image: 'images/food3.jpg',
    showOnLanding: true
  },
  {
    name: 'Rice & Beans',
    description: 'Mexican rice and refried beans.',
    price: '$4.50',
    image: 'images/food4.jpg',
    showOnLanding: false
  }
];

function sanitizeItems(items) {
  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      name: String(item.name || '').trim(),
      description: String(item.description || '').trim(),
      price: String(item.price || '').trim(),
      image: String(item.image || '').trim() || 'images/food1.jpg',
      showOnLanding: Boolean(item.showOnLanding)
    }))
    .filter((item) => item.name.length > 0);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeImagePath(imagePath) {
  const trimmed = String(imagePath || '').trim();
  const isAllowed = /^images\/[a-zA-Z0-9._/-]+$/.test(trimmed) || /^https?:\/\/[^"'<>\\s]+$/.test(trimmed);
  return isAllowed ? trimmed : 'images/food1.jpg';
}

function loadItems() {
  try {
    const saved = localStorage.getItem(MENU_STORAGE_KEY);
    if (!saved) return DEFAULT_MENU_ITEMS;
    const parsed = JSON.parse(saved);
    const cleaned = sanitizeItems(Array.isArray(parsed) ? parsed : []);
    return cleaned.length ? cleaned : DEFAULT_MENU_ITEMS;
  } catch {
    return DEFAULT_MENU_ITEMS;
  }
}

function saveItems(items) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(sanitizeItems(items)));
}

function renderLandingMenu(items) {
  const menuNode = document.getElementById('todays-menu-list');
  if (!menuNode) return;

  const visibleItems = items.filter((item) => item.showOnLanding);
  if (!visibleItems.length) {
    menuNode.innerHTML = '<p class="note">No menu items are checked yet. Use the Edit Menu page to publish today\'s menu.</p>';
    return;
  }

  menuNode.innerHTML = visibleItems.map((item) => `
    <figure class="menu-item">
      <img src="${escapeHtml(safeImagePath(item.image))}" alt="${escapeHtml(item.name)}" />
      <div class="menu-item__body">
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <figcaption>${escapeHtml(item.price)}</figcaption>
      </div>
    </figure>
  `).join('');
}

function editorItemMarkup(item, index) {
  return `
    <article class="menu-editor-item" data-index="${index}">
      <div class="menu-editor-grid">
        <label>
          Item name
          <input type="text" class="field-name" value="${escapeHtml(item.name)}" required>
        </label>
        <label>
          Price
          <input type="text" class="field-price" value="${escapeHtml(item.price)}" placeholder="$0.00">
        </label>
        <label>
          Image path
          <input type="text" class="field-image" value="${escapeHtml(item.image)}" placeholder="images/food1.jpg">
        </label>
        <label class="menu-editor-check">
          <input type="checkbox" class="field-show" ${item.showOnLanding ? 'checked' : ''}>
          Show on today's menu
        </label>
      </div>
      <label>
        Description
        <textarea class="field-description" rows="2">${escapeHtml(item.description)}</textarea>
      </label>
      <button type="button" class="menu-item-remove btn btn-secondary">Remove</button>
    </article>
  `;
}

function collectEditorItems() {
  return Array.from(document.querySelectorAll('.menu-editor-item')).map((node) => ({
    name: node.querySelector('.field-name').value,
    description: node.querySelector('.field-description').value,
    price: node.querySelector('.field-price').value,
    image: node.querySelector('.field-image').value,
    showOnLanding: node.querySelector('.field-show').checked
  }));
}

function renderEditor(items) {
  const listNode = document.getElementById('menu-editor-list');
  if (!listNode) return;
  listNode.innerHTML = items.map((item, index) => editorItemMarkup(item, index)).join('');
}

function initMenuEditor(items) {
  const form = document.getElementById('menu-editor-form');
  const addButton = document.getElementById('add-menu-item');
  const listNode = document.getElementById('menu-editor-list');
  if (!form || !addButton || !listNode) return;

  renderEditor(items);

  addButton.addEventListener('click', () => {
    const current = collectEditorItems();
    current.push({
      name: '',
      description: '',
      price: '',
      image: 'images/food1.jpg',
      showOnLanding: false
    });
    renderEditor(current);
  });

  listNode.addEventListener('click', (event) => {
    const button = event.target.closest('.menu-item-remove');
    if (!button) return;
    const itemNode = button.closest('.menu-editor-item');
    if (itemNode) itemNode.remove();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const updatedItems = sanitizeItems(collectEditorItems());
    saveItems(updatedItems);
    renderEditor(updatedItems);
    alert('Menu updated. Landing page now shows the checked items.');
  });
}

function initTruckLinkAnimation() {
  const truckLink = document.getElementById('truck-site-link');
  if (!truckLink) return;

  truckLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (truckLink.classList.contains('is-pixelating')) return;
    truckLink.classList.add('is-pixelating');
    const destination = truckLink.href;
    setTimeout(() => {
      window.location.href = destination;
    }, 260);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = loadItems();
  renderLandingMenu(menuItems);
  initMenuEditor(menuItems);
  initTruckLinkAnimation();
});
