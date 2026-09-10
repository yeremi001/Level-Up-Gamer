// Base de Datos Centralizada de Productos
const productosData = [
    {
        id: "JM001",
        codigo: "JM001",
        nombre: "Catan: El Juego",
        categoria: "Juegos de Mesa",
        precio: 39990,
        imagen: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=400&q=80",
        descripcion: "Construye caminos, pueblos y ciudades para dominar la isla de Catan.",
        origen: "Importado de Alemania. Fabricado por Devir / Kosmos.",
        recomendado: true,
        reseñas: [
            { rating: 5, comentario: "Excelente juego para compartir con amigos." }
        ]
    },
    {
        id: "JM002",
        codigo: "JM002",
        nombre: "Carcassonne",
        categoria: "Juegos de Mesa",
        precio: 29990,
        imagen: "https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017222593-1200-face3d-copy.jpg",
        descripcion: "Crea el mapa medieval loseta a loseta y controla caminos y fortalezas.",
        origen: "Importado de España. Diseñado por Klaus-Jürgen Wrede.",
        recomendado: false,
        reseñas: []
    },
    {
        id: "AC001",
        codigo: "AC001",
        nombre: "Soporte para Auriculares RGB",
        categoria: "Accesorios",
        precio: 19990,
        imagen: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
        descripcion: "Base de aluminio con iluminación RGB personalizable y puertos USB 3.0.",
        origen: "Fabricación nacional / Ensamblado en Chile.",
        recomendado: true,
        reseñas: []
    },
    {
        id: "CS001",
        codigo: "CS001",
        nombre: "PlayStation 5 Digital Edition",
        categoria: "Consolas",
        precio: 529900,
        imagen: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80",
        descripcion: "Consola de ultima generación con almacenamiento SSD ultra rápido.",
        origen: "Importado de Japón (Sony Interactive Entertainment).",
        recomendado: true,
        reseñas: [
            { rating: 5, comentario: "Los tiempos de carga son casi instantáneos." }
        ]
    },
    {
        id: "CG001",
        codigo: "CG001",
        nombre: "PC Gamer LevelUp Alpha",
        categoria: "Computadores Gamers",
        precio: 1199990,
        imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
        descripcion: "Intel Core i7, 32GB RAM DDR5, SSD 1TB, tarjeta de video RTX 4070.",
        origen: "Ensamblado en Chile por técnicos de Level-Up Gamer.",
        recomendado: true,
        reseñas: []
    },
    {
        id: "SG001",
        codigo: "SG001",
        nombre: "Silla Gamer Pro Ergonomic",
        categoria: "Sillas Gamers",
        precio: 189990,
        imagen: "https://th.bing.com/th/id/OIP.PAkOeNN-Ps_GCB4nRBBgaAHaHa?w=196&h=196&c=7&r=0&o=7&pid=1.7&rm=3",
        descripcion: "Respaldo reclinable hasta 180 grados, cojines lumbares y apoyabrazos 4D.",
        origen: "Importación directa. Tela transpirable de alta densidad.",
        recomendado: false,
        reseñas: []
    },
    {
        id: "MS001",
        codigo: "MS001",
        nombre: "Mouse Inalámbrico Hero 25K",
        categoria: "Mouse",
        precio: 49990,
        imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80",
        descripcion: "Sensor óptico de alta precisión con hasta 25.600 DPI.",
        origen: "Importado de EE. UU.",
        recomendado: true,
        reseñas: []
    },
    {
        id: "MP001",
        codigo: "MP001",
        nombre: "Mousepad Extra Large RGB",
        categoria: "Mousepad",
        precio: 15990,
        imagen: "https://th.bing.com/th/id/OIP._cfAzYj9Cwah6SPQMXQT1QHaHT?w=213&h=210&c=7&r=0&o=7&pid=1.7&rm=3",
        descripcion: "Superficie de microtextura antideslizante de 900x400mm.",
        origen: "Fabricación nacional con costura reforzada.",
        recomendado: false,
        reseñas: []
    },
    {
        id: "PL001",
        codigo: "PL001",
        nombre: "Polera Gamer Duoc Esports",
        categoria: "Poleras Personalizadas",
        precio: 14990,
        imagen: "https://th.bing.com/th/id/OIP.zN9YS75mdU_pG0D_-Hm4KgHaHa?w=185&h=185&c=7&r=0&o=7&pid=1.7&rm=3",
        descripcion: "Polera 100% algodón con estampado reflectante de la comunidad.",
        origen: "Diseñada y confeccionada en Chile.",
        recomendado: true,
        reseñas: []
    }
];

// Estado Global
let carrito = [];
let esEstudianteDuoc = false;
let productoSeleccionado = null;

// Inicialización del DOM
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos(productosData);
    renderizarRecomendados();
    inicializarMapaEventos();
    inicializarFiltros();
    inicializarFormularios();
});

// Renderizar Productos
function renderizarProductos(lista) {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    if (lista.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-secondary py-4">No se encontraron productos coincidentes.</div>`;
        return;
    }

    lista.forEach(p => {
        const cardHTML = `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="card h-100 gamer-card text-white">
                    <img src="${p.imagen}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${p.nombre}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-blue small">${p.codigo}</span>
                            <span class="badge bg-dark border border-secondary text-secondary small">${p.categoria}</span>
                        </div>
                        <h5 class="card-title fw-bold">${p.nombre}</h5>
                        <p class="card-text text-secondary small flex-grow-1">${p.descripcion.substring(0, 70)}...</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="product-price">$${p.precio.toLocaleString('es-CL')}</span>
                            <div class="btn-group">
                                <button class="btn btn-outline-light btn-sm" onclick="verDetalles('${p.id}')">Ver</button>
                                <button class="btn btn-neon-primary btn-sm" onclick="agregarAlCarrito('${p.id}')">Anadir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// Renderizar Productos Recomendados
function renderizarRecomendados() {
    const grid = document.getElementById("recommended-grid");
    const recomendados = productosData.filter(p => p.recomendado);
    grid.innerHTML = "";

    recomendados.forEach(p => {
        const cardHTML = `
            <div class="col-12 col-md-4">
                <div class="card h-100 gamer-card text-white border-electric">
                    <div class="card-body">
                        <span class="badge bg-success mb-2">Recomendado</span>
                        <h5 class="fw-bold mb-1">${p.nombre}</h5>
                        <p class="small text-secondary mb-2">${p.categoria}</p>
                        <p class="product-price mb-3">$${p.precio.toLocaleString('es-CL')}</p>
                        <button class="btn btn-electric btn-sm w-100" onclick="agregarAlCarrito('${p.id}')">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// Filtros de Búsqueda
function inicializarFiltros() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");

    const aplicarFiltros = () => {
        const query = searchInput.value.toLowerCase().trim();
        const cat = categoryFilter.value;

        const filtrados = productosData.filter(p => {
            const coincideTexto = p.nombre.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query);
            const coincideCategoria = (cat === "all") || (p.categoria === cat);
            return coincideTexto && coincideCategoria;
        });

        renderizarProductos(filtrados);
    };

    searchInput.addEventListener("input", aplicarFiltros);
    categoryFilter.addEventListener("change", aplicarFiltros);
}

// Gestión del Carrito
function agregarAlCarrito(productoId) {
    const prod = productosData.find(p => p.id === productoId);
    if (!prod) return;

    const itemExistente = carrito.find(item => item.id === productoId);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    actualizarCarrito();
    alert(`${prod.nombre} fue añadido al carrito.`);
}

function actualizarCarrito() {
    const tbody = document.getElementById("cart-table-body");
    const countBadge = document.getElementById("cart-count");
    tbody.innerHTML = "";

    let totalItems = 0;
    let subtotal = 0;

    carrito.forEach(item => {
        totalItems += item.cantidad;
        const itemSubtotal = item.precio * item.cantidad;
        subtotal += itemSubtotal;

        const row = `
            <tr>
                <td><strong>[${item.codigo}]</strong> ${item.nombre}</td>
                <td>$${item.precio.toLocaleString('es-CL')}</td>
                <td>
                    <input type="number" min="1" class="form-control gamer-input form-control-sm" value="${item.cantidad}" onchange="cambiarCantidad('${item.id}', this.value)">
                </td>
                <td>$${itemSubtotal.toLocaleString('es-CL')}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${item.id}')">Eliminar</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    const descuento = esEstudianteDuoc ? subtotal * 0.20 : 0;
    const totalFinal = subtotal - descuento;

    countBadge.textContent = totalItems;
    document.getElementById("cart-subtotal").textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;
    document.getElementById("cart-discount").textContent = `-$${descuento.toLocaleString('es-CL')} CLP`;
    document.getElementById("cart-total").textContent = `$${totalFinal.toLocaleString('es-CL')} CLP`;
}

function cambiarCantidad(id, nuevaCantidad) {
    const cant = parseInt(nuevaCantidad);
    const item = carrito.find(i => i.id === id);
    if (item && cant > 0) {
        item.cantidad = cant;
        actualizarCarrito();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
});

// Ver Detalles y Reseñas
function verDetalles(productoId) {
    productoSeleccionado = productosData.find(p => p.id === productoId);
    if (!productoSeleccionado) return;

    document.getElementById("modalProductTitle").textContent = productoSeleccionado.nombre;
    document.getElementById("modalProductCode").textContent = `CODIGO: ${productoSeleccionado.codigo}`;
    document.getElementById("modalProductImg").src = productoSeleccionado.imagen;
    document.getElementById("modalProductDesc").textContent = productoSeleccionado.descripcion;
    document.getElementById("modalProductOrigin").textContent = productoSeleccionado.origen;
    document.getElementById("modalProductPrice").textContent = `$${productoSeleccionado.precio.toLocaleString('es-CL')} CLP`;

    renderizarReseñas();

    const productModal = new bootstrap.Modal(document.getElementById("productModal"));
    productModal.show();
}

function renderizarReseñas() {
    const list = document.getElementById("reviewsList");
    list.innerHTML = "";

    if (!productoSeleccionado.reseñas || productoSeleccionado.reseñas.length === 0) {
        list.innerHTML = `<p class="text-secondary small italic">Aun no hay resenas para este producto. Se el primero en calificar.</p>`;
        return;
    }

    productoSeleccionado.reseñas.forEach(r => {
        list.innerHTML += `
            <div class="border-bottom border-secondary pb-2 mb-2">
                <div class="small text-neon-green">Calificacion: ${r.rating} / 5</div>
                <p class="small text-white mb-0">${r.comentario}</p>
            </div>
        `;
    });
}

document.getElementById("add-review-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!productoSeleccionado) return;

    const rating = parseInt(document.getElementById("reviewRating").value);
    const comentario = document.getElementById("reviewComment").value;

    productoSeleccionado.reseñas.push({ rating, comentario });
    document.getElementById("reviewComment").value = "";
    renderizarReseñas();
});

// Mapa de Eventos
function inicializarMapaEventos() {
    const mapElement = document.getElementById("events-map");
    if (!mapElement) return;

    const map = L.map('events-map').setView([-33.4489, -70.6693], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const eventos = [
        { cdn: [-33.4489, -70.6693], titulo: "Sede Santiago: Torneo Esports Duoc UC", fecha: "15 de Octubre, 2026" },
        { cdn: [-33.0472, -71.6127], titulo: "Sede Valparaíso: GameFest LevelUp", fecha: "22 de Octubre, 2026" },
        { cdn: [-36.8201, -73.0444], titulo: "Sede Concepción: Arena Gamer Sur", fecha: "05 de Noviembre, 2026" }
    ];

    eventos.forEach(e => {
        L.marker(e.cdn).addTo(map)
            .bindPopup(`<b>${e.titulo}</b><br>Fecha: ${e.fecha}<br><small class="text-success">+50 Puntos LevelUp por asistencia</small>`);
    });
}

// Registro y Validación
function inicializarFormularios() {
    const registerForm = document.getElementById("register-form");

    registerForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const nombre = document.getElementById("nombre").value;

        if (correo.endsWith("@duocuc.cl") || correo.endsWith("@profesor.duoc.cl")) {
            esEstudianteDuoc = true;
            alert(`Bienvenido ${nombre}. Se ha verificado tu correo institucional. Obtienes un 20% de descuento automático en tus compras.`);
        } else {
            esEstudianteDuoc = false;
            alert(`Bienvenido ${nombre}. Tu cuenta fue creada exitosamente.`);
        }

        document.getElementById("user-points").textContent = "100 pts";
        document.getElementById("profile-points").textContent = "100 pts";
        document.getElementById("user-level").textContent = "Gamer Promesa (Nivel 2)";
        document.getElementById("prof-name").value = nombre;

        actualizarCarrito();
    });
}