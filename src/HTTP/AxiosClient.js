import axios from 'axios';

const BASE_URL = 'http://192.168.1.3:8080/baemin_server/index.php'; // Thay thế bằng URL cơ sở của API bạn đang sử dụng
// const BASE_URL = 'https://food.cqdgo.com/v1/index.php'; // Thay thế bằng URL cơ sở của API bạn đang sử dụng

const Client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Hoặc 'multipart/form-data' tùy thuộc vào yêu cầu của bạn
    },

});

// Interceptor để xử lý lỗi
Client.interceptors.response.use(
    response => {

        // Xử lý dữ liệu trả về thành công tại đây (nếu cần)
        return response.data;
    },
    async error => {
        // Xử lý lỗi tại đây
        if (error.response) {
            // Lỗi phản hồi từ API (status code không phải 2xx)
            console.error('Response Error:', error.response.data);
        } else if (error.request) {
            // Không nhận được phản hồi từ API (không kết nối mạng chẳng hạn)
            console.error('Request Error:', error.request);
        } else {
            // Lỗi xảy ra khi thiết lập yêu cầu (axios config chẳng hạn)
            console.error('Error:', error.message);
        }
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            // Gửi yêu cầu refresh token để lấy access token mới 
            const newAccessToken = await refreshAccessToken(); // Hàm refresh token

            // Lưu trữ access token mới vào cookie
            setAccessTokenCookie(newAccessToken); // Hàm lưu trữ access token vào cookie

            // Thực hiện lại yêu cầu gốc với access token mới
            // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            // return api(originalRequest);
        }



        return Promise.reject(error);
    }
);



// Hàm refresh token
async function refreshAccessToken() {
    try {
        const response = await Client.post('?refresh=true');
        const { accessToken } = response.data;
        return accessToken;
    } catch (error) {
        // Xử lý lỗi refresh token
        throw error;
    }
}

// Hàm lấy refresh token từ cookie
function getRefreshTokenFromCookie() {
    // Implement your logic here to extract the refresh token from the HttpOnly cookie
}

// Hàm lưu trữ access token vào cookie
function setAccessTokenCookie(accessToken) {
    // Implement your logic here to set the access token in the HttpOnly cookie
}


export default Client;