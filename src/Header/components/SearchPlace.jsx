import React, { useState, useEffect } from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CloseIcon from '@mui/icons-material/Close';
import styleCss from './Style.module.css';
import { useDebouncedCallback } from 'use-debounce';
import { LocationAPI } from '../../HTTP/BaeminHttp';

const SearchPlace = ({ inputLocationFocused, setInputLocationFocused }) => {

    const [searchValue, setSearchValue] = useState(
        () => {
            const location = localStorage.getItem("pickedLocation");
            if (location !== "undefined" && location) {
                return JSON.parse(location)?.location?.structured_formatting?.main_text
            } else {
                return "Nhập địa chỉ";
            }
        }
    );
    const [dataPlace, setDataPlace] = useState([]);
    const debounced = useDebouncedCallback(async () => {
        if (searchValue.trim().length > 2 && searchValue.trim() !== "Nhập địa chỉ") {
            const data = await LocationAPI.findPlace(searchValue);
            setDataPlace(data?.predictions);

        }
    }, 500);
    useEffect(() => {
        debounced();
        return debounced;
    }, [searchValue]);

    const handleOutsideClick = (event) => {
        const searchLocationElement = document.getElementById('searchLocation');
        if (!searchLocationElement.contains(event.target)) {
            setInputLocationFocused(false);
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleOutsideClick)
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleFocus = () => {
        setInputLocationFocused(true)
        searchValue === "Nhập địa chỉ" && setSearchValue("")
    }

    const handleLocationPick = async (location) => {

        const placeDetail = await LocationAPI.findPlaceDetails(location?.place_id)
        localStorage.setItem("pickedLocation", JSON.stringify({
            location: location,
            detail: placeDetail
        }));
        window.location.reload();
    }

    return (
        <div className={styleCss.headerDivSearch} id='searchLocation'>
            <input type="text" value={searchValue}
                placeholder='Nhập địa chỉ'
                onChange={e => {
                    setSearchValue(e.target.value)
                    !inputLocationFocused && setInputLocationFocused(true)
                }}
                onClick={handleFocus}
                className={styleCss.headerInput} />
            <FmdGoodIcon className={styleCss.FmdGoodIcon} />
            <CloseIcon className={styleCss.ClearLocationIcon} onClick={() => setSearchValue("")} />
            {
                inputLocationFocused &&
                <div className={styleCss.headerSearchBox}>

                    {
                        dataPlace?.length > 0 ? dataPlace?.map((item, index) => {
                            return <div className={styleCss.headerSearchItem} key={index} onClick={() => handleLocationPick(item)}>
                                <p>{item?.structured_formatting?.main_text}</p>
                                <span>{item?.structured_formatting?.secondary_text}</span>
                            </div>

                        })
                            : <p style={{ fontWeight: "bold", paddingLeft: "10px", fontSize: 12 }}>Nhập địa chỉ của bạn.</p>

                    }


                </div>


            }

        </div>
    );
}

export default SearchPlace;
