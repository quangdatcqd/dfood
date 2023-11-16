import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header';
import homeCss from './home.module.css'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { BannerAPI, RestaurantAPI } from '../HTTP/BaeminHttp';
import StarRateIcon from '@mui/icons-material/StarRate';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, CircularProgress } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import partnerIcon from '../assets/images/partner_logo.png'
import { useDispatch } from 'react-redux';
import { setRestaurantId } from '../store/dialog';
function Home() {

    const [homeData, setHomeData] = useState(null);
    const fetchHomeData = async () => {
        const data = await BannerAPI.Coordinates();
        setHomeData(data?.components);
    }
    useEffect(() => {
        fetchHomeData();
    }, []);

    return (
        <>
            {
                homeData &&
                <div className={homeCss.row}>
                    <Header />
                    {
                        homeData?.map((item, index) => {
                            if ((item?.type === "Banner" || item?.position === 1) && item?.dataBody?.total > 0) {

                                return <Banner bannerData={item} key={index} />
                            }
                            if (item?.type === "Icon") {
                                return <BoxCategories menuData={item} key={index} />
                            }
                            if (((item?.type === "Countdown Merchant Collection" && item?.header?.isInCountdownTime) || item?.type === "Merchant Collection") && item?.dataBody?.total > 0) return <BoxItems itemData={item} key={index} />
                            if (item?.type === "Campaign Group" && item?.dataBody?.total > 0) {
                                return <BoxItemPaymentPromo itemData={item} key={index} />
                            }
                            if (item?.type === "Reorder Merchants" && item?.dataBody?.total > 0) return <ReorderMerchant itemData={item} key={index} />
                            if (item?.type === "Merchant Listing" && item?.dataBody?.total > 0) return <VerticalList itemData={item} key={index} />

                        })
                    }
                    <ScrollToTop />

                </div>
            }
        </>

    );
}

function ScrollToTop() {
    const [showBtn, setShowBtn] = useState(false);
    const handleScrollToTop = () => {

        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            setShowBtn(true)
        } else {
            setShowBtn(false)

        }
    })
    return showBtn && <div className="scroll_to_top" onClick={handleScrollToTop}>
        <ExpandLessIcon sx={{ fontSize: 30 }} />
    </div>

}

function VerticalList({ itemData }) {
    const [verticalList, setVerticalList] = useState(itemData && itemData?.dataBody?.docs);
    const [loadingMB, setLoadingMB] = useState(false);
    const currentPage = useRef(itemData?.dataBody?.page);
    const isLastPage = useRef(false);
    const dispatch = useDispatch();

    const setIdRestaurant = (id) => {
        dispatch(setRestaurantId(id))
    }
    const handleLastpage = useDebouncedCallback(async () => {

        isLastPage.current = true;
        const data = await RestaurantAPI.verticalList(currentPage.current + 1, itemData?.dataUrl);
        setLoadingMB(false)
        currentPage.current = data?.dataBody?.page;
        setVerticalList([...verticalList, ...data?.dataBody?.docs]);
        isLastPage.current = false;
    }, 500)
    useEffect(() => {

        async function handleScroll() {
            const scrollableElement = document.body;
            if (window.scrollY + scrollableElement.clientHeight >= scrollableElement.scrollHeight && !isLastPage.current) {
                handleLastpage()
                setLoadingMB(true)
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return <div className={homeCss.container}  >
        <div className={homeCss.titleVertical}>
            <p>{itemData?.title}</p>
        </div>

        <div className={homeCss.verticalList}>
            {verticalList?.map((item, index) => {

                return <div className={homeCss.verticalItem} key={index} onClick={() => setIdRestaurant(item?.dataBody?.docs[0]?.id)}>

                    {item?.dataBody?.docs[0]?.properties?.hasPromotion && <div className={homeCss.promoIcon} style={{ fontSize: 14 }}>PROMO</div>}
                    <img alt="Món ăn" className={homeCss.verticalItemImage} src={item?.dataBody?.docs[0]?.imageUrl}></img>

                    <div className={homeCss.verticalItemDe}>
                        <p className={homeCss.verticalItemDe1}>
                            {
                                item?.dataBody?.docs[0]?.properties?.isPartner && <img alt="Món ăn" width={20} src={partnerIcon} />
                            }
                            {item?.dataBody?.docs[0]?.title}</p>
                        <p className={homeCss.itemDescriptionp2}>
                            {
                                item?.dataBody?.docs[0]?.properties?.rate && <span style={{ marginLeft: 18 }}>
                                    <StarRateIcon />
                                    {item?.dataBody?.docs[0]?.properties?.rate} <span style={{ color: "gray" }}>
                                        ({item?.dataBody?.docs[0]?.properties?.totalRatings})</span> -

                                </span>
                            }
                            &nbsp;{(item?.dataBody?.docs[0]?.properties?.distance / 1000).toFixed(2)}km
                        </p>
                    </div>
                </div>


            })}
            {
                loadingMB &&
                <Box sx={{ textAlign: "center", padding: "20px 20px 500px 0px", width: "100%" }}>
                    <CircularProgress size={20} />
                </Box>
            }
        </div>
    </div>
}


const responsive4 = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
function ReorderMerchant({ itemData }) {
    return <div className={homeCss.container}>
        <div className={homeCss.titleMerchantCollection}>
            <p>{itemData?.title}</p>
        </div>
        {
            <Carousel responsive={responsive4} className={homeCss.boxItem} autoPlay={true} autoPlaySpeed={3000} itemClass={homeCss.boxItemLi} removeArrowOnDeviceType={"mobile"} rewind={true} rewindWithAnimation={true}    >
                {itemData?.dataBody?.docs?.map((item, index) => {
                    const data = new Date(item?.dataBody?.docs[0]?.properties?.lastOrderedAt);
                    const dayOrder = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
                    const monthOrder = data.getMonth() + 1 < 10 ? "0" + data.getMonth() + 1 : data.getMonth() + 1;

                    const hoursOrder = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
                    const minutesOrder = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();

                    return <div className={homeCss.merchantReorder} key={index}>
                        <img alt="Món ăn" className={homeCss.merchantReorderImage} src={item?.dataBody?.docs[0]?.imageUrl}></img>
                        <div className={homeCss.merchantReorderDescription}>
                            <p > {item?.dataBody?.docs[0]?.title}</p>
                            <p> {item?.dataBody?.docs[0]?.description}</p>
                            <p>Đặt lần cuối ngày {hoursOrder}:{minutesOrder} {dayOrder}/{monthOrder}  </p>

                        </div>
                    </div>


                })}
            </Carousel>
        }
    </div>
}


const responsive3 = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
function BoxItemPaymentPromo({ itemData }) {
    return <div className={homeCss.container}>
        <div className={homeCss.titleMerchantCollection}>
            <p>{itemData?.title}</p>
        </div>
        {
            <Carousel responsive={responsive3} className={homeCss.boxItem} autoPlay={false} autoPlaySpeed={4000} itemClass={homeCss.boxItemLi} removeArrowOnDeviceType={"mobile"} rewind={true} rewindWithAnimation={true}   >
                {itemData?.dataBody?.docs?.map((item, index) => {
                    return <div className={homeCss.itemInfo} key={index}>

                        <img alt="Món ăn" className={homeCss.bannerImage} src={item?.dataBody?.docs[0]?.imageUrl}></img>

                        <div className={homeCss.itemDescription}>
                            <p className={homeCss.itemDescriptionp1} style={{ fontWeight: "bold", paddingLeft: 5 }}> {item?.dataBody?.docs[0]?.title}</p>

                        </div>
                    </div>

                })}
            </Carousel>
        }
    </div>
}


const responsiveitem = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    }
};

function BoxItems({ itemData }) {
    const dispatch = useDispatch();
    const [isOutCountDown, setIsOutCountDown] = useState(false);
    const setIdRestaurant = (id) => {
        dispatch(setRestaurantId(id))
    }
    if (!isOutCountDown)
        return <div className={homeCss.container}>
            <div className={homeCss.titleMerchantCollection}>{
                itemData?.header?.timeSlots?.times[0]?.end ?
                    <>
                        <Countdown endTime={itemData?.header?.timeSlots?.times[0]?.end} setIsOutCountDown={setIsOutCountDown} />
                        <p   >{itemData?.description}</p>
                    </>
                    :
                    <>
                        <p>{itemData?.title}</p>
                        <span   >{itemData?.description}</span></>
            }


            </div>
            {
                <Carousel responsive={responsiveitem} className={homeCss.boxItem} autoPlay={false} autoPlaySpeed={4000} itemClass={homeCss.boxItemLi} removeArrowOnDeviceType={"mobile"} rewind={true} rewindWithAnimation={true}    >
                    {itemData?.dataBody?.docs?.map((item, index) => {
                        return <div className={homeCss.itemInfo} key={index} onClick={() => {
                            setIdRestaurant(item?.dataBody?.docs?.length > 0 && item?.dataBody?.docs[0]?.id)
                        }
                        }>
                            {item?.dataBody?.docs[0]?.properties?.hasPromotion && <div className={homeCss.promoIcon}>PROMO</div>}

                            <img alt="Món ăn" className={homeCss.itemImage} src={item?.dataBody?.docs[0]?.imageUrl}></img>

                            <div className={homeCss.itemDescription}>
                                <p className={homeCss.itemDescriptionp1}>
                                    {
                                        item?.dataBody?.docs[0]?.properties?.isPartner && <img alt="Món ăn" width={20} src={partnerIcon} />
                                    }
                                    {item?.dataBody?.docs[0]?.title}</p>
                                <p className={homeCss.itemDescriptionp2}>
                                    {
                                        item?.dataBody?.docs[0]?.properties?.rate && <span style={{ marginLeft: 18 }}>
                                            <StarRateIcon />
                                            {item?.dataBody?.docs[0]?.properties?.rate} <span style={{ color: "gray" }}>
                                                ({item?.dataBody?.docs[0]?.properties?.totalRatings})</span> -

                                        </span>
                                    }
                                    &nbsp;{(item?.dataBody?.docs[0]?.properties?.distance / 1000).toFixed(2)}km
                                </p>
                            </div>
                        </div>

                    })}
                    <div className={homeCss.itemMoreButton} key={"sdf"}>
                        <ArrowForwardIcon sx={{ fontSize: 30, marginBottom: 1 }} />
                        <span>Xem tất cả</span>
                    </div>
                </Carousel>

            }
        </div >
}


function Countdown({ endTime, setIsOutCountDown }) {
    const timeInterval = useRef(null);
    const [timeFlashSale, setTimeFlashSale] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    function countdownToEndTime(endTime) {
        // Get the current time
        var currentTime = new Date();

        // Convert the end time from the input to a Date object
        var endTimeDate = new Date();
        endTimeDate.setHours(Math.floor(endTime / 60));
        endTimeDate.setMinutes(endTime % 60);
        endTimeDate.setSeconds(0);

        // Check if the end time has already passed
        if (endTimeDate <= currentTime) {
            console.log("The end time has already passed!");
            setIsOutCountDown(true)
            return;
        }

        // Calculate the time difference (in milliseconds) between the current time and the end time
        var timeDiff = endTimeDate - currentTime;

        // Create an interval to count down every second until the end time
        timeInterval.current = setInterval(function () {
            // Calculate the remaining time in hours, minutes, and seconds
            var hours = Math.floor(timeDiff / (1000 * 60 * 60)).toString().padStart(2, '0');
            var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000).toString().padStart(2, '0');

            setTimeFlashSale({ hours: hours, minutes: minutes, seconds: seconds })
            // Decrease the remaining time by 1 second
            timeDiff -= 1000;

            // Check if the countdown has reached the end time
            if (timeDiff <= 0) {
                // Stop the interval for the countdown
                clearInterval(timeInterval.current);
                console.log("The time has ended!");
                setIsOutCountDown(true)
            }
        }, 1000);
    }

    // Gọi hàm countdown với thời gian start là 607 và end là 700
    useEffect(() => {
        endTime &&
            countdownToEndTime(endTime);
        return () => {
            clearInterval(timeInterval.current)
        };
    }, []);

    return <>
        {
            timeFlashSale?.hours !== "NaN" &&
            <>
                <div className={homeCss.itemFlashSale}>
                    <span style={{ marginRight: 10 }}>FLASH SALE</span>
                    <span className={homeCss.itemFlashSaleSpanBG}>{timeFlashSale.hours}</span>
                    <span>:</span>
                    <span className={homeCss.itemFlashSaleSpanBG}>{timeFlashSale.minutes}</span>
                    <span>:</span>
                    <span className={homeCss.itemFlashSaleSpanBG}>{timeFlashSale.seconds}</span>
                </div>
            </>

        }
    </>
}




function BoxCategories({ menuData }) {

    return <div className={homeCss.container}>
        <div className={homeCss.boxCategories}>
            {
                menuData?.dataBody?.docs?.map((item, index) => {
                    return <div className={homeCss.categoryItem} key={index} >
                        <img alt="Món ăn" src={item?.dataBody?.docs[0]?.imageUrl} />
                        {/* <p>{item?.dataBody?.docs[0]?.title}</p> */}
                    </div>
                })
            }
        </div>

    </div>

}


const responsive1 = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
const responsive2 = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 10,
        slidesToSlide: 10 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 6,
        slidesToSlide: 6 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    }
};
function Banner({ bannerData }) {
    return <div className={homeCss.container}>
        {
            bannerData?.type === "Banner" ?
                <Carousel responsive={responsive1} className={homeCss.banner1} autoPlay={true} autoPlaySpeed={4000} itemClass={homeCss.bannerLi1} removeArrowOnDeviceType={"mobile"} rewind={true} rewindWithAnimation={true}    >
                    {bannerData?.dataBody?.docs?.map((item, index) => {
                        return <img alt="Món ăn" className={homeCss.bannerImage} src={item?.dataBody?.docs[0]?.imageUrl} key={index}></img>

                    })}

                </Carousel>
                :
                <Carousel responsive={responsive2} className={homeCss.banner2} autoPlay={true} autoPlaySpeed={4000} itemClass={homeCss.bannerLi2} removeArrowOnDeviceType={"mobile"} rewind={true} rewindWithAnimation={true}  >
                    {bannerData?.dataBody?.docs?.map((item, index) => {
                        return <img alt="Món ăn" className={homeCss.bannerImage} src={item?.dataBody?.docs[0]?.imageUrl} key={index}></img>

                    })}
                </Carousel>
        }



    </div>
}


export default Home;