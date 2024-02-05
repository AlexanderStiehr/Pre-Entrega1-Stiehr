alert("Este sitio sirve para calcular pagos en cuotas sobre un monto determinado");
let importe = Number(prompt("Ingrese el importe del producto"));
let mensaje = "Ingrese una opción\n1 - Pago en efectivo\n2 - Pago en cuotas\n0 - Salir"; 
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
        alert("El monto final de su producto es: $" + importe);
    } else if (opcion === 2) {
        let cuotas = Number(prompt("Ingrese la cantidad de cuotas en las que desea abonar"));
        calcularImporteFinal(importe, cuotas);
    } else if (opcion < 0 || opcion > 2 || isNaN(opcion)) {
        alert("Opción incorrecta, ingrese otra opción");
    } else if (opcion === 0) {
        alert("Gracias por su visita, hasta luego!");
    }
} while (opcion !== 0);