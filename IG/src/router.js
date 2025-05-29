import { cargarFeed } from './home.js';
import { mostrarPerfil } from './perfil.js';

const routes = {
  '/': 'home',
  '/login': 'login',
  '/registro': 'registro',
  '/perfil': 'perfil'
};

function renderComponent(path) {
  const main = document.getElementById('app');
  main.innerHTML = '';

  switch (path) {
    case '/':
      main.innerHTML = `<div id="feed-container"></div>`;
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (usuario) cargarFeed(usuario.id);
      break;
    case '/perfil':
      const usuarioPerfil = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioPerfil) mostrarPerfil(usuarioPerfil.id);
      break;
    // ...otros casos...
  }
}

export function navigate(path) {
  history.pushState(null, '', path);
  renderComponent(path);
}

window.addEventListener('hashchange', () => {
  const path = window.location.hash.replace('#', '') || '/';
  renderComponent(path);
});

window.onload = () => {
  const path = window.location.hash.replace('#', '') || '/';
  renderComponent(path);
};

