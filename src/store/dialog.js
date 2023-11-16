// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const showDialog = createSlice({
    name: 'dialog',
    initialState: {
        restaurantDialog: false,
        checkoutDialog: false,
        idRestaurant: null,
    },
    reducers: {
        setRestaurantDialog: (state, action) => {
            state.restaurantDialog = action.payload;

        },
        setRestaurantId: (state, action) => {
            state.idRestaurant = action.payload;
            state.restaurantDialog = true;
        },
        setCheckoutDialog: (state, action) => {
            state.checkoutDialog = action.payload
        }
    },
});

export const { setRestaurantDialog, setCheckoutDialog, setRestaurantId } = showDialog.actions;

export default showDialog.reducer;
