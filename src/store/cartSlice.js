// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
let userData = localStorage.getItem("user_profile")
userData = userData ? JSON.parse(userData) : null;
let location = localStorage.getItem("pickedLocation")
location = location ? JSON.parse(location) : null;

const calcuTotalPriceCart = (dishes) => {

    let totalPrice = dishes?.reduce((total, item) => {
        var totalPriceOps = 0;
        item.options?.forEach((option) => {
            totalPriceOps += option.items?.reduce((totalItem, item) => totalItem + item.quantity * item.price, 0)
        })
        return (total + item?.price * item.quantity) + totalPriceOps;
    }, 0)
    return totalPrice;
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        CartList: [
        ]
    },
    reducers: {
        addDishesToCart: (state, action) => {
            const cartIndex = state.CartList?.findIndex(cart => cart?.resData?.resId === action.payload?.resData?.resId);
            if (cartIndex >= 0) {
                let Cart = state.CartList[cartIndex];
                const index = Cart.dishes?.findIndex(item => {
                    const prev = { ...item };
                    const next = { ...action.payload.dishes };
                    delete prev.quantity;
                    delete next.quantity;
                    return JSON.stringify(prev) == JSON.stringify(next)
                });
                if (index >= 0) {
                    Cart.dishes[index] = { ...Cart.dishes[index], quantity: Cart.dishes[index].quantity + action.payload.dishes.quantity };
                } else {
                    Cart.dishes = [...Cart.dishes, action.payload.dishes];
                }

                const totalPrice = calcuTotalPriceCart(Cart.dishes);
                console.log([{
                    dishes: Cart.dishes,
                    totalPrice: totalPrice
                }]);
                state.CartList[cartIndex] = {
                    dishes: Cart.dishes,
                    totalPrice: totalPrice,
                    resData: action.payload.resData
                }

            } else {
                let Cart = {
                    dishes: [action.payload.dishes],
                    totalPrice: 0,
                    resData: action.payload.resData
                }

                const totalPrice = calcuTotalPriceCart(Cart.dishes);
                state.CartList = [
                    ...state?.CartList,
                    {
                        ...Cart,
                        totalPrice: totalPrice
                    }
                ]

            }

        },
        deCreaseQty: (state, action) => {
            const cartIndex = state.CartList?.findIndex(cart => cart?.resData?.resId === action.payload?.idRestaurant);
            let Cart = state.CartList[cartIndex];
            const dishIndex = action.payload.index;
            const currentQty = Cart.dishes[dishIndex].quantity;

            if (currentQty <= 1) {
                state.CartList[cartIndex].dishes?.splice(dishIndex, 1);
            } else {
                Cart.dishes[dishIndex] = { ...Cart.dishes[dishIndex], quantity: currentQty - 1 }
            }
            const totalPrice = calcuTotalPriceCart(Cart.dishes)
            state.CartList[cartIndex] = { ...Cart, totalPrice: totalPrice };
        },
        inCreaseQty: (state, action) => {
            const cartIndex = state.CartList?.findIndex(cart => cart?.resData?.resId === action.payload?.idRestaurant);
            let Cart = state.CartList[cartIndex];
            const dishIndex = action.payload.index;
            const currentQty = Cart.dishes[dishIndex].quantity;

            Cart.dishes[dishIndex] = { ...Cart.dishes[dishIndex], quantity: currentQty + 1 }
            const totalPrice = calcuTotalPriceCart(Cart.dishes)
            state.CartList[cartIndex] = { ...Cart, totalPrice: totalPrice };

        },
        clearCart: (state, action) => {
            const cartIndex = state.CartList?.findIndex(cart => cart?.resData?.resId === action.payload?.idRestaurant);
            state.CartList?.splice(cartIndex, 1);
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

export const { addDishesToCart, inCreaseQty, deCreaseQty, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
