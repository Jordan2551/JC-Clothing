import React from 'react';
import { connect } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

import { clearCart } from '../../redux/cart/cart.actions';

const StripeCheckoutButton = ({ price, clearCart }) => {
  const priceForStripe = price * 100;
  const publishableKey = 'pk_test_DmzfNEXApId3SDWKD37NWEJQ00lhcnZ97S';

  // This function gets called when we do our stripe checkout. We send a request to the /payment routeon the server.js backend
  const onToken = (token) => {
    axios({
      url: 'payment', //axios assume this request is to our own sever so we can leave just payment
      method: 'post',
      data: {
        amount: priceForStripe,
        token,
      },
    })
      .then((response) => {
        alert(
          'Your purchase was successful! Thank you for shopping at JC Clothing!'
        );
        clearCart();
      })
      .catch((error) => {
        alert('There was an error with the payment!');
        console.log('Payment error: ', error);
      });
  };

  return (
    <StripeCheckout
      label='Pay Now'
      name='JC Clothing'
      billingAddress
      shippingAddress
      image='https://svgshare.com/i/CUz.svg'
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel='Pay Now'
      token={onToken}
      stripeKey={publishableKey}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(clearCart()),
});

export default connect(null, mapDispatchToProps)(StripeCheckoutButton);
