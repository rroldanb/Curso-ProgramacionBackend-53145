const handlebars = require('express-handlebars');
const Handlebarshlp = require('handlebars');

Handlebarshlp.registerHelper('multiply', function(a, b) {
  const cleanA = parseFloat(a.replace(/[^0-9.-]+/g, ""));
  const cleanB = parseFloat(b);
  if (isNaN(cleanA) || isNaN(cleanB)) {
    return 0;
  }
  const resultado = cleanA * cleanB;
  return resultado.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
});

Handlebarshlp.registerHelper('calculateTotal', function(products) {
  let total = 0;
  products.forEach(product => {
    total += parseFloat(product.pid.price.replace(/[^0-9.-]+/g, "")) * product.quantity;
  });
  return total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
});

module.exports = function(app) {
  return handlebars.create({
    defaultLayout: "main",
    handlebars: Handlebarshlp,
    layoutsDir: app.get("views") + "/layouts",
    partialsDir: app.get("views") + "/partials",
    extname: ".hbs",
  });
};
