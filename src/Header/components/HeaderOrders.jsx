import React, { useEffect, useState } from 'react';
import styleCss from './Style.module.css';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Order } from '../../HTTP/BaeminHttp';
const HeaderOrders = () => {
    const [listOrders, setListOrders] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await Order.listOrders();
            setListOrders(data?.docs)
        }
        fetchData()
    }, []);
    return (
        <div className={styleCss.headerButton}>
            <ReceiptLongIcon />
            <span>Đơn hàng</span>
            <div className={styleCss.HeaderOrderBox}>
                <p>Đơn hàng của bạn</p>

                {
                    listOrders?.map((item, index) => {
                        const method = item?.payment?.method == "CASH" ? "Tiền mặt" : "";
                        const grandTotalPrice = item?.grandTotalPrice?.toLocaleString("vi", { style: "currency", currency: "VND" });
                        const dishes = item?.dishes;
                        return <div className={styleCss.HeaderNotiItem} key={index}>
                            <p>{item?.fromName}</p>
                            <span >{grandTotalPrice} ({method}) - {dishes?.length} Món</span>
                        </div>
                    })

                }

            </div>
        </div>
    );
}

export default HeaderOrders;
