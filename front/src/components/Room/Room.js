import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import usersStore from '../../store/store'
import './Room.css'
import Messages from '../Messages/Messages'
import { Redirect } from "react-router-dom";
import { observer } from 'mobx-react';

let ENDPOINT = 'https://best-chat-app.herokuapp.com/'
console.log("process.env.NODE_ENV= ", process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
    ENDPOINT = 'localhost:5000'
}

let socket
export default observer(
    function Room() {
        const [messages, setMessages] = useState([])
        const [message, setMessage] = useState('')

        useEffect(() => {

            var connectionOptions = {
                "force new connection": true,
                "reconnectionAttempts": "Infinity",
                "timeout": 10000,
                "transports": ["websocket"]
            };

            socket = io(ENDPOINT, connectionOptions)

            socket.emit('join', { name: usersStore.usersName }, (res) => {
                if (res) {
                    socket.off()
                    socket.disconnect(0)
                    usersStore.isUserExistNow = res.error
                    usersStore.isLoogingIn = false
                    return
                }
            })
        }, [ENDPOINT, usersStore.isLoogingIn])

        useEffect(() => {
            socket.on('message', (message) => {
                setMessages([...messages, message])
            })
            return () => {
                socket.off()
            }

        }, [messages])


        const sendMessage = (event) => {
            event.preventDefault()
            if (message) {
                socket.emit('sendMsg', message, setMessage(''))
            }
        }

        if (!usersStore.isLoogingIn) {
            return <Redirect to="/"></Redirect>
        }
        else
            return (
                <div>
                    <div className="outerContainer">
                        <div className="container">
                            <h1>Hi {usersStore.usersName} {usersStore.isLogInPast ? "and welcome back!" : "for the first time!"}</h1>
                            <Messages messages={messages} />

                            <div className="line">
                                <input
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                />
                                <button onClick={(event) => sendMessage(event)}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
)

// export default Room