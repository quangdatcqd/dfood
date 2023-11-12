import React, { useState } from 'react';
import headerCss from './Header.module.css'
import SearchPlace from './components/SearchPlace';
import HeaderNotification from './components/HeaderNotification';
import HeaderOrders from './components/HeaderOrders';
import HeaderCart from './components/HeaderCart';
import HeaderProfile from './components/HeaderProfile';
import MenuIcon from '@mui/icons-material/Menu';
const Head = ({ inputLocationFocused, setInputLocationFocused }) => {
    return (
        <div className={headerCss.rowHeader}>
            <div className={headerCss.headerDiv}>
                <div className={headerCss.headerDivLeft}>
                    <div className={headerCss.textLogo}>DFood</div>
                    {/* <div className={headerCss.linkPage}>
                        <a href="">Home</a>
                        <a href="">About</a>
                    </div> */}
                    <SearchPlace inputLocationFocused={inputLocationFocused} setInputLocationFocused={setInputLocationFocused} />
                </div>
                {/* <div className={headerCss.headerDivCenter}>

                </div> */}
                <div className={headerCss.headerDivRight}>
                    <div className={headerCss.headerButtonDiv}>
                        <HeaderProfile />
                        <HeaderCart />
                        <HeaderOrders />
                        <HeaderNotification />
                    </div>
                    {
                        !inputLocationFocused && <MenuIcon className={headerCss.menuButton} />
                    }

                </div>
            </div>
        </div >

    );
}

export default Head;
