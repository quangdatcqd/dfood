import React, { useState, useEffect } from 'react';
import styleCss from './Style.module.css';

import PersonIcon from '@mui/icons-material/Person';
import Login from './Login';
import DialogReponsive from '../../components/DialogReponsive';
const HeaderProfile = () => {
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState("Đăng Nhập");
    useEffect(() => {
        const profile = localStorage.getItem("user_profile") !== "undefined" ? JSON.parse(localStorage.getItem("user_profile")) : "";
        profile?.name && setUserName(profile?.name)
    }, []);
    return (
        <>
            <div className={styleCss.headerButton} onClick={() => {
                if (userName === "Đăng Nhập") setOpen(true)
            }}>
                <PersonIcon />
                <span>{userName}</span>

            </div>
            <Login setOpen={setOpen} open={open} />
        </>
    );
}

export default HeaderProfile;
