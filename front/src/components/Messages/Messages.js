import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import './Messages.css';

const Messages = ({ messages }) => (
    <ScrollToBottom className="messages">
        {messages.map((message, i) => {
            if (message.user === 'admin') {
                return (
                    <p className="messageBoxAdmin" key={i}>{message.user}: {message.text}</p>
                )
            }
            else
                return (
                    <p className="messageBox" key={i}>{message.user}: {message.text}</p>
                )
        }
        )}
    </ScrollToBottom>
);

export default Messages;
