import { auth } from '../supabase-config.js';

export async function cerrarSesion() {
    const { error } = await auth.signOut();
    if (error) alert(error.message);
    localStorage.removeItem('usuario');
    window.location.hash = '#/login';
}