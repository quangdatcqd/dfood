import React, { useCallback, useEffect, useState } from 'react';
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
import { generateRandomString } from '../../helper';
import { CloseOutlined } from '@mui/icons-material';

const RestaurantDialog = () => {
    const idRestaurant = useSelector(state => state.dialog.idRestaurant);
    const open = useSelector(state => state.dialog.restaurantDialog);

    var Cart = useSelector(state => state.cart);
    var Cart = Cart?.CartList?.find(merchant => {
        return merchant?.resData?.resId === idRestaurant ? merchant : null;
    });
    const cartTotalPrice = Cart?.totalPrice || 0;
    const listDishes = Cart?.dishes || [];

    const dispatch = useDispatch();
    const matches = useMediaQuery('(max-width:500px)');
    const matchesMD = useMediaQuery('(max-width:770px)');
    const [dialogOption, setDialogOption] = useState(false);
    const [dialogCart, setDialogCart] = useState(false);
    const [optionData, setOptionData] = useState(null);
    const [dataRestaurant, setDataRestaurant] = useState(null);

    const setOpen = (state) => {
        dispatch(setRestaurantDialog(state));
    };
    useEffect(() => {
        const fetchRestaurant = async () => {
            const data = await RestaurantAPI.getRestaurant(idRestaurant);
            setDataRestaurant(data)
        }
        if (idRestaurant) {
            // setOpen(true)
            setDataRestaurant(null)
            fetchRestaurant();
        }

    }, [idRestaurant, open]);
    const handleSelectDishes = (data) => {
        setOptionData(data);
        setDialogOption(true)
    }
    useEffect(() => {
        // console.log(listDishes);
    }, [listDishes]);
    const handleQtyDown = (index) => {
        dispatch(deCreaseQty({ idRestaurant, index }));
    }
    const handleQtyUp = (index) => {
        dispatch(inCreaseQty({ idRestaurant, index }));
    }
    const handleClearCart = () => {
        dispatch(clearCart(idRestaurant));
    }
    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth={"xl"} fullWidth={true} fullScreen={matchesMD || matches}>
                {dataRestaurant &&
                    <div className='containerInfo'>
                        <div className='boxRestaurant'>
                            <div className='boxRestaurantInfo' >
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
                                {
                                    listDishes?.length > 0 &&
                                    <div className='dishesSlectPreview'>

                                        <div onClick={() => setDialogCart(true)}>
                                            <ShoppingBasketRoundedIcon />
                                            <span>{listDishes?.reduce((total, item) => total + item?.quantity, 0)}</span>
                                        </div>
                                        <div>Tổng: {
                                            cartTotalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                                        {
                                            dialogCart &&
                                            <div className='boxCart'>
                                                <div className='boxCartBar'>
                                                    <CloseOutlined className='closeCartDiv' onClick={() => setDialogCart(false)} />
                                                    <span>Giỏ hàng</span>
                                                    <span onClick={() => handleClearCart()}>Xoá</span></div>
                                                <div className='boxListCart'>{
                                                    listDishes?.map((dish, index) => {

                                                        var totalPrice = dish?.price * dish.quantity;
                                                        var description = [];
                                                        dish?.options?.forEach((option) => {
                                                            option?.items?.forEach(item => {
                                                                description.push(item?.name)
                                                                totalPrice += item?.price * item.quantity;
                                                            })
                                                        })

                                                        return <div className='divCart' key={index}>
                                                            <p>{dish?.name}</p>
                                                            <p>{description.join(", ")}</p>
                                                            <div className='cartPriceQty'>
                                                                <span>{totalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                                                <div className='boxOpsLeft boxOpsMulti'>
                                                                    <div onClick={() => handleQtyDown(index)} ><RemoveRoundedIcon sx={{ fontSize: "14px!important" }} /></div>
                                                                    <div className='divOpsQuantity'>{dish?.quantity}</div>
                                                                    <div onClick={() => handleQtyUp(index)} ><AddRoundedIcon sx={{ fontSize: "14px!important" }} /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })
                                                }</div>
                                            </div>
                                        }
                                    </div>
                                }

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
                                                        return <div className="restaurantDishesBox" key={index}  >
                                                            {
                                                                item?.isSoldOut && <div className='layerSoldOut'></div>
                                                            }
                                                            <img src={item?.imageUrl} onClick={() => handleSelectDishes(item)} />
                                                            <div className='resTaurantDisDes' onClick={() => handleSelectDishes(item)}>
                                                                <p >{item?.name}</p>
                                                                <p className='resTaurantDisDesP1'><i><strike>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</strike></i>  </p>
                                                                <p className='resTaurantDisDesP1' style={{ fontWeight: 'bold' }}>{item?.price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </p>
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
                                                                return <div className="restaurantDishesBox" key={index} >
                                                                    {
                                                                        item?.isSoldOut && <div className='layerSoldOut'></div>
                                                                    }
                                                                    <img src={item?.imageUrl} onClick={() => handleSelectDishes(item)} />
                                                                    <div className='resTaurantDisDes' onClick={() => handleSelectDishes(item)} >
                                                                        <p className=' resTaurantDisDesP1 '>{item?.name}</p>
                                                                        <p className='resTaurantDisDesP1 resTaurantDisDesP'>{item?.description?.replace(/\&nbsp;/g, " ")}</p>
                                                                        <p className='resTaurantDisDesP1'><i><strike>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</strike></i>  </p>
                                                                        <p className='resTaurantDisDesP1' style={{ fontWeight: 'bold' }}>{item?.price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </p>
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
                    </div>
                }
            </Dialog>
            {
                dialogOption &&
                <SelectOptions setDialogOption={setDialogOption} dialogOption={dialogOption}
                    optionData={optionData}
                    fullScreen={matchesMD || matches}
                    resData={{
                        resId: dataRestaurant?.id,
                        resName: dataRestaurant?.name,
                        resImage: dataRestaurant?.imageUrl,
                        resAddress: dataRestaurant?.address
                    }}  >

                </SelectOptions>
            }
        </>
    );
}


function SelectOptions({ optionData, setDialogOption, dialogOption, fullScreen, resData }) {

    const dispatch = useDispatch();
    const [dishes, setDishes] = useState({
        quantity: 1,
        dishId: optionData?.id,
        options: null,
        totalPrice: 0,
        name: optionData?.name
    });
    const [pricePreview, setPricePreview] = useState(null);

    const handleCloseDialog = () => {
        setDialogOption(false)
        setDishes({
            quantity: 1,
            dishId: optionData?.id,
            options: null,
            name: optionData?.name
        })
        setPricePreview(() => null);
    }

    const handleChangeMultiOps = (item, optionId, itemQty = 1, type = 0) => {
        let options = dishes?.options ? dishes?.options : [];
        if (itemQty <= 0) {
            options = options?.filter((option) => option?.optionId !== optionId)
            setDishes({
                quantity: dishes?.quantity || 1,
                dishId: optionData?.id,
                options: options || null,
                name: optionData?.name
            })
            return;
        }
        const checkOption = options?.findIndex((option) => option?.optionId === optionId)
        if (checkOption >= 0) {
            if (type === 0) {
                options[checkOption] = {
                    optionId: optionId,
                    items: [
                        {
                            price: item?.price,
                            itemId: item?.id,
                            quantity: itemQty,
                            name: item?.name,
                        }
                    ]
                }
            }
            else {
                var items = options[checkOption]?.items;
                const checkItem = items?.findIndex((itemF) => itemF?.itemId === item?.id)
                if (checkItem >= 0) {
                    items[checkItem] = { ...items[checkItem], quantity: itemQty }
                } else {
                    items = [
                        ...items,
                        {
                            price: item?.price,
                            itemId: item?.id,
                            quantity: itemQty,
                            name: item?.name,
                        }]
                }
                options[checkOption] = {
                    optionId: optionId,
                    items: items
                }
            }

        } else {
            options?.push({
                optionId: optionId,
                items: [
                    {
                        price: item?.price,
                        itemId: item?.id,
                        quantity: itemQty,
                        name: item?.name,
                    }
                ]
            })
        }
        setDishes({
            quantity: dishes?.quantity || 1,
            dishId: optionData?.id,
            options: options || null,
            name: optionData?.name,
        })
    }
    const handleQtyUp = () => {
        setDishes({ ...dishes, quantity: dishes?.quantity + 1 })
    }
    const handleQtyDown = () => {
        if (dishes?.quantity > 0)
            setDishes({ ...dishes, quantity: dishes?.quantity - 1 })
    }
    useEffect(() => {
        let totalOptionPrice = 0;
        dishes?.options?.forEach(option => {
            var price = 0;
            option?.items.forEach(item => {
                price += (item?.price * item?.quantity)
            });
            totalOptionPrice += price;
        });
        totalOptionPrice += dishes?.quantity * optionData?.price;
        setPricePreview(totalOptionPrice)
    }, [dishes]);
    const handleSelectDishes = () => {
        if (dishes?.quantity > 0)
            dispatch(addDishesToCart({
                dishes: {
                    ...dishes,
                    price: optionData?.price
                },
                resData: resData
            }))
        handleCloseDialog(false)
    }

    return <>
        <Dialog open={dialogOption} onClose={() => handleCloseDialog(false)} maxWidth={"xl"} fullScreen={fullScreen}  >
            {optionData &&
                <div className='containerInfo'>
                    <div className='boxRestaurant'>
                        <div className='boxRestaurantInfo' style={{ width: "100px" }}>
                            <p className='btnCloseDialog' > <KeyboardBackspaceIcon className='CloseIconI' onClick={() => handleCloseDialog(false)} /></p>
                            <img src={optionData?.imageUrl} alt="" />

                            <div className='   divOptionsInfo'  >
                                <p className='restaurantName'>{optionData?.name}</p>
                                <p className='restaurantProperty'> {optionData?.description}</p>
                                <p className='restaurantProperty' style={{ color: "red", fontWeight: "bold" }}>
                                    {optionData?.price?.toLocaleString("vi", { style: "currency", currency: "VND" })}
                                    &nbsp; &nbsp;
                                    <i><strike style={{ color: "gray" }} >{optionData?.originalPrice?.toLocaleString("vi", { style: "currency", currency: "VND" })}</strike></i>
                                </p>
                                <textarea
                                    className='restaurantNote'
                                    placeholder='Ghi chú cho nhà hàng'
                                />
                            </div>
                            <div className='boxOpsSelectedInfo'>
                                <div className='boxOpsLeft'>
                                    <div><RemoveRoundedIcon onClick={() => handleQtyDown()} /></div>
                                    <div className='divOpsQuantity'>{dishes?.quantity}</div>
                                    <div><AddRoundedIcon onClick={() => handleQtyUp()} /></div>
                                </div>
                                <div className='boxOpsRight' onClick={() => handleSelectDishes()}>
                                    {
                                        dishes?.quantity <= 0 ? "Đóng"
                                            :
                                            pricePreview ?
                                                pricePreview?.toLocaleString("vi", { style: "currency", currency: "VND" })
                                                : "Chọn Topping"
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            optionData?.options?.length > 0 &&

                            <div className='boxRestaurantDis'>
                                {
                                    optionData?.options?.map((option, index) => {
                                        return <div className={"sectionDishes"} key={index} >
                                            <p className='sectionDishesTitle' style={{ paddingBottom: "3px" }}>{option?.name}</p>
                                            {
                                                option?.required ? <p className='requireOptionDes' style={{ color: "orange" }}>Chọn ít nhất {option?.minQuantity} mục</p> : <p className='requireOptionDes' style={{ color: "gray" }}>Chọn ít tối đa {option?.maxQuantity} mục</p>
                                            }
                                            <div className='boxRestaurantItem'>
                                                {
                                                    option?.items?.map((item, index) => {

                                                        return <div className="restaurantDishesBox" key={index} style={{ display: "flex", alignItems: "center", width: "calc( 100% - 15px)" }} >
                                                            {/* <div className='boxOpsSelectedInfo ' style={{ position: "static", width: "auto", padding: "0px" }}>
                                                                <div className='boxOpsLeft boxOpsMulti'>
                                                                    <div><RemoveRoundedIcon sx={{ fontSize: "14px!important" }} /></div>
                                                                    <div className='divOpsQuantity'>15</div>
                                                                    <div><AddRoundedIcon sx={{ fontSize: "14px!important" }} /></div>
                                                                </div>
                                                            </div> */}
                                                            <div className='resTaurantDisDes' style={{ display: "flex", justifyContent: "space-between", width: "100%" }} >
                                                                {
                                                                    option?.maxQuantity === 1 ?
                                                                        <div className='boxOpsRadio' onClick={() => handleChangeMultiOps(item, option?.id)}>
                                                                            <input type="radio" name={option?.id} id={item?.id} />
                                                                            <label htmlFor={item?.id}>{item?.name}</label>
                                                                        </div>
                                                                        :
                                                                        <OptionItem item={item} option={option} handleChangeMultiOps={handleChangeMultiOps} />
                                                                }
                                                                <p className='resTaurantDisDesP1' style={{ fontWeight: 'bold' }}>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </p>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            }
        </Dialog>
    </>
}

function OptionItem({ item, handleChangeMultiOps, option }) {
    const [qty, setQty] = useState(0);
    const handleQtyDown = () => {
        if (qty > 0) setQty(qty - 1)
        handleChangeMultiOps(item, option?.id, qty - 1, 1)
    }
    const handleQtyUp = () => {
        if (qty < option?.maxQuantity) {
            setQty(qty + 1)
            handleChangeMultiOps(item, option?.id, qty + 1, 1)
        }
    }

    return <div className='boxOpsLeft boxOpsMulti'>
        {
            qty > 0 &&
            <>
                <div onClick={() => handleQtyDown()}><RemoveRoundedIcon sx={{ fontSize: "14px!important" }} /></div>
                <div className='divOpsQuantity'>{qty}</div>
            </>
        }
        <div onClick={() => handleQtyUp()}><AddRoundedIcon sx={{ fontSize: "14px!important" }} /></div>
        <p className='   ' style={{ margin: 0 }}>{item?.name}</p>
    </div>
}



export default RestaurantDialog;
