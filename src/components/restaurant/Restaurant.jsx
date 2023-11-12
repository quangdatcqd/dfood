import React from 'react';
import './style.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Dialog } from '@mui/material';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import StarIcon from "../../assets/images/start.png"
import VoucherIcon from "../../assets/images/1.png"
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';

const Restaurant = ({ data, open, setOpen }) => {
    const matches = useMediaQuery('(max-width:500px)');
    const matchesMD = useMediaQuery('(max-width:770px)');

    return (
        <Dialog open={open} setOpen={setOpen} maxWidth={"xl"} fullWidth={true} fullScreen={matchesMD || matches}>
            <div className='container'>
                <p className='btnCloseDialog' > <KeyboardBackspaceIcon sx={{ color: "#13C0BF", cursor: "pointer" }} onClick={() => setOpen(false)} /></p>
                <div className='listRestaurant'>
                    <div className='boxRestaurantInfo'>
                        <img src="https://static.baemin.vn/CH/StoreList/060807-20211028/b3bbae15-9cff-4336-b5fe-735dd008af49/store_main.jpg" alt="" />
                        <div className='divRestaurantInfo'>
                            <div className='divRestaurantDes'>
                                <p className='partnerTitle'>ĐỐI TÁC CỦA BAEMIN </p>
                                <p className='restaurantName'>Bánh Mì Bình Định 77 - Nguyễn Văn Khối</p>
                                <p className='restaurantProperty'>0.1km - 479 Nguyễn Văn Khối, Phường 8, Quận Gò Vấp, Tp HCM</p>
                                <p className='restaurantProperty' style={{ color: "red", fontWeight: "bold" }}>Tạm đóng cửa đến 23:59</p>
                            </div>
                        </div>
                        <div className='restaurantGrBook'>

                            <span>   <GroupAddOutlinedIcon style={{ fontSize: "18px", marginBottom: "-4px", paddingRight: "5px" }} />Đơn nhóm</span>
                            <span>Tạo đơn</span>
                        </div>
                        <div className='restaurantCoupon'>
                            <p> <img src={VoucherIcon} alt="" /><span> BAEMIN Khao Thêm 50K Cho Đơn Từ 199K nhóm</span></p>
                            <span>Xem thêm</span>
                        </div>
                        <div className='restaurantReview'>
                            <div className='restaurantRvProperty'>
                                <img src={StarIcon} alt="" />
                                <p>   &nbsp;
                                    <b>4.0</b>&nbsp;-&nbsp;<span style={{ fontWeight: "normal" }}> 999+ </span>
                                    &nbsp;.
                                    &nbsp;
                                    <ShoppingBasketOutlinedIcon style={{ fontSize: "20px", marginTop: "-4px" }} />
                                    &nbsp;
                                    <span style={{ fontWeight: "normal" }}> 999+ </span> &nbsp; đã bán
                                </p>
                            </div>
                            <span style={{ cursor: "pointer" }}>Xem đánh giá</span>
                        </div>
                        {/* <div className='dialogCustom'></div> */}
                    </div>

                </div>

            </div>
        </Dialog>
    );
}

export default Restaurant;
