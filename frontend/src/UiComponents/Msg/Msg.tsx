import * as React from "react";
import "./Msg.css";

export interface IMsgProps {
    user_name:string;
    text:string;
    time:string;
    id:string;
}

export function Msg(props:IMsgProps) {
    return (
        <div className="text message">
            <div className="name">{props.user_name}</div>
            <div className="msg">{props.text}</div>
            <div className="time">{props.time}</div>
        </div>
    );
}
