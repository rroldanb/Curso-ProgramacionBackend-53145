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

Handlebarshlp.registerHelper('calculateQtty', function(products) {
  let total = 0;
  products.forEach(product => {
    total +=  product.quantity;
  });
  return total
});

Handlebarshlp.registerHelper('toPesos', function(monto) {
  return monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
});

Handlebarshlp.registerHelper('ifOr', function(v1, v2, options) {
  if(v1 || v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebarshlp.registerHelper('hasDocument', function (docName, documents) {
  if (!documents || !Array.isArray(documents)) {
    return false;
  }
  return documents.some(doc => doc.name === docName);
});

Handlebarshlp.registerHelper('formatDate', function (date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
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
