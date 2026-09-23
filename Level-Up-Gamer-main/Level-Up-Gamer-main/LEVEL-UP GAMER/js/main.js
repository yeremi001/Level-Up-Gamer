'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GESTIÓN DE PRODUCTOS Y CARRITO (LOCALSTORAGE)
    // ==========================================
    const baseProductos = [
        { id: "JM001", categoria: "Juegos de Mesa", nombre: "Catan: El Juego", precio: 39990, descripcion: "Construye caminos, pueblos y ciudades para dominar la isla de Catan." },
        { id: "JM002", categoria: "Juegos de Mesa", nombre: "Carcassonne", precio: 29990, descripcion: "Crea el mapa medieval loseta a loseta y controla caminos y fortalezas." },
        { id: "AC001", categoria: "Accesorios", nombre: "Soporte para Auriculares RGB", precio: 19990, descripcion: "Base de aluminio con iluminación RGB personalizable y puertos USB 3.0." },
        { id: "CS001", categoria: "Consolas", nombre: "PlayStation 5 Digital Edition", precio: 529900, descripcion: "Consola de ultima generación con almacenamiento SSD ultra rápido." },
        { id: "CG001", categoria: "Computadores Gamers", nombre: "PC Gamer LevelUp Alpha", precio: 1199990, descripcion: "Intel Core i7, 32GB RAM DDR5, SSD 1TB, tarjeta de video RTX 4070." },
        { id: "SG001", categoria: "Sillas Gamers", nombre: "Silla Gamer Pro Ergonomic", precio: 189990, descripcion: "Respaldo reclinable hasta 180 grados, cojines lumbares y apoyabrazos 4D." },
        { id: "MS001", categoria: "Mouse", nombre: "Mouse Inalámbrico Hero 25K", precio: 49990, descripcion: "Sensor óptico de alta precisión con hasta 25.600 DPI." },
        { id: "MP001", categoria: "Mousepad", nombre: "Mousepad Extra Large RGB", precio: 15990, descripcion: "Superficie de microtextura antideslizante de 900x400mm." },
        { id: "PL001", categoria: "Poleras Personalizadas", nombre: "Polera Gamer Duoc Esports", precio: 14990, descripcion: "Polera 100% algodón con estampado reflectante de la comunidad." }
    ];

    if (!localStorage.getItem("levelup_productos")) {
        localStorage.setItem("levelup_productos", JSON.stringify(baseProductos));
    }

    let carrito = JSON.parse(localStorage.getItem("levelup_carrito")) || [];

    function actualizarContadorCarrito() {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);
    }
    actualizarContadorCarrito();

    // ==========================================
    // 2. VALIDACIONES DE NEGOCIO
    // ==========================================
    const Validaciones = {
        rut: (rut) => {
            const cleanRUT = rut.replace(/[.-]/g, '').trim().toUpperCase();
            if (cleanRUT.length < 7 || cleanRUT.length > 9) return false;
            const body = cleanRUT.slice(0, -1);
            const dv = cleanRUT.slice(-1);
            if (!/^\d+$/.test(body)) return false;
            
            let sum = 0, multiplier = 2;
            for (let i = body.length - 1; i >= 0; i--) {
                sum += parseInt(body.charAt(i), 10) * multiplier;
                multiplier = multiplier === 7 ? 2 : multiplier + 1;
            }
            const expectedDVNum = 11 - (sum % 11);
            const expectedDV = expectedDVNum === 11 ? '0' : expectedDVNum === 10 ? 'K' : expectedDVNum.toString();
            return dv === expectedDV;
        },
        edadMayor18: (fechaNacStr) => {
            if (!fechaNacStr) return false;
            const birthDate = new Date(fechaNacStr);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            return age >= 18;
        },
        correoRegistro: (email) => {
            const regex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
            return regex.test(email);
        },
        correoRFC2822: (email) => {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(email);
        },
        passwordSegura: (pass) => {
            const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{4,10}$/;
            return regex.test(pass);
        }
    };

    function mostrarError(input, mensaje, esInvalido) {
        const errorSpan = input.nextElementSibling;
        if (esInvalido) {
            errorSpan.textContent = mensaje;
            errorSpan.style.display = 'block';
            input.classList.add('input-error');
        } else {
            errorSpan.style.display = 'none';
            input.classList.remove('input-error');
        }
    }

    // ==========================================
    // 3. FORMULARIO DE REGISTRO
    // ==========================================
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        const regionesData = {
            "Región Metropolitana": ["Santiago", "Providencia", "Maipú", "Puente Alto", "La Florida"],
            "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
            "Región del Bío Bío": ["Concepción", "Talcahuano", "Chillán"]
        };

        const selectRegion = document.getElementById('region');
        const selectComuna = document.getElementById('comuna');

        Object.keys(regionesData).forEach(reg => {
            selectRegion.innerHTML += `<option value="${reg}">${reg}</option>`;
        });

        selectRegion.addEventListener('change', (e) => {
            const comunas = regionesData[e.target.value] || [];
            selectComuna.innerHTML = '<option value="">Seleccione Comuna...</option>';
            if (comunas.length > 0) {
                selectComuna.disabled = false;
                comunas.forEach(c => selectComuna.innerHTML += `<option value="${c}">${c}</option>`);
            } else {
                selectComuna.disabled = true;
            }
        });

        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;

            const run = document.getElementById('run');
            const runInvalido = !Validaciones.rut(run.value);
            mostrarError(run, 'RUT inválido (ej: 19011022K sin puntos ni guión)', runInvalido);
            if (runInvalido) esValido = false;

            const nombre = document.getElementById('nombre');
            mostrarError(nombre, 'Requerido (Máx 50)', !nombre.value || nombre.value.length > 50);
            if (!nombre.value || nombre.value.length > 50) esValido = false;

            const apellidos = document.getElementById('apellidos');
            mostrarError(apellidos, 'Requerido (Máx 100)', !apellidos.value || apellidos.value.length > 100);
            if (!apellidos.value || apellidos.value.length > 100) esValido = false;

            const correo = document.getElementById('correo');
            const correoInvalido = !Validaciones.correoRegistro(correo.value);
            mostrarError(correo, 'Solo @duoc.cl, @profesor.duoc.cl o @gmail.com', correoInvalido);
            if (correoInvalido) esValido = false;

            const fecha = document.getElementById('fechaNacimiento');
            const menorEdad = !Validaciones.edadMayor18(fecha.value);
            mostrarError(fecha, 'Debes ser mayor de 18 años.', menorEdad);
            if (menorEdad) esValido = false;

            const dir = document.getElementById('direccion');
            mostrarError(dir, 'Requerido (Máx 300)', !dir.value || dir.value.length > 300);
            if (!dir.value || dir.value.length > 300) esValido = false;

            if (esValido) {
                alert('¡Registro exitoso! Bienvenido a Level-Up Gamer.');
                formRegistro.reset();
                selectComuna.disabled = true;
            }
        });
    }

    // ==========================================
    // 4. FORMULARIO DE LOGIN
    // ==========================================
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;

            const correo = document.getElementById('login-correo');
            const correoInvalido = !Validaciones.correoRFC2822(correo.value) || correo.value.length > 100;
            mostrarError(correo, 'Formato RFC2822 requerido (Máx 100 char)', correoInvalido);
            if (correoInvalido) esValido = false;

            const pass = document.getElementById('login-pass');
            const passInvalida = !Validaciones.passwordSegura(pass.value);
            mostrarError(pass, '4-10 chars, alfanumérica, 1 símbolo especial.', passInvalida);
            if (passInvalida) esValido = false;

            if (esValido) {
                alert('Inicio de sesión exitoso.');
                window.location.href = 'index.html';
            }
        });
    }

    // ==========================================
    // 5. RENDERIZADO DEL CATÁLOGO
    // ==========================================
    function renderCatalogo() {
        const grid = document.getElementById("catalogo-grid") || document.getElementById("destacados-grid");
        if (!grid) return;

        const cat = document.getElementById("filtro-categoria")?.value || "";
        const nom = document.getElementById("filtro-nombre")?.value.toLowerCase() || "";

        const prods = JSON.parse(localStorage.getItem("levelup_productos")) || [];
        const res = prods.filter(p => (cat === "" || p.categoria === cat) && p.nombre.toLowerCase().includes(nom));

        grid.innerHTML = res.map(p => `
            <div class="card">
                <div>
                    <span style="color:#1E90FF; font-size:0.8rem; font-weight:bold;">[${p.id}] ${p.categoria}</span>
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion}</p>
                </div>
                <div>
                    <p class="precio">$${p.precio.toLocaleString("es-CL")}</p>
                    <button onclick="agregarAlCarrito('${p.id}')" class="btn-primary">AÑADIR AL CARRITO</button>
                </div>
            </div>
        `).join("");
    }

    document.getElementById("filtro-categoria")?.addEventListener("change", renderCatalogo);
    document.getElementById("filtro-nombre")?.addEventListener("input", renderCatalogo);
    renderCatalogo();

    window.agregarAlCarrito = function(id) {
        const prods = JSON.parse(localStorage.getItem("levelup_productos")) || [];
        const p = prods.find(i => i.id === id);
        if (!p) return;

        const item = carrito.find(i => i.id === id);
        if (item) item.cantidad++;
        else carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 });

        localStorage.setItem("levelup_carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();
        alert(`¡${p.nombre} añadido al carrito!`);
    };

    // ==========================================
    // 6. RENDERIZADO DEL CARRITO DE COMPRAS
    // ==========================================
    function renderCarrito() {
        const tbody = document.getElementById("carrito-body");
        if (!tbody) return;

        let tot = 0;

        tbody.innerHTML = carrito.map(i => {
            const sub = i.precio * i.cantidad;
            tot += sub;
            return `
                <tr>
                    <td style="padding: 10px;">${i.nombre}</td>
                    <td style="padding: 10px;">$${i.precio.toLocaleString("es-CL")}</td>
                    <td style="padding: 10px;">${i.cantidad}</td>
                    <td style="padding: 10px;">$${sub.toLocaleString("es-CL")}</td>
                    <td style="padding: 10px;"><button onclick="quitarCarrito('${i.id}')" class="btn-primary" style="background-color: #ff4d4d; width: auto; padding: 5px 10px;">Quitar</button></td>
                </tr>
            `;
        }).join("");

        document.getElementById("carrito-total").textContent = `$${tot.toLocaleString("es-CL")} CLP`;
    }
    renderCarrito();

    window.quitarCarrito = function(id) {
        carrito = carrito.filter(i => i.id !== id);
        localStorage.setItem("levelup_carrito", JSON.stringify(carrito));
        renderCarrito();
        actualizarContadorCarrito();
    };

    window.vaciarCarrito = function() {
        carrito = [];
        localStorage.setItem("levelup_carrito", JSON.stringify([]));
        renderCarrito();
        actualizarContadorCarrito();
    };

    // ==========================================
    // 7. ADMINISTRACIÓN DE PRODUCTOS (CRUD)
    // ==========================================
    function renderTablaAdmin() {
        const tbody = document.getElementById("tabla-admin-body");
        if (!tbody) return;
        const prods = JSON.parse(localStorage.getItem("levelup_productos")) || [];
        tbody.innerHTML = prods.map(p => `
            <tr>
                <td style="padding: 10px;">${p.id}</td>
                <td style="padding: 10px;">${p.categoria}</td>
                <td style="padding: 10px;">${p.nombre}</td>
                <td style="padding: 10px;">$${p.precio.toLocaleString("es-CL")}</td>
                <td style="padding: 10px;"><button onclick="eliminarProducto('${p.id}')" class="btn-primary" style="background-color: #ff4d4d; width: auto; padding: 5px 10px;">Eliminar</button></td>
            </tr>
        `).join("");
    }
    renderTablaAdmin();

    const formAdmin = document.getElementById("form-admin-producto");
    if (formAdmin) {
        formAdmin.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("admin-id").value.trim();
            const prods = JSON.parse(localStorage.getItem("levelup_productos")) || [];

            if (prods.some(p => p.id === id)) {
                alert("Ya existe un producto con ese código.");
                return;
            }

            const nuevo = {
                id: id,
                categoria: document.getElementById("admin-categoria").value,
                nombre: document.getElementById("admin-nombre").value.trim(),
                precio: parseInt(document.getElementById("admin-precio").value),
                descripcion: document.getElementById("admin-descripcion").value.trim()
            };

            prods.push(nuevo);
            localStorage.setItem("levelup_productos", JSON.stringify(prods));
            formAdmin.reset();
            renderTablaAdmin();
            alert("Producto guardado correctamente.");
        });
    }

    window.eliminarProducto = function(id) {
        let prods = JSON.parse(localStorage.getItem("levelup_productos")) || [];
        prods = prods.filter(p => p.id !== id);
        localStorage.setItem("levelup_productos", JSON.stringify(prods));
        renderTablaAdmin();
    };
});