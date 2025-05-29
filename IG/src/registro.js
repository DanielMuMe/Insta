import { auth } from './supabase.js';

document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'form-registro') {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const nombreUsuario = document.getElementById('nombre_usuario').value;

        try {
            const { user, error } = await auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nombre_usuario: nombreUsuario
                    }
                }
            });
            if (error) throw error;
            alert('Registro exitoso. Revisa tu correo para confirmar.');
            window.location.hash = '#/login';
        } catch (err) {
            alert(err.message);
        }
    }
});