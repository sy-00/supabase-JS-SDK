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
  const { data, error } = await supabase
    .from('article')
    .select('*');

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  const articlesContainer = document.querySelector('.articles');

  const articlesList = data.map((article) => `
    <article class="article">
      <h2 class="text-xl font-semibold">${article.title}</h2>
      <h3>${article.subtitle}</h3>
      <div class="text-sm text-gray-600">
        <address class="not-italic" rel="author">${article.author}</address>
        <time datetime="${article.created_at}">
          ${new Date(article.created_at).toLocaleDateString()}
        </time>
        <p class="mb-4">${article.content}</p>
      </div>
    </article>
  `).join('\n');

  articlesContainer.innerHTML = articlesList;
}