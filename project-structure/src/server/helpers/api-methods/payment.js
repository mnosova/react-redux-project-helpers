export default (req, request) => ({
  'payment.register': (params={}) => {
    return request('payment/register_transaction', params);
  },
  'payment.check_status': (params={}) => {
    return request('payment/check_payment_status', params);
  }
});
