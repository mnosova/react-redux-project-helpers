import apiMethods from '../helpers/api-methods';

export default app => {
  app.use((req, res, next) => {
    req.api = apiMethods(req);
    next();
  });
};
