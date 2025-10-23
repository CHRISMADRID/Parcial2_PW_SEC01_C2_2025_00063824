
import express from 'express';
import cuentas from './const.js';


const app = express();

const port = 3130;

const obtenerCuentas = (request, response) => {
  const { busqueda } = request.query;

  if (busqueda && busqueda.trim() !== "") {
    const busquedaLower = busqueda.toLowerCase();

    const resultados = cuentas.filter(cuenta => {
      if (cuenta._id === busqueda) return true;
      if (cuenta.name.toLowerCase().includes(busquedaLower)) return true;
      if (cuenta.gender.toLowerCase() === busquedaLower) return true;
      return false;
    });

    return response.send({
      encontrado: resultados.length > 0,
      cuenta: resultados.length === 1 ? resultados[0] : undefined,
      data: resultados.length > 1 ? resultados : undefined
    });
  }

  response.send({
    cantidad: cuentas.length,
    data: cuentas
  });
};

const obtenerCuentaId = (request, response) => {
  const { id } = request.params;
  let cuentaEncontrada = null;

  for (let i = 0; i < cuentas.length; i++) {
    if (cuentas[i]._id == id) {
      cuentaEncontrada = cuentas[i];
      break;
    }
  }

  response.send({
    encontrado: cuentaEncontrada ? true : false,
    cuenta: cuentaEncontrada
  });
};

const obtenerTotal = (request, response) => {
  let total = 0;
  let hayActivas = false;

  for (let i = 0; i < cuentas.length; i++) {
    if (cuentas[i].isActive) {
      let valor = parseFloat(cuentas[i].balance.replace(/[$,]/g, ""));
      total += valor;
      hayActivas = true;
    }
  }

  response.send({
    status: hayActivas,
    balanceTotal: "$" + total.toFixed(2)
  });
};

app.get("/cuentas", obtenerCuentas);
app.get("/cuentas/:id", obtenerCuentaId);
app.get("/cuentasBalance", obtenerTotal);

app.listen(port);