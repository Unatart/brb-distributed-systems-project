import * as React from "react";
import "./Board.css";
import {BoardRequester} from "./requests/BoardRequester";
import {Chat} from "../Chat/Chat";

export interface Group {
    id:string,
    name:string
}

interface IBoardState {
    name?:string;
    email?:string;
    find?:string;

    groups?:Group[];
    current_group?:Group;
}

// TODO: Добавить обработку ошибок
export class Board extends React.Component<{}, IBoardState> {
    public state:IBoardState = {}
    public componentDidMount() {
        this.requester.getInfo().then((data) => this.setState({ name: data.name, email: data.email }))
        this.requester.getUserParticipantGroup().then((data) => {
            const groups = data.map((record:any) => {
                return {
                    id: record.group_id,
                    name: record.name
                }
            });

            this.setState({ groups: groups });
        });
    }

    public render() {
        return (
            <div className="main">
                <div className="hover-main">
                    <div className="container">
                        <div className="item-a">
                            <div className="text">Username:</div>
                            <input
                                type="text"
                                name="name"
                                placeholder={this.state.name}
                                onKeyUp={this.updateInfo}
                                onChange={this.handleChange}
                            />
                            <div className="text">E-mail:</div>
                            <input
                                type="text"
                                name="email"
                                placeholder={this.state.email || "yours@mail.com"}
                                onKeyUp={this.updateInfo}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="item-f">
                            <input
                                type="text"
                                name="find"
                                placeholder={this.state.find || "try to find contact by name or email"}
                                onKeyUp={this.findContacts}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="item-b">
                            {this.state.groups && this.state.groups.map((group, key) =>
                                <div className="text" key={key} onClick={() => this.setGroup(group)}>{group.name}</div>
                            )}
                        </div>
                        <div className="item-d">
                            {this.state.current_group?.name}
                        </div>
                        <div className="item-c">
                            {this.state.current_group && this.state.name &&
                            <Chat
                                current_group={this.state.current_group}
                                user_name={this.state.name}
                            />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleChange = (event:any) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            ...this.state,
            [name]: value
        });
    }

    private updateInfo = (event:any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.requester.updateInfo(JSON.stringify({ name: this.state.name, email: this.state.email }));
        }
    }

    private findContacts = (event:any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.requester.findContact(JSON.stringify({
                user_names: [this.state.name, this.state.find],
                name: this.state.find
            }))
                .then((data) => {
                    const groups:Group[] | undefined = this.state.groups;
                    if (!groups) {
                        this.setState({ groups: [{
                                id: data[0].group_id,
                                name: data[0].name
                            }]});

                        return;
                    }

                    groups.push({ id: data[0].group_id, name: data[0].name });
                    this.setState({ groups: groups });
                });
        }
    }

    private setGroup = (group:Group) => {
        this.setState({ current_group: group });
    }

    private requester = new BoardRequester();
}
