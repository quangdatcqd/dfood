import React, { useEffect, useState } from 'react';
import './style.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Dialog } from '@mui/material';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import StarIcon from "../../assets/images/start.png"
import VoucherIcon from "../../assets/images/1.png"
import partnerIcon from "../../assets/images/partner_logo.png"
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RestaurantAPI } from '../../HTTP/BaeminHttp';
import { useSelector, useDispatch } from 'react-redux';
import { setRestaurantDialog } from '../../store/dialog';
import { addDishesToCart, inCreaseQty, deCreaseQty, clearCart } from '../../store/cartSlice'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';
import { CloseOutlined } from '@mui/icons-material';
import { setCheckoutDialog } from '../../store/checkout';

const Checkout = () => {
    const checkoutDialog = useSelector(state => state.checkout.checkoutDialog);
    const dispatch = useDispatch();
    const matches = useMediaQuery('(max-width:500px)');
    const matchesMD = useMediaQuery('(max-width:770px)');
    const openDlgCheckout = () => {
        dispatch(setCheckoutDialog)
    }

    return (
        <>
            <Dialog open={checkoutDialog} onClose={() => openDlgCheckout(false)} maxWidth={"xl"} fullWidth={true} fullScreen={matchesMD || matches}>
                dsdf
            </Dialog>
        </>
    );
}
export default Checkout;
