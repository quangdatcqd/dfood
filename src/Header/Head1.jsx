import React, { useState, useEffect } from 'react';
import headerCss from './Header.module.css'
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDebouncedCallback } from 'use-debounce';
import { RestaurantAPI } from '../HTTP/BaeminHttp';
import { Box, CircularProgress } from '@mui/material';
import StarRateIcon from '@mui/icons-material/StarRate';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import partnerIcon from '../assets/images/partner_logo.png'
import CloseIcon from '@mui/icons-material/Close';
import Restaurant from '../components/restaurant/Restaurant';
const Head1 = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [showBoxSearch, setShowBoxSearch] = useState(false);
    const [restaurantSelected, setRestaurantSelected] = useState("");
    const [listKeyword, setListKeyword] = useState([
        "Cơm", "Bún đậu", "Bánh tráng", "Chè", "Bánh", "Cơm gà", "Mì",
        "Gà rán", "Cà phê", "Hàn Quốc", "Cơm tấm", "Pizza", "Cháo",
        "Trà sữa", "Cháo", "Bánh mì", "Bún", "Lẩu", "Xôi"
    ]);
    const [listKeywordRecent, setListKeywordRecent] = useState([
        "Bánh mì", "Bún", "Lẩu", "Xôi"
    ]);

    const fetchSearch = useDebouncedCallback(async () => {
        setShowBoxSearch(true)
        const dataSearch = await RestaurantAPI.searchRestaurant(searchValue);
        setLoading(false)
        setSearchData(dataSearch)

    }, 100);
    const handleSearchInput = async (value) => {

        setSearchValue(value)
        if (value?.length > 2) {
            setLoading(true)
            await fetchSearch(value)
        }

    }
    const handleScroll = () => {

        if (window.innerWidth >= 500) return;
        var locationName = document.getElementById('locationName');
        var div = document.getElementById('head1Row');
        if (div === null) return;


        if (window.pageYOffset > 5) {
            // div.classList.add('head1Rowscrolled');
            div.style.transform = 'translateY(-56px)';
            div.style.paddingTop = '10px';
            div.style.backgroundColor = '#F7F7F7';
            locationName.style.display = "block";
        } else {
            // div.classList.remove('head1Rowscrolled');
            div.style.transform = 'translateY(0)';
            locationName.style.display = "none";
            div.style.paddingTop = '0px';
            div.style.backgroundColor = '#F7F7F7';
        }

    }


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll)
        };
    }, []);


    const handleSelectRestaurant = (data) => {
        setOpenDialog(true)
        setRestaurantSelected(data)
    }
    return (
        <div className={headerCss.head1Row} id='head1Row'>
            <div className={headerCss.searchItem} id='boxSearch'>
                <p className={headerCss.locationName} id='locationName'>
                    <FmdGoodIcon className={headerCss.locationIcon} />
                    498/19 Nguyễn Văn Khối </p>
                <input type="text" onFocus={() => setShowBoxSearch(true)} value={searchValue} onChange={(e) => {
                    handleSearchInput(e.target.value)
                    !showBoxSearch && setShowBoxSearch(true)
                }} placeholder='Tìm kiếm món ăn' className={headerCss.searchItemInput} />
                <CloseIcon className={headerCss.ClearLocationIcon} onClick={() => setSearchValue("")} />
                {
                    showBoxSearch &&
                    <div style={{ position: "relative" }} className={headerCss.searchItemDiv} >
                        <UnfoldMoreIcon className={headerCss.iconCloseBoxSearch} onClick={() => setShowBoxSearch(false)} />
                        <div className={headerCss.searchItemBox} >

                            {
                                loading &&
                                <Box sx={{ textAlign: "center", width: "100%", marginTop: "20px" }}>
                                    <CircularProgress size={20} />
                                </Box>
                            }
                            {
                                (searchData != null && searchValue?.length > 2) ?
                                    <div className={headerCss.boxSearchResult}>
                                        <p style={{ color: "gray" }}>{searchData?.total} nhà hàng được tìm thấy</p>
                                        <div className={headerCss.verticalList}>

                                            {searchData?.docs?.map((item, index) => {

                                                return <div className={headerCss.searchItemResult} key={index} >
                                                    <div className={headerCss.verticalItem} onClick={() => handleSelectRestaurant(item?.id)}>

                                                        <div className={headerCss?.verticalItemBoxImage}>
                                                            {item?.provideCoupon && <div className={headerCss.promoIcon} style={{ fontSize: 14 }}>PROMO</div>}
                                                            <img className={headerCss.verticalItemImage} src={item?.imageUrl}></img>
                                                            {
                                                                !item?.isAvailable && <div className={headerCss.boxIsNotAv}>Đã đóng cửa</div>
                                                            }
                                                        </div>
                                                        <div className={headerCss.verticalItemDe}>
                                                            <p className={headerCss.verticalItemDe1}>
                                                                {
                                                                    item?.isPartner && <img width={20} src={partnerIcon} />
                                                                }
                                                                {item?.name}</p>
                                                            <p className={headerCss.itemDescriptionp2}>
                                                                {
                                                                    item?.rating?.score && <span style={{ marginLeft: 18 }}>
                                                                        <StarRateIcon />
                                                                        {item?.rating?.score} <span style={{ color: "gray" }}>
                                                                            ({item?.rating?.totalRatings})</span> -

                                                                    </span>
                                                                }
                                                                &nbsp;{item?.distance && (item?.distance / 1000).toFixed(2) + "km"}
                                                            </p>

                                                        </div>

                                                    </div>
                                                    <div>
                                                        {
                                                            item?.dishes?.slice(0, 2)?.map((item, index) => {
                                                                return <div className={headerCss.dishesRecommend} key={index}>
                                                                    <img src={item?.imageUrl} />
                                                                    <div >
                                                                        <p>{item?.name}</p>
                                                                        <p><i><strike>{item?.originalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</strike></i>  </p>
                                                                        <p style={{ fontWeight: 'bold' }}>{item?.price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </p>
                                                                    </div>


                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                    :
                                    <>

                                        <div >
                                            <p ><span>Tìm kiếm gần đây</span> <span style={{ fontSize: "14px", color: "#13C0BF", cursor: "pointer" }}>Xoá</span></p>
                                            <div className={headerCss.boxRecentSearch}>
                                                {
                                                    listKeywordRecent?.map((item, index) => {
                                                        return <p key={index} onClick={() => handleSearchInput(item)}>{item} <HighlightOffIcon className={headerCss.iconRemove} /> </p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <p ><span>Món đang hot</span> </p>
                                            <div className={headerCss.boxRecentSearch}>
                                                {
                                                    listKeyword?.map((item, index) => {
                                                        return <p style={{ padding: "5px 10px" }} key={index} onClick={() => {

                                                            handleSearchInput(item)
                                                        }}>{item}</p>
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                }
            </div>
            <Restaurant open={openDialog} setOpen={setOpenDialog} idRestaurant={restaurantSelected} />
        </div>
    );
}

export default Head1;
