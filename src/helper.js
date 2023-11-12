export function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export function phoneFormat(phoneNumber, type = "84") {
    if (phoneNumber?.match(/^0/))
        phoneNumber = phoneNumber.replace(/^0/, type);
    else
        phoneNumber = type + phoneNumber;
    return phoneNumber;
}