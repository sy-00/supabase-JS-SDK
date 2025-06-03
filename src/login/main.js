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
    message.textContent = 'Błędne dane logowania.';
  } else {
    message.textContent = 'Zalogowano.'
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  }
});