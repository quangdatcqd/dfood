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

const Restaurant = ({ idRestaurant, open, setOpen }) => {
    const matches = useMediaQuery('(max-width:500px)');
    const matchesMD = useMediaQuery('(max-width:770px)');

    const [dataRestaurant, setDataRestaurant] = useState(null);
    useEffect(() => {
        (!dataRestaurant && idRestaurant) && setOpen(false)
        setDataRestaurant([])
        const fetchRestaurant = async () => {
            const data = await RestaurantAPI.getRestaurant(idRestaurant);
            setDataRestaurant(data)
        }
        fetchRestaurant();
    }, [idRestaurant]);
    return (
        <Dialog open={open} onClose={() => setOpen(false)} setOpen={setOpen} maxWidth={"xl"} fullWidth={true} fullScreen={matchesMD || matches}>
            <div className='containerInfo'>
                {dataRestaurant &&
                    <div className='boxRestaurant'>
                        <div className='boxRestaurantInfo'>
                            <p className='btnCloseDialog' > <KeyboardBackspaceIcon className='CloseIconI' onClick={() => setOpen(false)} /></p>

                            <img src={dataRestaurant?.imageUrl} alt="" />

                            <div className='divRestaurantInfo'>
                                <div className='divRestaurantDes'>

                                    <p className='partnerTitle'>
                                        <img src={partnerIcon} alt="" />
                                        {
                                            dataRestaurant?.isPartner &&
                                            "ĐỐI TÁC CỦA BAEMIN  "
                                        }</p>
                                    <p className='restaurantName'>{dataRestaurant?.name}</p>
                                    <p className='restaurantProperty'>{(dataRestaurant?.distance / 1000).toFixed(2)}km - {dataRestaurant?.name}</p>
                                    <p className='restaurantProperty' style={{ color: "red", fontWeight: "bold" }}>{
                                        !dataRestaurant?.isAvailable ? (dataRestaurant?.closeReason ? dataRestaurant?.closeReason : "Nhà hàng đóng cửa") : '*'
                                    }</p>

                                </div>
                            </div>

                            <div className='divRestaurantDes1'>
                                <div className='restaurantGrBook'>

                                    <span>   <GroupAddOutlinedIcon style={{ fontSize: "18px", marginBottom: "-3px", paddingRight: "5px" }} />Đơn nhóm</span>
                                    <span>Tạo đơn</span>
                                </div>
                                {
                                    dataRestaurant?.coupons?.items?.length > 0 &&
                                    <div className='restaurantCoupon'>
                                        <p> <img src={VoucherIcon} alt="" /><span> {dataRestaurant?.coupons?.items[0]?.name}</span></p>
                                        <span>Xem thêm</span>
                                    </div>
                                }

                                <div className='restaurantReview'>
                                    <div className='restaurantRvProperty'>
                                        <img src={StarIcon} alt="" />
                                        <p>   &nbsp;
                                            <b>{dataRestaurant?.rating?.score}</b>&nbsp;-&nbsp;<span style={{ fontWeight: "normal" }}> {dataRestaurant?.rating?.totalRatings}</span>
                                            &nbsp;.
                                            &nbsp;
                                            <ShoppingBasketOutlinedIcon style={{ fontSize: "20px", marginTop: "-4px" }} />
                                            &nbsp;
                                            <span style={{ fontWeight: "normal" }}> {dataRestaurant?.rating?.totalOrders} </span> &nbsp; đã bán
                                        </p>
                                    </div>
                                    <span style={{ cursor: "pointer" }}>Xem đánh giá</span>
                                </div>
                            </div>
                            {/* <div className='dialogCustom'></div> */}
                        </div>
                        <div className='boxRestaurantDis'>
                            {
                                dataRestaurant?.dishes?.find((item) => item?.isFeatured === true) &&
                                <div className={"sectionDishes"}  >
                                    <p className='sectionDishesTitle'>Nhất định phải thử</p>
                                    <div className='boxRestaurantItem'>
                                        {
                                            dataRestaurant?.dishes?.map((item, index) => {
                                                if (item?.isFeatured) {
                                                    return <div className="restaurantDishesBox" key={index}>
                                                        {
                                                            item?.isSoldOut && <div className='layerSoldOut'></div>
                                                        }
                                                        <img src={item?.imageUrl} />
                                                        <div className='resTaurantDisDes' >
                                                            <p >{item?.name}</p>
                                                            <p className='resTaurantDisDesP1'><i><strike>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</strike></i>  </p>
                                                            <p className='resTaurantDisDesP1' style={{ fontWeight: 'bold' }}>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </p>
                                                        </div>
                                                    </div>
                                                }

                                            })
                                        }
                                    </div>
                                </div>

                            }



                            {
                                dataRestaurant?.sections?.map((section, index) => {
                                    const isShowCurrentBox = dataRestaurant?.dishes?.find((item) => item?.sectionId === section?.id)
                                    if (isShowCurrentBox)
                                        return <div className={"sectionDishes"} key={index} >
                                            <p className='sectionDishesTitle'>{section?.name}</p>
                                            <div className='boxRestaurantItem'>
                                                {
                                                    dataRestaurant?.dishes?.map((item, index) => {
                                                        if (item?.sectionId === section?.id) {
                                                            return <div className="restaurantDishesBox" key={index}>
                                                                {
                                                                    item?.isSoldOut && <div className='layerSoldOut'></div>
                                                                }
                                                                <img src={item?.imageUrl} />
                                                                <div className='resTaurantDisDes' >
                                                                    <p className=' resTaurantDisDesP1 '>{item?.name}</p>
                                                                    <p className='resTaurantDisDesP1 resTaurantDisDesP'>{item?.description?.replace(/\&nbsp;/g, " ")}</p>
                                                                    <p className='resTaurantDisDesP1'><i><strike>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</strike></i>  </p>
                                                                    <p className='resTaurantDisDesP1' style={{ fontWeight: 'bold' }}>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </p>
                                                                </div>
                                                            </div>
                                                        }

                                                    })
                                                }
                                            </div>
                                        </div>

                                })
                            }
                        </div>

                    </div>
                }
            </div>


        </Dialog>
    );
}



export default Restaurant;
