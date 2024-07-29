const handlebars = require('express-handlebars');
const Handlebarshlp = require('handlebars');

Handlebarshlp.registerHelper('multiply', function(a, b) {
  const cleanA = parseFloat(String(a).replace(/[^0-9,.]+/g, '').replace('.', ''));
  const cleanB = parseFloat(String(b).replace(/[^0-9,.]+/g, '').replace('.', ''));
  if (isNaN(cleanA) || isNaN(cleanB)) {
    return 0;
  }
  const resultado = cleanA * cleanB;
  return resultado.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
});


Handlebarshlp.registerHelper('calculateTotal', function(products) {
  let total = 0;
  products.forEach(product => {
    total += parseFloat(product.pid.price.replace(/[^0-9,-]+/g, "")) * product.quantity;
  });
  return total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
});

Handlebarshlp.registerHelper('ifOr', function(v1, v2, options) {
  if(v1 || v2) {
    return options.fn(this);
  }
  return options.inverse(this);
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
