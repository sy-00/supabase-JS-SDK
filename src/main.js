import { supabase } from './api-client.js';

const logoutButton = document.getElementById('logout-button');
const loginRedirect = document.getElementById('login-redirect');

supabase.auth.onAuthStateChange((_event, session) => {
  handleSession(session);
});

function handleSession(session) {
  if (session) {
    logoutButton.classList.remove('hidden');
    loginRedirect.classList.add('hidden');
  } else {
    logoutButton.classList.add('hidden');
    loginRedirect.classList.remove('hidden');
  }
}

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  handleSession(session);
}

init();

logoutButton.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    alert('Nastąpiło wylogowanie');
    window.location.href = '/login/';
  } else {
    console.error('Błąd podczas wylogowywania');
  }
});

main();

async function main() {
  const [{ data: articles, error }, { data: { session } }] = await Promise.all([
    supabase.from('article').select('*').order('created_at', { ascending: false}),
    supabase.auth.getSession()
  ]);

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  const articlesContainer = document.querySelector('.articles');

  const leafIcon = `<img src="https://marketplace.canva.com/ARZ8E/MAFmAUARZ8E/1/tl/canva-natural-leaf-icon.-100%25-naturals-vector-image-MAFmAUARZ8E.png" alt="leaf icon" class="mr-3 w-6 h-6 flex-shrink-0" aria-hidden="true">`;

  const articlesList = articles.map((article) => `
    <article class="article py-6 border-b-10 border-white grid grid-cols-[auto_1fr] gap-x-3 items-center bg-secondary/50 rounded p-6" data-id="${article.id}">
    ${leafIcon}
      <h2 class="text-xl font-semibold">${article.title}</h2>
      <h3 class="col-start-2 col-span-1 mt-2">${article.subtitle || ''}</h3>
      <div class="text-sm text-black/70 col-start-2 col-span-1 mt-2">
        <address class="not-italic mt-1.5" rel="author">${article.author}</address>
        <time datetime="${article.created_at}">
          ${new Date(article.created_at).toLocaleDateString()}
        </time>
        <p class="mb-4 mt-1.5">${article.content}</p>
      </div">
        <div class="flex">
        ${session ? `<button class="edit-button bg-primary hover:bg-hovering px-3 py-1 rounded text-white cursor-pointer">Edytuj</button>
          <button class="delete-button bg-secondary text-white px-3 py-1 rounded hover:bg-hoveringS ml-2 cursor-pointer">Usuń artykuł</button>` : ''}
        </div>
    </article>
  `).join('\n');

  articlesContainer.innerHTML = articlesList;
}

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-button')) {
    const articleEl = e.target.closest('.article');
    const id = articleEl.dataset.id;

    const { data: article, error } = await supabase.from('article').select('*').eq('id', id).single();

    if (error) {
      console.error('Błąd pobierania artykułu');
      return;
    }

    document.getElementById('edit-id').value = article.id;
    document.getElementById('edit-title').value = article.title;
    document.getElementById('edit-content').value = article.content;
    document.getElementById('edit-author').value = article.author;

    document.getElementById('edit-modal').classList.remove('hidden');
  }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.add('hidden');
});

document.getElementById('edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value;
  const content = document.getElementById('edit-content').value;
  const author = document.getElementById('edit-author').value;
  const updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('article')
    .update({ title, content, author, created_at: updated_at })
    .eq('id', id);

  if (error) {
    console.error('Błąd aktualizacji artykułu');
    return;
  }

  document.getElementById('edit-modal').classList.add('hidden');
  main();
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-button')) {
    const articleEl = e.target.closest('.article');
    const id = articleEl.dataset.id;

    const confirmed = confirm('Czy na pewno chcesz usunąć ten artykuł?');

    if(!confirmed) return;
    
    const { error } = await supabase
    .from('article')
    .delete()
    .eq('id', id);

    if (error) {
      console.error("Błąd podczas usuwania artykułu")
      return;
    }

    alert('Artykuł został usunięty');
    main();
  }
});

const addButton = document.getElementById('add-article-button');
const addModal = document.getElementById('add-modal')

addButton.addEventListener('click', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/login/';
    return;
  }

  addModal.classList.remove('hidden');
});

document.getElementById('cancel-add').addEventListener('click', () => {
  addModal.classList.add('hidden')
});

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('add-title').value;
  const content = document.getElementById('add-content').value;
  const author = document.getElementById('add-author').value;
  const created_at = new Date().toISOString();

  const { error } = await supabase.from('article').insert([
    { title, content, author, created_at }
  ]);

  if (error) {
    console.error('Błąd dodawania artykułu')
    return;
  }

  addModal.classList.add('hidden');
  document.getElementById('add-form').reset();
  main();
});