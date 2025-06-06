import { supabase } from './api-client.js';

const logoutButton = document.getElementById('logout-button');

supabase.auth.onAuthStateChange((_event, session) => {
  handleSession(session);
});

function handleSession(session) {
  if (session) {
    logoutButton.classList.remove('hidden');
  } else {
    logoutButton.classList.add('hidden');
  }
}

const { data: { session } } = await supabase.auth.getSession();
handleSession(session);

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
    supabase.from('article').select('*'),
    supabase.auth.getSession()
  ]);

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  const articlesContainer = document.querySelector('.articles');

  const articlesList = articles.map((article) => `
    <article class="article" data-id="${article.id}">
      <h2 class="text-xl font-semibold">${article.title}</h2>
      <h3>${article.subtitle || ''}</h3>
      <div class="text-sm text-gray-600">
        <address class="not-italic" rel="author">${article.author}</address>
        <time datetime="${article.created_at}">
          ${new Date(article.created_at).toLocaleDateString()}
        </time>
        <p class="mb-4">${article.content}</p>
      </div>
      ${session ? `<button class="edit-btn bg-primary hover:bg-hovering px-3 py-1 rounded hover:text-white cursor-pointer">Edytuj</button>
        <button class="delete-button bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-2 cursor-pointer">Usuń artykuł</button>` : ''}
    </article>
  `).join('\n');

  articlesContainer.innerHTML = articlesList;
}

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-btn')) {
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