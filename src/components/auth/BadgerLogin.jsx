import React, {useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Form } from 'react-bootstrap'
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext'; // 使用useContext钩子需要导入其参数使用的上下文组件

export default function BadgerLogin() {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext) // 使用useContext钩子需要导入其参数使用的上下文组件
    const navigate = useNavigate()  //任何钩子必须在组件的顶层调用。不能将其放在回调函数或条件语句内部。

    // TODO Create the login component.
    const handleLogin = (e) => {
        e.preventDefault() //需要自定义表单或按钮的行为时，使用
        if (!name || ! password){
            alert("You must provide both a username and password!")
            return // 满足条件，提前结束函数，防止继续执行
        }

        fetch("https://cs571.org/rest/f24/hw6/login", {
            method:"POST",
            headers:{
                "X-CS571-ID":'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e',
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username:name,
                password:password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            console.log(name)
            if (data.msg === "Successfully authenticated."){
                alert("Your login is successful!")
                sessionStorage.setItem("loginStatus", true) // 刷新页面后 仍然保持
                sessionStorage.setItem("loggedInUser", JSON.stringify(name))  //用于后面JSON.parse转化
                setLoginStatus(true) // 用于重新渲染页面（因为要求为 省略某些按钮）
                navigate("/")
            }
            else{
                alert("Incorrect username or password!")
            }
        })
    }

    return <>
        <h1>Login</h1>
        <Form.Group>
            <Form.Label htmlFor="LoginName">Name</Form.Label>
            <Form.Control id="LoginName" value={name} onChange={e => setName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label htmlFor="LoginPassword">Password</Form.Label>
            <Form.Control id="LoginPassword" type="password" value={password} onChange={e => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Button onClick={e => handleLogin(e)}>Login</Button>
    </>
}

/* 
control 和 input区别 */
