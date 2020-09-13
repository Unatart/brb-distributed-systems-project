import * as React from "react";
import "./Board.css";
import {Requester} from "../requests/Requester";
import {Chat} from "../Chat/Chat";
import {Link, useHistory} from "react-router-dom";
import {MembersMenu, User} from "../UiComponents/Members/Members";
import {CookieWorker} from "../helpers";

export interface Group {
    id:string,
    name:string
}

interface IBoardState {
    name?:string;
    email?:string;
    find?:string;

    group_name?:string;

    groups?:Group[];
    current_group?:Group;
    group_members?:User[];

    error_find?:string;
    error_change_name?:string;
}

interface IBoardProps {
    update_handler:() => void;
}

interface IBoardFullProps extends IBoardProps {
    history:any;
}

// TODO: Добавить обработку ошибок, удаление юзера из группы - low priority
export class Board extends React.Component<IBoardFullProps, IBoardState> {
    public state:IBoardState = {}
    public componentDidMount() {
        this.requester.getUserInfo().then((data) => this.setState({ name: data.name, email: data.email }))
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
                        <div className="item-extra">
                            <Link to="/" onClick={this.logout}>Log Out</Link>
                        </div>
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
                            <div className="add-group-error">{this.state.error_change_name}</div>
                        </div>
                        <div className="item-f">
                            <div className="text macro"> Add new group: </div>
                            <input
                                className="add-group"
                                type="text"
                                name="find"
                                placeholder={this.state.find || "try to find contact by name or email"}
                                onChange={this.handleChange}
                            />
                            <input
                                className="add-group"
                                type="text"
                                name="group_name"
                                placeholder={this.state.group_name || "enter group name"}
                                onChange={this.handleChange}
                                onKeyUp={this.findContacts}
                            />
                            <div className="add-group-error">{this.state.error_find}</div>
                        </div>
                        <div className="item-b">
                            <div className="text macro"> Group list: </div>
                            {this.state.groups && this.state.groups.map((group, key) =>
                                <div className="contact-block" key={key + "parent"}>
                                    <div className="text contact" key={key + "name"} onClick={() => this.setGroup(group)}>
                                        {group.name}
                                    </div>
                                    <div className="cross" key={key + "delete"} onClick={() => this.deleteGroup(group)}>☓</div>
                                </div>
                            )}
                        </div>
                        <div className="item-d">
                            <input
                                type="text"
                                name="setted_group_name"
                                placeholder={this.state.current_group?.name || ""}
                                onChange={this.handleChange}
                                onKeyUp={this.updateGroupName}
                            />
                            {this.state.group_members && <MembersMenu users={this.state.group_members}/>}
                        </div>
                        <div className="item-c">
                            {this.state.current_group && this.state.name &&
                            <Chat
                                update_handler={this.logout}
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

        if (name === "setted_group_name") {
            this.setState({ current_group: { name: value, id: this.state.current_group!.id } });
            return;
        }

        this.setState({ [name]: value });
    }

    private updateInfo = (event:any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.requester.updateInfo(JSON.stringify({ name: this.state.name, email: this.state.email }))
                .then((response) => {
                    if ([200, 201].indexOf(response.status) === -1) {
                        if (response.status === 401) {
                            return this.logout();
                        }
                        response.text().then((err) =>
                            this.setState({ error_change_name: err }));
                    } else {
                        this.setState({ error_change_name: undefined });
                    }
                });
        }
    }

    private findContacts = (event:any) => {
        event.preventDefault();
        if (!this.state.find) {
            this.setState({error_find: "Fill in the fields above to create a group"});
            return;
        }
        if (event.keyCode === 13) {
            const users:string[] = this.state.find!.split(",").map(str => str.trim());

            this.requester.findContact(JSON.stringify({
                user_names: [this.state.name, ...users],
                name: this.state.group_name || [this.state.name, ...users].join("")
            }))
                .then((response) => {
                    if ([200, 201].indexOf(response.status) === -1) {
                        if (response.status === 401) {
                            return this.logout();
                        }
                        response.text().then(() =>
                            this.setState({ error_find: "Can't find user(s) with such username(s)" }));
                    } else {
                        response.json().then((data) => {
                            const groups:Group[] | undefined = this.state.groups;
                            if (!groups) {
                                this.setState({ groups: [{
                                        id: data[0].group_id,
                                        name: data[0].name
                                    }]});

                                return;
                            }

                            groups.push({ id: data[0].group_id, name: data[0].name });
                            this.setState({ groups: groups, error_find: undefined });
                        });
                    }
                })
        }
    }

    private updateGroupName = (event:any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.requester.updateGroupName(this.state.current_group!.id, this.state.current_group!.name)
                .then((result) => {
                    const groups = this.state.groups;
                    for (let i = 0; i < groups!.length; i++) {
                        if (groups![i].id === result[0].group_id) {
                            groups![i].name = result[0].name;
                        }
                    }

                    this.setState(
                        {
                            current_group:
                                {
                                    id: result[0].group_id,
                                    name: result[0].name
                                },
                            groups: groups
                        }
                    );
                });
        }
    }

    private setGroup = (group:Group) => {
        this.setState({ current_group: group });
        this.requester.getGroupMembersNamesAndIds(group.id).then((data) =>
            this.setState({ group_members: data as User[] }));
    }

    private deleteGroup = (deleting_group:Group) => {
        if (this.state.groups) {
            const new_groups = this.state.groups?.filter((group) => group.id !== deleting_group.id);
            this.setState({ groups: new_groups, current_group: undefined, group_name: undefined, group_members: undefined });
            this.requester.deleteGroup(deleting_group.id);
        }
    }

    private logout = () => {
        this.cookie_worker.deleteAllCookies();
        this.props.history.push("/");
        this.props.update_handler();
    }

    private requester = new Requester(this.logout);
    private cookie_worker = new CookieWorker();
}

export function BoardWithHistory(props:IBoardProps) {
    let history = useHistory();

    return (
        <Board history={history} {...props}/>
    );
}
