
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext'; // 使用useContext钩子需要导入其参数使用的上下文组件


export default function BadgerLogout() {

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e'
            },
            credentials: "include"
        })
        .then(res => res.json())
        .then(json => {
            // Maybe you need to do something here?
            alert("You have already logged out!")
            //layout的法1.1
            sessionStorage.removeItem("loginStatus")
            // sessionStorage.setItem("loginStatus", false) //结合Layout的法1.2 
            setLoginStatus(false)
            navigate("/")
        })
    }, []);

    console.log("inLogout", loginStatus)
    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
