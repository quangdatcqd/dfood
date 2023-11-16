// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const showDialog = createSlice({
    name: 'checkout',
    initialState: {
        checkoutDialog: false,
    },
    reducers: {
        setCheckoutDialog: (state, action) => {
            state.checkoutDialog = action.payload
        }
    },
});

export const { setCheckoutDialog } = showDialog.actions;

export default showDialog.reducer;
