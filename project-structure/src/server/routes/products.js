export default (app) => {
  app.post('/api/product', (req, res) => {

  });

  app.get('/api/city_products', (req, res) => {
    req.api.fetch('products.city')
      .then(data => res.json(data))
      .catch(({ response: { data } = {} } = {}) => {
        res.status(500).json(data);
      });
  });
};
