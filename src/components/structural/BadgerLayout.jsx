import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from '../../assets/logo.png'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {

    // TODO @ Step 6:
    // You'll probably want to see if there is an existing
    // user in sessionStorage first. If so, that should
    // be your initial loginStatus state.

    //法1
    //法1.1 在Logout组件中使用removeItem状态
    const afterLogin = Boolean((sessionStorage.getItem("loginStatus")))
    /* 法1.2
    const afterLogin = JSON.parse((sessionStorage.getItem("loginStatus")))
    如果Logout组件使用的是setItem来修改 需要在false前加上JSON.stringify 然后在这里用JSON.parse转化回来
    因为getItem会将false字符串识别为true*/
    const [loginStatus, setLoginStatus] = useState(afterLogin)

    /*
    法2 导入useEffect
    const [loginStatus, setLoginStatus] = useState(true)

    useEffect(() => {
        const afterLogin = Boolean(sessionStorage.getItem("loginStatus")) // React 状态应该是数据的“单一事实来源”。尽量减少对 sessionStorage 的依赖，只在组件挂载时读取一次。
        setLoginStatus(afterLogin) //在key不存在的时候，getItem得到的是null; key存在的时候得到的是字符串 所以要使用Boolean。 在没有执行setItem之前，getItem默认得到false的字符串
    }, [])
    */

    /* 错误：第一次写的管理登陆状态
    const reRender = () => {
        setLoginStatus(Boolean(sessionStorage.getItem("loginStatus")))  // 在函数中 使用setState 会导致无限循环。改变状态，重新渲染页面，执行函数，状态又改变了，所以无限循环
        if (loginStatus === true){                                      // setLoginStatus 是一个异步操作，立即检查 loginStatus 的值可能无法得到预期结果。
            return <Nav.Link as={Link} to="LogOut">LogOut</Nav.Link>
        }
        else{
            return (
                <>
                    <Nav.Link as={Link} to="login">Login</Nav.Link>
                    <Nav.Link as={Link} to="register">Register</Nav.Link>
                </>)
        }
    }
        */

    /*const handleSelect = (eventKey) => {
        return <Nav>
            <Nav.Link as={Link} to={eventKey}></Nav.Link>
        </Nav>
    }*/

    
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus?<Nav.Link as={Link} to="LogOut">LogOut</Nav.Link>:
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        }
                        <NavDropdown title="Chatrooms">
                            {/* TODO Display a NavDropdown.Item for each chatroom that sends the user to that chatroom! */}
                            {/*<NavDropdown.Item key="1.1" as={Link} to="Buckys Badger Den">Bascom Hill Chatters</NavDropdown.Item>
                            <NavDropdown.Item key="1.2" as={Link} to="Union South Socials">Memorial Union Hangout</NavDropdown.Item>
                            <NavDropdown.Item key="1.3" as={Link} to="Lake Mendota Viewpoint">Lake Mendota Viewpoint</NavDropdown.Item>
                            <NavDropdown.Item key="1.4" as={Link} to="State Street Strollers">State Street Strollers</NavDropdown.Item>
                            <NavDropdown.Item key="1.5" as={Link} to="Camp Randall Roar">Camp Randall Roar</NavDropdown.Item>
                            <NavDropdown.Item key="1.6" as={Link} to="Aldo Leopold Nature Talks">Aldo Leopold Nature Talks</NavDropdown.Item>
                            <NavDropdown.Item key="1.7" as={Link} to="Wisconsin State Capitol Debates">Wisconsin State Capitol Debates</NavDropdown.Item>
                            <NavDropdown.Item key="1.8" as={Link} to="Monona Terrace Meetups">Monona Terrace Meetups</NavDropdown.Item>
                            <NavDropdown.Item key="1.9" as={Link} to="Henry Vilas Zoo Enthusiasts">Henry Vilas Zoo Enthusiasts</NavDropdown.Item>
                            <NavDropdown.Item key="1.10" as={Link} to="Chazen Art Appreciation">Chazen Art Appreciation</NavDropdown.Item>*/}
                            {props.chatrooms.map(chatroom => {
                                return <NavDropdown.Item key={chatroom} as={Link} to={`chatrooms/${chatroom}`}>{chatroom}</NavDropdown.Item>
                            })}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;

/*
试验了一下 分别将Route和Nav.Link的某一个元素设为注释
如果将Route设为注释
页面仍然存在导航按钮，只是不能到达目标网页
如果将Nav.Link设为注释
页面的导航按钮消失了
 */

/*总结

React的渲染顺序 是从父组件到子组件的

1. useState 的初始值（或初始化函数）只在组件初次渲染时执行一次。组件重新渲染时，React 会直接使用之前的状态值，而不会重新计算或覆盖为初始值。
如果初始值的计算是一个复杂操作，给useState钩子直接传递一个函数，可以避免每次渲染都重复计算，因为初始化函数只会执行一次。虽然和传递结果一样都是执行一次，但传递结果会导致每次重新渲染时，会执行得到该结果的函数; 而传递函数则可以避免执行多余的函数
2. React的状态更新是异步的，不会立即更新状态，而是将更新请求排入队列
3. 如果setState的值和原先的值一样 不会触发重新渲染
4. 给setState传递函数，表示使用最新的状态来执行传递的函数。React在更新状态时调用这个函数。这个函数的作用是基于当前的状态值计算出新的状态值。解决了状态更新中依赖旧状态可能出错的问题，特别是在异步批量更新的场景中。

禁止在return中直接更新状态，这会导致无限渲染
如果你在渲染过程中调用了 setState 或类似的更新状态的方法，而状态更新又触发了组件的重新渲染，就会引发无限循环。
为解决上行的问题，确保 setState 只在适当的时间点被调用，例如事件处理函数或 useEffect 的依赖发生变化时，而不是在渲染过程中直接调用。

使用useEffect的情况
当需要在组件挂载或依赖变化时触发副作用时（发送网络请求、订阅事件、更新 DOM 等）和 需要动态响应某些状态变化时（当某个状态变化时，你需要执行某些逻辑）
使用次数少并不是目的，目的是减少不必要的副作用调用。但是如果可以在渲染阶段（函数组件体内）完成的操作，就不要放在 useEffect 中。

副作用函数 是指会对外部环境（组件外的状态或行为）产生影响的函数。例如，操作 DOM、修改全局变量、发起网络请求、订阅事件，甚至触发 React 的重新渲染，都被视为副作用。

比较的类型：浅比较 深比较 引用比较
1.浅比较：
是一种比较数据是否相等的方式，仅比较变量的表面值或引用，而不深入检查复杂数据结构内部的内容。
对于原始数据类型（number, string, boolean, null, undefined），直接比较值。
对于引用数据类型（object, array, function），只比较它们的引用（内存地址），而不比较内容。
React 使用浅比较来决定状态或属性是否发生变化，从而决定是否触发重新渲染。

2.深比较：
深比较会递归地检查对象或数组的所有属性，直到对比到原始数据类型为止。
检测两个复杂对象或数组是否完全相同。
Redux 的 combineReducers 或其他场景下优化性能。

3.引用比较：
只比较引用是否相同（即内存地址是否一致）。
常见于 JavaScript 的对象或数组。
React 的 useState 和 useEffect 默认采用引用比较。
例如
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = arr1;
console.log(arr1 === arr2); // false, 因为内存地址不同
console.log(arr1 === arr3); // true, 因为指向同一内存地址

React Context（上下文）
提供者（Provider）：
使用 <Context.Provider> 为组件树提供共享的状态。
每当 Provider 的 value 发生变化时，订阅了上下文的所有组件会重新渲染。
消费者（Consumer）：
通过 useContext(Context) 或 <Context.Consumer> 访问上下文值的组件被称为消费者。
消费者订阅上下文值，当值更新时自动重新渲染。
上下文值的更新与重新渲染：
当上下文值（value）发生变化时，所有使用 useContext 的组件都会重新渲染。
*/