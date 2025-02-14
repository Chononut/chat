import React, { useState } from 'react';
import {Form, Button } from 'react-bootstrap';

export default function BadgerRegister() {

    // TODO Create the register component.
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    const handleRegister = (e) => {
        e.preventDefault()
        if(!userName || !password || !confirm){
            alert("You must provide both a username and password!")
            return 
        }
        if(password !== confirm){
            alert("Your passwords do not match!")
            return
        }

        fetch("https://cs571.org/rest/f24/hw6/register", {
            method: 'POST',
            headers:{
                "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e',
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                //服务端API通常预期的格式为全小写 所以不能使用userName 会导致undefined报错
                username: userName,
                password: password,
                confirm: confirm
            })
        })
        .then(res => handleResponse(res))
        .then(data => {
            console.log(data)
            if (data.msg === "Successfully authenticated."){
                alert("The registration was successful")
            }
            else if (data.msg === "The user already exists!"){
                alert("That username has already been taken!")
            }
            else {
                alert(data.msg)
            }
        }).catch(error => {
            alert(error)
        })
    }

    const handleResponse = (res) => {
        /*原先写的代码 response中并没有msg 而是res.json() 中 有msg 所以要先返回res.json() 
          res.json()返回一个Promise 所以后面再给.then传入回调函数 以json为参数
        if (res.ok){
            return res.json()
        }
        else {
            return Promise.reject(res.msg)
        }
        */
       // 忘记response的内容 可以先写 console.log(res) 查看response的内容
       console.log(res)
       return res.json().then(json => {
        if (res.ok){
            return json
        }
        else{
            return Promise.reject(json.msg)
        }
       })
    }
    return <>
        <h1>Register</h1>
        <Form.Group>
            <Form.Label htmlFor="userName">UserName</Form.Label>
            <Form.Control id="userName" value={userName} onChange={e => setUserName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control id="password" value={password} type="password" onChange={e => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label htmlFor="confirm">Confirm</Form.Label>
            <Form.Control id="confirm" value={confirm} type="password" onChange={e => setConfirm(e.target.value)}></Form.Control>
        </Form.Group>

        <Button onClick={(e) => handleRegister(e)}>Register</Button>
    </>
}

/* 事件对象都包括了什么 e.target指的是什么，为什么是value */
