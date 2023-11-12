import React, { useState, useEffect } from 'react';
import styleCss from './Style.module.css';
import { FormControl, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Auth } from '../../HTTP/BaeminHttp';
import OTPInput from 'react-otp-input';
import { generateRandomString } from '../../helper';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Dialog from "@mui/material/Dialog";
import { useRef } from 'react';
const Login = ({ setOpen, open }) => {
    const [formType, setFormType] = useState("LOGIN");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(generateRandomString(10) + "@gmail.com");
    const [emailError, setEmailError] = useState("");
    const [OTPCode, setOTPCode] = useState("");
    const [otpError, setOTPError] = useState("");
    const [tokenRequest, setTokenRequest] = useState("");
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [countdown, setCountdown] = useState(0);

    const [loading, setLoading] = useState(false);
    // const tokenRequest = useRef("");
    const timoutCD = useRef();

    const handleRequestOTP = async () => {
        const dataRequestOTP = await Auth.requestOTP(phoneNumber);
        setOTPCode("")
        // tokenRequest.current = dataRequestOTP?.token;
        setTokenRequest(dataRequestOTP?.token)
        setCountdown(60)
    }
    useEffect(() => {
        timoutCD.current = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);
        if (countdown <= 0) clearTimeout(timoutCD.current)
        return () => clearTimeout(timoutCD.current);
    }, [countdown]);

    const validForm = async () => {
        let message = "";
        if (name?.length < 1) {
            message = "Tên tối thiểu 1 ký tự!";
            setNameError(message);
            return false;
        }
        if (email?.length < 6) {
            message = "Emai tối thiểu 6 ký tự!";
            setEmailError(message);
            return false;
        }
        const checkName = await Auth.checkName(name);
        let isValid = true;
        if (checkName?.code) {
            isValid = false;
            setNameError("Email không đúng hoặc đã tồn tại");
        }
        const checkEmail = await Auth.checkEmail(email);

        if (checkEmail?.result !== "NON_EXISTS") {
            isValid = false;
            setEmailError(checkEmail?.errors[0]?.message);
        }
        const checkPassword = await Auth.checkPassword(password);

        if (checkPassword?.code) {
            isValid = false;
            setPwdError(checkPassword?.errors[0]?.message);
        }
        return isValid;
    }
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setNameError("");
            setEmailError("");
            setPwdError("")
            setOTPError("")
            var message = "";
            if (formType === "REGISTER") {
                const checkValid = await validForm();
                if (!checkValid) return false;
                const dataVerify = await Auth.verifyOTP(OTPCode, tokenRequest);
                if (dataVerify?.token) {
                    const dataRegister = await Auth.register(name, email, phoneNumber, password, dataVerify?.token);
                    if (dataRegister?.code) {
                        setPwdError(dataRegister?.errors[0]?.message)
                        return;
                    }

                    localStorage.setItem("accessToken", dataRegister?.token);
                    localStorage.setItem("refreshToken", dataRegister?.refreshToken);
                    localStorage.setItem("user_profile", JSON.stringify(dataRegister?.user))
                    window.location.reload();
                } else if (dataVerify?.code) {
                    message = dataVerify?.errors[0]?.message;
                    setOTPError(message);
                    setOTPCode("")
                    throw Error(message);
                }
                return;
            }
            if (password?.length < 6) {
                message = "Mật khẩu quá ngắn!";
                setPwdError(message);
                throw Error(message);
            }
            if (phoneNumber?.length < 9) {
                message = "Số điện thoại không hợp lệ!";
                setPhoneNumberError(message);
                throw Error(message);
            }
            const data = await Auth.checkPhone(phoneNumber);
            if (data?.result === "DELETED") setPhoneNumberError("Số này đã bị vô hiệu hoá!");
            if (data?.result === "NON_EXISTS") {
                setFormType("REGISTER");
                handleRequestOTP();
            }
            if (data?.result === "EXISTS") {
                const dataLogin = await Auth.getLogin(phoneNumber, password);
                if (dataLogin?.token) {
                    localStorage.setItem("accessToken", dataLogin?.token);
                    localStorage.setItem("refreshToken", dataLogin?.refreshToken);
                    localStorage.setItem("user_profile", JSON.stringify(dataLogin?.user))
                    window.location.reload();

                }
                if (dataLogin?.errors?.length > 0) {
                    if (dataLogin?.errors[0]?.code === "AUTHENTICATION_ERROR") {
                        message = "SĐT hoặc mật khẩu sai!";
                        setPwdError(message);
                        throw Error(message);
                    }
                }
            }

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }


    const handeBackPress = () => {
        setFormType("LOGIN")
        if (formType === "LOGIN") setOpen(false)
    }
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}

            maxWidth={"xl"}
        >


            <div className={styleCss.boxLogin}>

                <p style={{ margin: "0px" }} > <KeyboardBackspaceIcon sx={{ color: "#13C0BF", cursor: "pointer" }} onClick={handeBackPress} /></p>

                <p className={styleCss.titleLogin}>  {formType === "REGISTER" ? "ĐĂNG KÝ" : "ĐĂNG NHẬP"}</p>
                <FormControl variant="standard" fullWidth={true} >
                    {
                        formType === "REGISTER" &&
                        <>
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                                <OTPInput
                                    value={OTPCode}
                                    onChange={setOTPCode}
                                    numInputs={6}
                                    renderInput={(props) => <input {...props} style={{ border: "2px solid #13C0BF", outline: "none", marginLeft: "5px", fontSize: '30px', textAlign: "center", borderRadius: "10px", padding: " 5px", color: "#13C0BF", width: "30px" }} />}
                                />

                            </div>
                            <span style={{ fontSize: "12px", fontFamily: "sans-serif", color: "red", marginTop: "5px", textAlign: "center" }}>{otpError !== "" && otpError}</span>
                            <p style={{ fontFamily: "sans-serif", marginBottom: "0px", marginTop: "2px", textAlign: "center", color: "gray" }}>
                                Chưa nhận được? {countdown ? countdown : <span style={{ cursor: "pointer", color: "#13C0BF" }} onClick={handleRequestOTP}>Gửi lại</span>}
                            </p>

                            <TextField id="standard-basic" label="Họ Tên"

                                error={nameError !== "" ?? true}
                                helperText={nameError}
                                variant="standard"
                                onChange={(e) => {
                                    setNameError("")
                                    setName(e.target.value)
                                }}
                                sx={{ marginTop: 1 }}
                                defaultValue={name} />
                            <TextField id="standard-basic" label="Email"
                                error={emailError !== "" ?? true}
                                helperText={emailError}
                                variant="standard"
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setEmailError("")
                                }}
                                sx={{ marginTop: 2 }}
                                defaultValue={email} />
                        </>
                    }

                    <TextField id="standard-basic" type="number"
                        disabled={formType === "REGISTER"}

                        label="Số Điện Thoại" error={phoneNumberError !== "" ?? true}
                        helperText={phoneNumberError} variant="standard" onChange={(e) => {
                            setPhoneNumber(e.target.value)
                            setPhoneNumberError("")
                        }}
                        defaultValue={phoneNumber}
                        sx={{ marginTop: 2 }} />
                    <TextField id="standard-basic" label="Mật Khẩu"
                        error={pwdError !== "" ?? true}
                        helperText={pwdError} onChange={(e) => {
                            setPassword(e.target.value)
                            setPwdError("")
                        }} variant="standard" sx={{ marginTop: 2 }} defaultValue={password} />
                    <LoadingButton
                        loading={loading}
                        loadingPosition="center"
                        variant="contained"
                        color="success"
                        sx={{ marginTop: 3, backgroundColor: "#20c0bf", color: "white", borderRadius: "500px" }}
                        onClick={handleSubmit}
                    >
                        {formType === "REGISTER" ? "ĐĂNG KÝ" : "ĐĂNG NHẬP"}
                    </LoadingButton>
                </FormControl>
            </div>
        </Dialog >
    );
}








export default Login;
