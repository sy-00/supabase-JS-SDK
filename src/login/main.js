import { supabase } from '../api-client.js';

const form = document.getElementById('login-form');
const message = document.getElementById('login-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.textContent = 'Invalid login credentials';
    message.classList.add('text-red-500');
  } else {
    message.classList.remove('text-red-500');
    message.textContent = 'Redirecting...'
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  }
});