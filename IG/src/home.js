import { supabase } from './supabase.js';

export async function cargarFeed(usuarioId) {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = `
        <form id="form-publicar" enctype="multipart/form-data">
            <input type="file" id="foto" accept="image/*" required />
            <input type="text" id="descripcion" placeholder="Descripción" maxlength="200" required />
            <button type="submit">Publicar</button>
        </form>
        <div id="publicaciones"></div>
    `;

    document.getElementById('form-publicar').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('foto');
        const descripcion = document.getElementById('descripcion').value;
        const file = fileInput.files[0];
        if (!file) return alert('Selecciona una imagen');

        // Subir imagen a Supabase Storage
        const filePath = `${usuarioId}/${Date.now()}_${file.name}`;
        let { error: uploadError } = await supabase.storage
            .from('fotos')
            .upload(filePath, file);

        if (uploadError) return alert('Error al subir imagen');

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('fotos')
            .getPublicUrl(filePath);

        // Guardar publicación en la base de datos
        const { error: pubError } = await supabase
            .from('publicaciones')
            .insert([{
                usuario_id: usuarioId,
                imagen_url: publicUrl,
                descripcion
            }]);

        if (pubError) return alert('Error al guardar publicación');
        alert('¡Publicación subida!');
        cargarFeed(usuarioId); // Recargar feed
    });

    mostrarPublicaciones(usuarioId);
}

async function mostrarPublicaciones(usuarioId) {
    const publicacionesDiv = document.getElementById('publicaciones');
    publicacionesDiv.innerHTML = 'Cargando publicaciones...';

    // Obtener publicaciones de seguidos y propias
    const seguidos = await obtenerSeguidos(usuarioId);
    const ids = [...seguidos.map(u => u.seguido_id), usuarioId];

    const { data, error } = await supabase
        .from('publicaciones')
        .select(`
            *,
            usuarios(nombre_usuario, foto_perfil)
        `)
        .in('usuario_id', ids)
        .order('id', { ascending: false });

    if (error) return publicacionesDiv.innerHTML = 'Error al cargar publicaciones';

    publicacionesDiv.innerHTML = '';
    data.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <div class="post-header">
                <img src="${post.usuarios.foto_perfil || 'https://via.placeholder.com/50'}" class="perfil-mini">
                <strong>${post.usuarios.nombre_usuario}</strong>
            </div>
            <img src="${post.imagen_url}" class="post-img">
            <p>${post.descripcion}</p>
        `;
        publicacionesDiv.appendChild(div);
    });
}

async function obtenerSeguidos(usuarioId) {
    const { data, error } = await supabase
        .from('seguidores')
        .select('seguido_id')
        .eq('seguidor_id', usuarioId);
    if (error) return [];
    return data;
}