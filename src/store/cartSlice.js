// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
let userData = localStorage.getItem("user_profile")
userData = userData ? JSON.parse(userData) : null;
let location = localStorage.getItem("pickedLocation")
location = location ? JSON.parse(location) : null;

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        dishes: []
    },
    reducers: {
        addDishesToCart: (state, action) => {
            state.dishes = [...state.dishes, action.payload];

        },
        removeDishesToCart: (state, action) => {
        },
        clearCart: state => {

        },
    },
});

// {
//     toAddress: location?.location?.structured_formatting?.main_text + "," + location?.detail?.result?.formatted_address,
//         toAddressDetail: "",
//             toLocation: [
//                 location?.detail?.geometry?.location?.lng,
//                 location?.detail?.geometry?.location?.lat
//             ],
//                 payment: {
//         method: "CASH"
//     },
//     deliveryType: "1P_OWNFLEET_DH",
//         toPhone: userData?.phone,
//             memo: null,
//                 userId: userData?.id,
//                     merchantId: "J8vUhnAIo",
//                         cartRule: {
//         code: []
//     }
// }

export const { addDishesToCart, removeDishesToCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
