async function pedirDatosAlBackend() {
    try {
        const resp = await fetch("lista.json");
        const info = await resp.json();
        localStorage.setItem("productos", JSON.stringify(info));
        mostrarProductos(info);
    } catch (error) {
        lanzarTostada("Algo salió mal, error: " + error);
    }
}

let productos = [];

const storedProductos = localStorage.getItem("productos");

if (storedProductos) {
    productos = JSON.parse(storedProductos);
}

function mostrarProductos(productosData) {
    const productosDiv = document.getElementById("productos");
    productosDiv.innerHTML = "";
    productosData.forEach(producto => {
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
        lanzarTostada("¡Lo sentimos! ¡Ha superado el stock disponible para este producto!", 3000, "top", "center");
        return;
    }
    if (cantidad <= 0) {
        lanzarTostada("Por favor, seleccione una cantidad válida.", 3000, "top", "center");
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

    lanzarTostada("Producto agregado al carrito", 3000, "top", "center")
    producto.stock -= cantidad;
    actualizarStockEnCard(producto);
    calcularTotalCarrito();
    
    localStorage.setItem("carrito", JSON.stringify(Array.from(carrito.children)));
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
    localStorage.setItem("totalCarrito", total.toString()); 
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
        const totalCarrito = parseFloat(document.getElementById("total-carrito").textContent.replace("Total: $", ""));
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
    lanzarAlerta("efectivo", total.toFixed(2));
});

document.getElementById("pagarCuotas").addEventListener("click", function() {
    const { totalConInteres, importePorCuota } = pagarEnCuotas();
    const totalCarrito = parseFloat(document.getElementById("total-carrito").textContent.replace("Total: $", ""));
    if (totalCarrito > 0 && totalConInteres !== 0) {
        lanzarAlerta("cuotas", totalConInteres.toFixed(2) + ". Importe por cuota: " + importePorCuota.toFixed(2));
    } else {
        lanzarTostada("Por favor, seleccione un número válido de cuotas (entre 2 y 6)", 3000, "top", "right");
    }
});

function lanzarAlerta(pago, total) {
    Swal.fire({
        title: "Su total a pagar en " + pago + " es de " + total,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Finalizar compra",
        denyButtonText: "Cancelar compra",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("¡Gracias por su compra!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Compra cancelada", "", "error");
        }
    });
}

function lanzarTostada(text, duration, gravity, position) {
    Toastify({
        text: text,
        duration: duration,
        gravity: gravity,
        position: position
    }).showToast();
}

window.onload = pedirDatosAlBackend;