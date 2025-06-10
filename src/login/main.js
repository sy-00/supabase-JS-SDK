import { supabase } from '../api-client.js';

const form = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginMessage.textContent = 'Invalid login credentials';
    loginMessage.classList.add('text-red-500');
  } else {
    loginMessage.classList.remove('text-red-500');
    loginMessage.textContent = 'Redirecting...'
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  }
});