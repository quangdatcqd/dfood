// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const showDialog = createSlice({
    name: 'dialog',
    initialState: {
        restaurantDialog: false,
        idRestaurant: null,
    },
    reducers: {
        setRestaurantDialog: (state, action) => {
            state.restaurantDialog = action.payload;

        },
        setRestaurantId: (state, action) => {
            state.idRestaurant = action.payload;
            state.restaurantDialog = true;
        }
    },
});

export const { setRestaurantDialog, setRestaurantId } = showDialog.actions;

export default showDialog.reducer;
