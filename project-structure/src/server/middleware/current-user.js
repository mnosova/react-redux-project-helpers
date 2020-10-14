export default app => {
  app.use((req, res, next) => {
    if (req.xhr) {
      return next();
    }

    let { token } = req.session;

    if (!token) {
      return next();
    }

    let { user: { cartSettings } = {} } = req.session;

    return req.api.fetch('user.info').then((user) => {
      if (!user) {
        throw ({ message: 'user not found' });
      }

      req.session.user = user;
      if(cartSettings) {
        req.session.user.cartSettings = cartSettings;
      }

      if (req.session.default_address) {
        req.session.user.default_address = req.session.default_address;
      }

      return next();
    }).catch(error => {
      next(error);
    });
  });

  app.use(function (error, req, res, next) {
    console.error(error);
    delete req.session.token;
    delete req.session.user;
    next();
  });
};
