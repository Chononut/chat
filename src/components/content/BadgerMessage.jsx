import React from "react"
import { Card, Button } from "react-bootstrap";

function BadgerMessage(props) {

    const dt = new Date(props.created);
    let loginStatus = sessionStorage.getItem("loginStatus") === "true" //getItem 返回的是一个字符串 不是一个布尔值
    let userName = sessionStorage.getItem("loggedInUser")
    console.log(userName)
    console.log(typeof userName)
    console.log(props.poster)
    console.log(typeof props.poster)

    const handleDelete = () => {
        props.delete(props.id)
    }

    return <Card style={{margin: "0.5rem", padding: "0.5rem"}}>
        <h2>{props.title}</h2>
        <sub>Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</sub>
        <br/>
        <i>{props.poster}</i>
        <p>{props.content}</p>
        {loginStatus && props.poster === JSON.parse(userName) ?  //如果不添加JSON.parse转换 使用getItem得到的userName是带有引号的字符串 比props.poster多了两个引号
        (<Button variant="danger" onClick={handleDelete}>Delete Post</Button>) : null}
    </Card>
}

export default BadgerMessage;