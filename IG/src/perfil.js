import { supabase } from './supabase.js';

export async function mostrarPerfil(usuarioId) {
    const app = document.getElementById('app');
    app.innerHTML = `<div id="perfil-container">Cargando perfil...</div>`;
    const perfilContainer = document.getElementById('perfil-container');

    // Datos del usuario
    const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', usuarioId)
        .single();
    if (error) return perfilContainer.innerHTML = 'Error al cargar perfil';

    // Seguidores y seguidos
    const { count: seguidores } = await supabase
        .from('seguidores')
        .select('*', { count: 'exact', head: true })
        .eq('seguido_id', usuarioId);
    const { count: seguidos } = await supabase
        .from('seguidores')
        .select('*', { count: 'exact', head: true })
        .eq('seguidor_id', usuarioId);

    // Publicaciones propias
    const { data: publicaciones } = await supabase
        .from('publicaciones')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('id', { ascending: false });

    perfilContainer.innerHTML = `
        <div style="text-align:center">
            <img src="${usuario.foto_perfil || 'https://via.placeholder.com/100'}" class="perfil-mini" style="width:100px;height:100px;">
            <h2>${usuario.nombre_completo || usuario.nombre_usuario}</h2>
            <p>@${usuario.nombre_usuario}</p>
            <p>${usuario.bio || 'Sin biografía'}</p>
            <div style="display:flex;justify-content:center;gap:2rem;margin:1rem 0;">
                <div><strong>${seguidores ?? 0}</strong><br>Seguidores</div>
                <div><strong>${seguidos ?? 0}</strong><br>Seguidos</div>
                <div><strong>${publicaciones.length}</strong><br>Publicaciones</div>
            </div>
        </div>
        <h3>Mis publicaciones</h3>
        <div id="mis-publicaciones"></div>
    `;

    const misPubDiv = document.getElementById('mis-publicaciones');
    publicaciones.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <img src="${post.imagen_url}" class="post-img">
            <p>${post.descripcion}</p>
        `;
        misPubDiv.appendChild(div);
    });
}