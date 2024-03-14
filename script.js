let productos = [
    {id: 1, nombre: "Mouse Logitech", precio: 5000, stock: 3, rutaImagen:"./images/mouse.png"},
    {id: 4, nombre: "Teclado Redragon", precio: 4000, stock: 6, rutaImagen: "./images/teclado.png"},
    {id: 7, nombre: "Auriculares Rog Strix", precio: 12000, stock: 4, rutaImagen: "./images/auriculares.png"},
    {id: 10, nombre: "Monitor Level Up", precio: 50000, stock: 2, rutaImagen: "./images/monitor1.png"},
    {id: 11, nombre: "Monitor Sentey", precio: 30000, stock: 5, rutaImagen: "./images/monitor2.png"},
    {id: 13, nombre: "Parlantes Logitech", precio: 18000, stock: 2, rutaImagen: "./images/parlantes.png"},
    {id: 16, nombre: "Notebook Dell", precio: 250000, stock: 1, rutaImagen: "./images/notebook.png"}
];

const storedProductos = localStorage.getItem('productos');
if (storedProductos) {
    productos = JSON.parse(storedProductos);
}

function mostrarProductos() {
    const productosDiv = document.getElementById("productos");
    productosDiv.innerHTML = "";
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.id = `card-${producto.id}`;
        card.innerHTML = `
            <img src="${producto.rutaImagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <p class="stock">Stock: ${producto.stock}</p> 
            <p class="mensaje-stock"></p>
            <input type="number" class="cantidad-input" min="1" max="${producto.stock}" value="1">
            <button class="agregar-carrito-btn">Agregar al carrito</button>
        `;
        productosDiv.appendChild(card);
        const agregarCarritoBtn = card.querySelector('.agregar-carrito-btn');
        agregarCarritoBtn.addEventListener("click", () => agregarAlCarrito(producto));
    });
}

function agregarAlCarrito(producto) {
    const cantidadInput = document.getElementById(`card-${producto.id}`).querySelector(".cantidad-input");
    const cantidad = parseInt(cantidadInput.value);
    if (cantidad > producto.stock) {
        const mensajeStock = document.getElementById(`card-${producto.id}`).querySelector(".mensaje-stock");
        mensajeStock.textContent = "¡Lo sentimos! ¡Ha superado el stock disponible para este producto!";
        return;
    }
    if (cantidad <= 0) {
        const mensajeStock = document.getElementById(`card-${producto.id}`).querySelector(".mensaje-stock");
        mensajeStock.textContent = "Por favor, seleccione una cantidad válida.";
        return;
    }
    const carrito = document.getElementById("carrito");
    const productoExistente = Array.from(carrito.children).find(elem => elem.dataset.id === producto.id.toString());

    if (productoExistente) {
        const cantidadElemento = productoExistente.querySelector(".cantidad");
        cantidadElemento.textContent = parseInt(cantidadElemento.textContent) + cantidad;
    } else {
        const li = document.createElement("li");
        li.dataset.id = producto.id;
        li.innerHTML = `
            ${producto.nombre} - $${(producto.precio * cantidad).toFixed(2)} <span class="cantidad">${cantidad}</span>
        `;
        carrito.appendChild(li);
    }

    producto.stock -= cantidad;
    actualizarStockEnCard(producto);
    calcularTotalCarrito();

    localStorage.setItem('carrito', JSON.stringify(Array.from(carrito.children)));
}

function actualizarStockEnCard(producto) {
    const stockElement = document.getElementById(`card-${producto.id}`).querySelector(".stock");
    stockElement.textContent = `Stock: ${producto.stock}`;
}

function calcularTotalCarrito() {
    const carrito = document.getElementById("carrito");
    const totalCarrito = document.getElementById("total-carrito");
    let total = 0;

    Array.from(carrito.children).forEach(elem => {
        const id = parseInt(elem.dataset.id);
        const producto = productos.find(prod => prod.id === id);
        if (producto) {
            const cantidad = parseInt(elem.querySelector(".cantidad").textContent);
            total += producto.precio * cantidad;
        }
    });

    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;

    localStorage.setItem('totalCarrito', total.toFixed(2));
}

function pagarEnEfectivo() {
    const totalCarritoElement = document.getElementById("total-carrito");
    const total = parseFloat(totalCarritoElement.textContent.replace("Total: $", ""));
    return total;
}

function pagarEnCuotas() {
    const cuotasInput = document.getElementById("cuotasInput");
    const cuotas = parseInt(cuotasInput.value);
    if (cuotas >= 2 && cuotas <= 6) {
        const totalCarritoElement = document.getElementById("total-carrito");
        const totalCarrito = parseFloat(totalCarritoElement.textContent.replace("Total: $", ""));
        const interes = (cuotas * 20) / 100;
        const totalConInteres = totalCarrito * (1 + interes);
        const importePorCuota = totalConInteres / cuotas;
        return { totalConInteres: totalConInteres, importePorCuota: importePorCuota };
    } else {
        return { totalConInteres: 0, importePorCuota: 0 };
    }
}

document.getElementById("pagarEfectivo").addEventListener("click", function() {
    const total = pagarEnEfectivo();
    mensaje.innerHTML = "El total a pagar en efectivo es: " + total.toFixed(2);
});

document.getElementById("pagarCuotas").addEventListener("click", function() {
    const { totalConInteres, importePorCuota } = pagarEnCuotas();
    if (totalConInteres !== 0) {
        mensaje.innerHTML = `El total a pagar en cuotas es: ${totalConInteres.toFixed(2)}. Importe por cuota: ${importePorCuota.toFixed(2)}`;
    } else {
        mensaje.innerHTML = `Por favor, seleccione un número válido de cuotas (entre 2 y 6).`;
    }
});

window.onload = mostrarProductos;