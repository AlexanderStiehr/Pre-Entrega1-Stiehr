let productos = [
    {id: 1, nombre: "Mouse Logitech", precio: 5000},
    {id: 4, nombre: "Teclado Redragon", precio: 4000},
    {id: 7, nombre: "Auriculares Rog Strix", precio: 12000},
    {id: 10, nombre: "Monitor Level Up", precio: 50000},
    {id: 11, nombre: "Monitor Sentey", precio: 30000},
    {id: 13, nombre: "Parlantes Logitech", precio: 18000},
    {id: 16, nombre: "Notebook Dell", precio: 250000}
];

alert("Este sitio sirve para calcular pagos en cuotas de nuestro catálogo de productos");
let mensaje = "Ingrese una opción\n1 - Ver productos disponibles\n2 - Pago en efectivo\n3 - Pago en cuotas\n0 - Salir"; 
let opcion

function calcularImporteFinal(importe, cuotas) {
    let recargo = 0;
    if (cuotas === 2) {
        recargo = 0.2;
    } else if (cuotas === 3) {
        recargo = 0.3;
    } else if (cuotas === 4) {
        recargo = 0.4;
    } else if (cuotas === 5) {
        recargo = 0.5;
    } else if (cuotas === 6) {
        recargo = 0.6;
    } else {
        alert("Cantidad de cuotas no válida. Por favor, elija de 2 a 6 cuotas.");
        return;
    }
    const importeConRecargo = importe * (1 + recargo);
    const importeFinalPorCuota = importeConRecargo / cuotas;
    alert(`El importe final con un recargo del ${recargo * 100}% en ${cuotas} cuotas es de: $${importeConRecargo.toFixed(2)}\nEl importe por cuota es de: $${importeFinalPorCuota.toFixed(2)}`);
}

do {
    opcion = Number(prompt(mensaje));
    if (opcion === 1) {
        let listaProductos = "Productos Disponibles:\n";
        productos.forEach(producto => {
            listaProductos += `${producto.id}. ${producto.nombre} - $${producto.precio.toFixed(2)}\n`;
        });
        alert(listaProductos);
    } else if (opcion === 2) {
        let idProducto = Number(prompt("Ingrese el ID del producto que desea comprar"));
        let producto = productos.find(prod => prod.id === idProducto);
        if (producto) {
            alert(`El monto final de su producto (${producto.nombre}) es: $${producto.precio.toFixed(2)}`);
        } else {
            alert("ID de producto inválido. Por favor, elija un ID válido.");
        }
    } else if (opcion === 3) {
        let idProducto = Number(prompt("Ingrese el ID del producto que desea comprar"));
        let producto = productos.find(prod => prod.id === idProducto);
        if (producto) {
            let cuotas = Number(prompt("Ingrese la cantidad de cuotas en las que desea abonar"));
            calcularImporteFinal(producto.precio, cuotas);
        } else {
            alert("ID de producto inválido. Por favor, elija un ID válido.");
        }
    } else if (opcion === 0) {
        alert("Gracias por su visita, hasta luego!");
    } else {
        alert("Opción incorrecta, ingrese otra opción");
    }
} while (opcion !== 0);