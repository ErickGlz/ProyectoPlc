let productos = [];
let ticket = JSON.parse(localStorage.getItem("ticket")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
const pagina = window.location.pathname;

function guardarTicket() {
    localStorage.setItem("ticket", JSON.stringify(ticket));
}

function mostrarTicket() {
    const ticketDiv = document.getElementById("ticket");
    const totalSpan = document.getElementById("total");
    if (!ticketDiv || !totalSpan) return;

    ticketDiv.innerHTML = "";
    let total = 0;

    for (let i = 0; i < ticket.length; i++) {
        const item = ticket[i];
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "ticket-item";
        div.innerHTML = `
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${subtotal.toFixed(2)}</span>
        `;
        ticketDiv.appendChild(div);
    }

    totalSpan.textContent = total.toFixed(2);
}

function mostrarVentas() {
    const ventasRecientes = document.getElementById("ventasRecientes");
    if (!ventasRecientes) return;

    ventasRecientes.innerHTML = "";
    for (let i = 0; i < ventas.length; i++) {
        const v = ventas[i];
        let texto = "";
        for (let j = 0; j < v.productos.length; j++) {
            const p = v.productos[j];
            texto += `${p.nombre} x${p.cantidad} ($${(p.precio * p.cantidad).toFixed(2)})`;
            if (j < v.productos.length - 1) texto += ", ";
        }

        const div = document.createElement("div");
        div.className = "venta";
        div.innerHTML = `
            <strong>${v.fecha}</strong><br>
            <em>${texto}</em><br>
            <strong>Total:</strong> $${v.total.toFixed(2)}
        `;
        ventasRecientes.appendChild(div);
    }
}

// Menú
if (pagina.includes("index.html") || pagina.endsWith("/")) {
    const nombreProducto = document.getElementById("nombreProducto");
    const precioProducto = document.getElementById("precioProducto");
    const imagenProducto = document.getElementById("imagenProducto");
    const btnAgregar = document.getElementById("btnAgregar");
    const listaProductos = document.getElementById("listaProductos");

    btnAgregar.onclick = function () {
        const nombre = nombreProducto.value.trim();
        const precio = parseFloat(precioProducto.value);
        const imagen = imagenProducto.value.trim();

        if (nombre === "" || isNaN(precio) || precio <= 0) {
            alert("Datos inválidos");
            return;
        }

        const nuevo = {
            nombre: nombre,
            precio: precio,
            imagen: imagen === "" ? "" : imagen
        };

        productos.push(nuevo);
        nombreProducto.value = "";
        precioProducto.value = "";
        imagenProducto.value = "";
        mostrarProductos();
    };

    function mostrarProductos() {
        listaProductos.innerHTML = "";
        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>$${p.precio.toFixed(2)}</p>
            `;
            div.onclick = function () {
                agregarAlTicket(i);
            };
            listaProductos.appendChild(div);
        }
    }

    function agregarAlTicket(index) {
        const prod = productos[index];
        let existe = false;

        for (let i = 0; i < ticket.length; i++) {
            if (ticket[i].nombre === prod.nombre) {
                ticket[i].cantidad += 1;
                existe = true;
                break;
            }
        }

        if (!existe) {
            ticket.push({
                nombre: prod.nombre,
                precio: prod.precio,
                cantidad: 1
            });
        }

        guardarTicket();
        alert("Producto agregado al ticket.");
    }

    mostrarProductos();
}

// Ticket
if (pagina.includes("ticket.html")) {
    const btnCancelar = document.getElementById("btnCancelar");
    const btnCobrar = document.getElementById("btnCobrar");

    mostrarTicket();

    btnCancelar.onclick = function () {
        const codigo = prompt("Ingrese el codigo de supervisor:");
        if (codigo === "1234") {
            ticket = [];
            localStorage.removeItem("ticket");
            mostrarTicket();
            alert("Ticket cancelado.");
        } else {
            alert("Codigo incorrecto.");
        }
    };

    btnCobrar.onclick = function () {
        if (ticket.length === 0) {
            alert("No hay productos en el ticket.");
            return;
        }

        const total = parseFloat(document.getElementById("total").textContent);
        const venta = {
            fecha: new Date().toLocaleString(),
            total: total,
            productos: JSON.parse(JSON.stringify(ticket))
        };

        ventas.push(venta);
        localStorage.setItem("ventas", JSON.stringify(ventas));

        alert("Venta realizada con éxito.");
        ticket = [];
        localStorage.removeItem("ticket");
        mostrarTicket();
    };
}

// Ventas
if (pagina.includes("ventas.html")) {
    mostrarVentas();
}
