import * as React from "react";
import "./Members.css";

export interface User {
    admin?:boolean;
    email?:string;
    name:string;
    password:string;
    user_id:string;
}

interface IMembersMenuProps {
    users:User[];
}

export function MembersMenu(props:IMembersMenuProps) {
    return (
        <div className="dropdown">
            <button className="dropbtn">Members</button>
            <div className="dropdown-content">
                {props.users.map((user, id) =>
                    <div key={id}>{user.name}</div>
                )}
            </div>
        </div>
    );
}
