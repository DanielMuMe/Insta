import { supabase } from './supabase.js';

export async function cargarFeed(usuarioId) {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = 'Cargando...';

    const { data, error } = await supabase
        .from('publicaciones')
        .select(`
            *,
            usuarios(nombre_usuario, foto_perfil)
        `)
        .in('usuario_id', [
            ...(await obtenerSeguidos(usuarioId)).map(u => u.seguido_id),
            usuarioId
        ]);

    if (error) return alert(error.message);

    feedContainer.innerHTML = '';
    data.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <div class="post-header">
                <img src="${post.usuarios.foto_perfil || 'https://via.placeholder.com/50'}"  class="perfil-mini">
                <strong>${post.usuarios.nombre_usuario}</strong>
            </div>
            <img src="${post.imagen_url}" class="post-img">
            <p>${post.descripcion}</p>
        `;
        feedContainer.appendChild(div);
    });
}

async function obtenerSeguidos(usuarioId) {
    const { data, error } = await supabase
        .from('seguidores')
        .select('seguido_id')
        .eq('seguidor_id', usuarioId);
    if (error) throw error;
    return data;
}