import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";

export default function BadgerChatroom({ name }) {
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);

    const loginStatus = useMemo(() => Boolean(sessionStorage.getItem("loginStatus")), []);
    const pageSize = 25; // 每页消息数量

    const loadMessages = useCallback(() => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${name}&page=1`, {
            headers: {
                "X-CS571-ID": "bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e",
            },
        })
            .then((res) => res.json())
            .then((json) => setMessages(json.messages));
    }, [name]);

    const postMessage = useCallback(
        (e) => {
            e.preventDefault();
            if (!title || !content) {
                alert("You must provide both a title and content!");
                return;
            }

            fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${name}&page=1`, {
                method: "POST",
                headers: {
                    "X-CS571-ID": "bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title, content }),
            }).then(() => {
                loadMessages();
                setTitle("");
                setContent("");
                alert("Successfully posted!");
            });
        },
        [name, title, content, loadMessages]
    );

    const deleteMessage = useCallback(
        (id) => {
            fetch(`https://cs571.org/api/s24/hw6/messages?id=${id}`, {
                method: "DELETE",
                headers: {
                    "X-CS571-ID": "bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e",
                },
                credentials: "include",
            }).then(() => {
                loadMessages();
                alert("Successfully deleted the post!");
            });
        },
        [loadMessages]
    );

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const paginatedMessages = useMemo(() => {
        return messages.slice(pageSize * (page - 1), pageSize * page);
    }, [messages, page, pageSize]);

    const paginationItems = useMemo(() => {
        const items = [];
        const totalPages = Math.ceil(messages.length / pageSize);

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
            />
        );

        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item key={i} active={page === i} onClick={() => setPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
            />
        );

        return items;
    }, [messages.length, page, pageSize]);

    return (
        <>
            <h1>{name} Chatroom</h1>
            {loginStatus ? (
                <Form onSubmit={postMessage}>
                    <Form.Group>
                        <Form.Label htmlFor="title">Post Title</Form.Label>
                        <Form.Control
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="content">Post Content</Form.Label>
                        <Form.Control
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit">Create Post</Button>
                </Form>
            ) : (
                <p>You must be logged in to post!</p>
            )}
            <hr />
            {messages.length > 0 ? (
                <Container>
                    <Row>
                        {paginatedMessages.map((message) => (
                            <Col key={message.id} sm={6} md={4} lg={3}>
                                <BadgerMessage
                                    id={message.id}
                                    title={message.title}
                                    poster={message.poster}
                                    content={message.content}
                                    created={message.created}
                                    delete={deleteMessage}
                                />
                            </Col>
                        ))}
                    </Row>
                </Container>
            ) : (
                <p>There are no messages on this page yet!</p>
            )}
            <Pagination>{paginationItems}</Pagination>
        </>
    );
}
/* 优化前的代码
import React, { useEffect, useState } from "react";
import {Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";


export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const loginStatus = Boolean(sessionStorage.getItem("loginStatus"))
    console.log("loginStatus", Boolean(sessionStorage.getItem("loginStatus"))) 
    
    const postMessage = (e) => {
        e.preventDefault()

        if (!title || !content){
            alert("You must provide both a title and content!")
            return
        }
        else{
            fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=1`, {
                method: "POST",
                headers:{
                    "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e',
                    "Content-Type": "application/json"
                },
                credentials:"include",
                body:JSON.stringify({  //JSON.stringify JSON.parse应该大写
                    title: title,
                    content: content
                }) // fetch的每一个value都应是一个字符串
            })
            .then(() => {
                loadMessages()
                alert("Successfully posted!")
            })   
        }
    }

    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=1`, {
            headers: {
                "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e'
            }
        })
        .then(res => res.json())
        .then(json => {
            setMessages(json.messages)
        })
    };

    const deleteMessage = (ID) => {
        fetch(`https://cs571.org/api/s24/hw6//messages?id=${ID}`, {
            method:"DELETE",
            headers: {
                "X-CS571-ID": 'bid_fa7b6e58f1e6e815b24f65eb00bee192a12b3ae27a632ad5cb809b460752b68e',
            },
            credentials:"include",
        })
        .then(() => {
            alert("Successfully deleted the post!")
            loadMessages()
        })
    }


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props]);

    const [page, setPage] = useState(1)
    const buildPagination = () => {
        const items = []
        for (let i = 1; i <= 4; i++){
            items.push(
                <Pagination.Item key={i} active={page === i} onClick={() => setPage(i)}>{i}</Pagination.Item>
            )
        }

        items.unshift(<Pagination.Prev key="Prev" onClick={() => setPage(page - 1)} disabled={page === 1}></Pagination.Prev>)
        items.push(<Pagination.Next key="Next" onClick={() => setPage(page + 1)} disabled={page === 4}></Pagination.Next>)
        return items
    } 

    return <>
        <h1>{props.name} Chatroom</h1>
        {/* TODO: Allow an authenticated user to create a post. *//*}
        {loginStatus?
            <>
                <Form onSubmit={(e) => postMessage(e)}>
                    <Form.Group>
                        <Form.Label htmlFor="title">Post Title</Form.Label>
                        <Form.Control id="title" value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="content">Post Content</Form.Label>
                        <Form.Control id="content" value={content} onChange={(e) => setContent(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type="submit">Create Post</Button>  {/*会触发表单的默认提交 应放入Form内部*//*}
                </Form>
            </>:<p>You must be logged in to post!</p>}
        <hr/>
        {
            messages.length > 0 ?
                <>
                    {
                        /* TODO: Complete displaying of messages. *//*
                        <Container>
                            <Row>
                                {messages.slice(25 * (page - 1), 25 * page).map(message => {
                                    return (<Col key={message.id} sm={6} md={4} lg={3}>
                                        <BadgerMessage
                                            id={message.id} 
                                            title={message.title} 
                                            poster={message.poster} 
                                            content={message.content} 
                                            created={message.created}
                                            delete={(ID) => deleteMessage(ID)}>
                                        </BadgerMessage>
                                    </Col>)
                                })}
                            </Row>
                        </Container>
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }

        <Pagination>
            {buildPagination()}
        </Pagination>
    </>
}

/*
因为page改变则重新渲染，所以useState给page添加状态 
Pagination只是构建分页的按钮，Pagination.Item用于说明每个按钮是什么
具体每页呈现什么由Col中的数组决定
 */

/*
当有请求体时 才需要Content-Type
"Content-Type": "application/json" 是用来告诉服务器，客户端正在发送 JSON 格式的数据。
*/