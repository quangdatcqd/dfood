import React from 'react';
import styleCss from './Style.module.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
const HeaderCart = () => {
    const CartList = useSelector(state => state.cart.CartList);


    return (
        <div className={`${styleCss.headerButton} ${styleCss.headerCartDiv}`}>
            <div className={`${styleCss.HeaderCart}`}>
                <ShoppingCartIcon />
                <span>Giỏ hàng</span>
                <span className={styleCss.badgeQty}>{CartList?.length}</span>
            </div>
            <div className={`${styleCss.HeaderOrderBox} ${styleCss.headerCartBox}`}>
                <p style={{ margin: "10px 0px 0px 10px", padding: "0px", fontSize: "16px" }}>Giỏ hàng của bạn</p>

                <div className={styleCss.listCartItem}>
                    {
                        CartList?.map((item, index) => {
                            const grandTotalPrice = item?.totalPrice?.toLocaleString("vi", { style: "currency", currency: "VND" });
                            const totalDishes = item?.dishes?.reduce((total, dish) => total + dish.quantity, 0)
                            return <div className={styleCss.HeaderCartItem} key={index}  >
                                <img width={60} src={item?.resData?.resImage} alt="" />
                                <div className={styleCss.divDesCartItem}>
                                    <p>{item?.resData?.resName}</p>
                                    <p >{item?.resData?.resAddress}</p>
                                    <p > <b>{grandTotalPrice}</b>  - {totalDishes} Món </p>
                                </div>
                            </div>
                        })

                    }
                </div>

            </div>
        </div >
    );
}

export default HeaderCart;
