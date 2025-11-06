export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_TKouSAHyVyhHA9',
    priceId: 'price_1SO9GUQxwNSbkpCdNSVqcj30',
    name: 'Zero to AI Income E-Book',
    description: 'Unlock the step-by-step system to turn your knowledge into passive income using AI. Inside this practical eBook, you\'ll learn how to identify digital product ideas, create and automate your sales process with AI tools, and launch your first income-generating system in days — not months.💡 Plus: Receive 2 free bonuses — "50 Proven ChatGPT Prompts" and "Build It, Launch It, Grow It" mini website guide — instantly after purchase!',
    price: 19.99,
    currency: 'usd',
    mode: 'payment'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};