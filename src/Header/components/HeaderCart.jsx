import React from 'react';
import styleCss from './Style.module.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const HeaderCart = () => {
    return (
        <div className={styleCss.headerButton}>
            <ShoppingCartIcon />
            <span>Giỏ hàng</span>
        </div>
    );
}

export default HeaderCart;
