import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styleCss from './Style.module.css';
const HeaderNotification = () => {
    return (
        <div className={styleCss.headerButton}>
            <NotificationsIcon />
            <span>Thông báo</span>
            <div className={styleCss.HeaderNotiBox}>
                <p>Thông báo</p>
                <div className={styleCss.HeaderNotiItem}>
                    <p>Đơn hàng bị huỷ</p>
                    <span>Hãy kiểm tra lại đơn hàng...</span>
                </div>
                <div className={styleCss.HeaderNotiItem}>
                    <p>Đơn hàng bị huỷ</p>
                    <span>Hãy kiểm tra lại đơn hàng...</span>
                </div>
            </div>
        </div>
    );
}

export default HeaderNotification;
