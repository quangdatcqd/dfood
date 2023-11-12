import Client from "./AxiosClient";
import { generateRandomString, phoneFormat } from "../helper";

const LocationPicked = localStorage.getItem("pickedLocation");
const accessToken = localStorage.getItem("accessToken");
var userProfile = localStorage.getItem("user_profile");
if (userProfile) {
    userProfile = JSON.parse(userProfile);
}





var XLocation = "106.683923,10.822333";
var XLocationEncode = encodeURIComponent("106.683923,10.822333");
if (LocationPicked && LocationPicked !== "undefined") {
    XLocation = JSON.parse(LocationPicked)?.detail?.result?.geometry?.location;
    XLocation = XLocation?.lng + "," + XLocation?.lat;
    XLocationEncode = encodeURIComponent(XLocation);

}


const HEADER = [
    'X-Android-Cert:D7C25FC676E271B36F8914C3C7E7D505B0A836C9',
    'X-Places-Android-Sdk:3.0.0',
    'X-Android-Package:com.woowahan.vn.baemin',

]

export const LocationAPI = {
    findPlace: async (searchVal) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDVVxrlKP3sfeF9TpmJ_kCJw6Dda0U2E-Y&language=vi-VN&input=${encodeURIComponent(searchVal)}&components=country%3Avn`
        });
    },
    findPlaceDetails: async (placeId) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDVVxrlKP3sfeF9TpmJ_kCJw6Dda0U2E-Y&language=vi-VN&placeid=${placeId}&fields=name%2Caddress_components%2Cformatted_address%2Cgeometry%2Flocation`
        });
    }

}

export const BannerAPI = {
    Coordinates: async () => {

        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/views?coordinates=${XLocationEncode}&section=Food`
        });
    }
}
export const RestaurantAPI = {
    verticalList: async (page = 0, dataUrl) => {
        const payload = {
            "page": page,
            "coordinates": XLocation
        };
        return await Client.post("", {
            type: "POST",
            body: JSON.stringify(payload),
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/${dataUrl}`
        });
    },
    searchRestaurant: async (searchValue) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/stores/search?coordinates=${XLocationEncode}&isExact=false&isGroupMerchant=true&keyword=${encodeURIComponent(searchValue)}&name=&page=1&target=all&type=MERCHANT`
        });
    },

    getRestaurant: async (id) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/stores/${id}?coordinates=${XLocation}`
        });
    },
}


export const Order = {
    headers: [
        ...HEADER,
        `x-access-token: ${accessToken}`
    ],
    listOrders: async () => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(Order?.headers),
            url: `https://api.baemin.vn/v3/users/${userProfile?.id}/orders`
        });
    }
}



export const Auth = {
    checkPhone: async (phoneNumber) => {
        phoneNumber = phoneFormat(phoneNumber, "84");

        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/auth/users/check?phone=%2B${phoneNumber}`
        });
    }, checkName: async (name) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/auth/users/check?name=${encodeURIComponent(name)}`
        });
    }, checkEmail: async (email) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/auth/users/check?email=${email}`
        });
    }, checkPassword: async (pass) => {
        return await Client.post("", {
            type: "GET",
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/auth/users/check?password=${pass}`
        });
    },
    getLogin: async (phone, pwd) => {
        phone = phoneFormat(phone, "+84");
        const payload = {
            "password": pwd,
            "phone": phone
        };
        return await Client.post("", {
            type: "POST",
            body: JSON.stringify(payload),
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/auth/users/login`
        });
    }
    ,
    requestOTP: async (phone) => {
        phone = phoneFormat(phone, "+84");
        const payload = {
            "phone": phone
        };
        return await Client.post("", {
            type: "POST",
            body: JSON.stringify(payload),
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/notifications/request-otp`
        });
    }
    ,
    verifyOTP: async (otp, token) => {
        const payload = {
            "requestToken": token,
            "otpCode": otp
        };
        return await Client.post("", {
            type: "POST",
            body: JSON.stringify(payload),
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/notifications/verify-otp`
        });
    }
    ,
    register: async (name, email, phone, pass, token) => {
        const deviceID = generateRandomString(16);
        phone = phoneFormat(phone, "+84");
        const payload = {
            "email": email,
            "password": pass,
            "name": name,
            "countryCode": "VN",
            "uid": token,
            "provider": "local",
            "phone": phone,
            "deviceId": deviceID,
            "referenceIds": [
                {
                    "type": "deviceId",
                    "value": deviceID
                },
                {
                    "type": "amplitudeId",
                    "value": "adbe2fe5-e317-46bf-9e6a-5668f8016461R"
                }
            ]
        };
        return await Client.post("", {
            type: "POST",
            body: JSON.stringify(payload),
            header: JSON.stringify(HEADER),
            url: `https://api.baemin.vn/v3/auth/users/register`
        });
    }
}




