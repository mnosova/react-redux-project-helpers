
//провнряем на эпл пей и на привязанные карты
isApplePay = () => {
  const merchantIdentifier = 'merchant.ru.sushiwok.sushiwok';
  this.setState({
    isApplePay: window.ApplePaySession && window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
  });
};
///const {payment_type} =this.state
const payment_type = 'ap'

// api('cart.create', order)
let url = '/order-status';
//редирект на отдельную страницу с кнопкой эпл пей
if(payment_type === 'ap') url += '/apple_payment';


class ApplePayment extends Component {

  constructor (props) {
    super(props);
    const { country_id } = globalStore.get('current_city');
    const { lang } = session.get();

    this.state = {
      currency: unitCurrency(country_id, lang, true),
      cart: session.get('cart') || {},
      lang: lang
    };
  }

  //редирект на спасибо за заказ
  redirectToOrder = () => {
    const { order_hash, order_salt, t } = this.props;
    if (!order_hash) {
      return this.commonError( t('OrderPayment.unknown_order') );
    }
    window.location.replace(`/order-status/${order_hash}/${order_salt}`);
  };

//подтверждение оплаты
  confirmApplePay=({ target })=>{
    const { cart: { total, order: { delivery_price = 0 } = {} } = {} } = this.state;
    const { order_hash } = this.props;

    // eventBus.emitEvent('confirm_order', [{
    //   payment: 'apple_pay'
    // }]);

//создаем валидный реквест
    const paymentRequest = {
      total: {
        label: 'sushiwok.ru',
        amount: +total + +delivery_price
      },
      countryCode: 'RU',
      currencyCode: 'RUB',
      merchantCapabilities: ['supports3DS'],
      supportedNetworks: ['masterCard', 'visa']
    };
//открываем сессию передаем реквест
    const applePaySession = new window.ApplePaySession(1, paymentRequest);
//начинаем сессию, дизейлим кнопку
    applePaySession.begin();
    target.disabled = true;
    //получаем ответ от сессии, на событие
    applePaySession.onvalidatemerchant = (event) => {
      //это нужно чтобы получить validationURL и отправить его бекенду
      const params = {
        validation_url: event.validationURL,
        domain: 'qa.sushiwok.ru',
        payment_text: `Оплата заказа #${order_hash}`
      };
      //стучимся к бекенду
      api('payment.validate_applepay_merchant', params)
        .then((merchantSession) => {
          //получаем валидную сессию и переадаем в нашу сессию
          applePaySession.completeMerchantValidation(merchantSession);
          target.disabled = false;
        })
        .catch(() => {
          //если что то пошло не так, прирываем сессию
          this.applePaySession.abort();
        });
    };
//ждем пока наша сессия получит валиную с бека, на событие авторизации продолжаем работу
    applePaySession.onpaymentauthorized = (event) => {
      //берем токен платежа
      const token = Buffer.from(JSON.stringify(event.payment.token.paymentData)).toString('base64');
      const params = {
        order_hash: order_hash,
        payment_token: token
      };
//отправляем бекенду
      api('payment.apple_pay', params)
        .then((result) => {
          //елси все ок заверщаем сесссию со статусом успех
          if (result.success === true) {
            applePaySession.completePayment(window.ApplePaySession.STATUS_SUCCESS);
            //редирект на страницу спасибо за заказ
            this.redirectToOrder();
          } else {
            //если не ок завешаем сессию со статусом провал
            applePaySession.completePayment(window.ApplePaySession.STATUS_FAILURE);
          }
        }).
      catch(() => {
        applePaySession.completePayment(window.ApplePaySession.STATUS_FAILURE);
      });
    };


  };
  render () {
    const { t, order_hash } = this.props;
    const { currency, cart:{ total, order: { delivery_price = 0 } = {} } = {} , lang } = this.state;

    return (
      <div className="page-container apple-payment__page">
        <div className="inner-part-B">
          <Logo/>
          <div className="title">{ 'Оплата через Apple Pay' }</div>
          {
            order_hash && <p className="hash">{ `Заказ № ${order_hash}` }</p>
          }
          {total && <p className="sum">{t('OrderPayment.sum_to_pay')} {+total + +delivery_price} {currency}</p>}
          <div className="main-cart-modal__btn-container">
            <button lang={lang} className="apple-pay-btn" onClick={this.confirmApplePay}/>
          </div>
        </div>
      </div>
    );
  }
}