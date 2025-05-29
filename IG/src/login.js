import { auth } from './supabase.js';

document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'form-login') {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { session, error } = await auth.signInWithPassword({ email, password });
            if (error) throw error;
            alert('Inicio de sesión exitoso');
            localStorage.setItem('usuario', JSON.stringify(session.user));
            window.location.hash = '#/';
        } catch (err) {
            alert(err.message);
        }
    }
});