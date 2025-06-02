import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { supabase } from './api-client.js';

main();

async function main() {
  console.log('main');

  const { data, error } = await supabase
    .from('article')
    .select('*');

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  console.log('Fetched articles:', data);

  const articlesList = data.map((article) => `
    <article class="article">
      <h2>${article.title}</h2>
      <div>
        <address rel="author">${article.author}</address>
        <time datetime="${article.created_at}">
          ${new Date(article.created_at).toLocaleDateString()}
        </time>
      </div>
    </article>
  `).join('\n');

  document.body.innerHTML += articlesList;
}