import Stripe from 'stripe';
import config from '../config';

export const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: '2024-12-18.acacia', // Use a valid version
  typescript: true,
});
