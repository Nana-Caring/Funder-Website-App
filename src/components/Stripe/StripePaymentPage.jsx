import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';

const stripePromise = loadStripe('pk_test_51REGFbROeQRel9O58mOSulLZR25JiDCo0FqwlrhopxEUuFh68lZXNTKYDer8334RrTFGBvlsKdkPMFbvzLbaoA4X00OLIDpVtW');

const StripePaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default StripePaymentPage;