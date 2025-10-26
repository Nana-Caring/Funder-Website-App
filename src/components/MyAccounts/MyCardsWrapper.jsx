import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import MyCards from './MyAccounts';

// Load Stripe with your public key
const stripePromise = loadStripe('pk_test_51REGFbROeQRel9O58mOSulLZR25JiDCo0FqwlrhopxEUuFh68lZXNTKYDer8334RrTFGBvlsKdkPMFbvzLbaoA4X00OLIDpVtW');

const MyCardsWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <MyCards />
    </Elements>
  );
};

export default MyCardsWrapper;
