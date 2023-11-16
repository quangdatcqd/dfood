// store.js
import { configureStore } from '@reduxjs/toolkit';
import cart from './cartSlice';
import dialog from './dialog';
import checkout from './checkout';

export const store = configureStore({
    reducer: {
        cart: cart,
        dialog: dialog,
        checkout: checkout
    },
});
