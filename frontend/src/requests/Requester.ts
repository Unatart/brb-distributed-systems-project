import {CookieWorker} from "../helpers";

export class Requester {
    constructor(private logout:() => void) {
        //
    }

    public getUserInfo():Promise<any> {
        return fetch(`http://localhost:3001/users/${this.uid}/?user_id=${this.uid}`,
            {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            }
        )
            .then(this.check);
    }

    public updateInfo(body:any) {
        return fetch(`http://localhost:3001/users/${this.uid}/?user_id=${this.uid}`,
            {
                method: 'PATCH',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                },
                body: body
            });
    }

    public findContact(body:any) {
        return fetch(`http://localhost:3003/groups/?user_id=${this.uid}`,
            {
                method: 'POST',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                },
                body: body
            })
            .then((res) => {
                if (res.status === 401) {
                    this.cookie_worker.deleteAllCookies();
                    this.logout();
                }
                return res;
            });
    }

    public getUserParticipantGroup() {
        return fetch(`http://localhost:3003/groups/${this.uid}/?user_id=${this.uid}`,
            {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            })
            .then(this.check);
    }

    public getMessagesForGroup(group_id:string, to:number, from?:number) {
        return fetch(`http://localhost:3002/msg/${group_id}/?user_id=${this.uid}&to=${to}&from=${from}`,
            {
                method: "GET",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            })
            .then(this.check);
    }

    public updateGroupName(group_id:string, new_name:string) {
        return fetch(`http://localhost:3003/groups/${group_id}/?user_id=${this.uid}`,
            {
                method: "PATCH",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                },
                body: JSON.stringify({ name: new_name })
            })
            .then(this.check);
    }

    public getStat(service_name?:string, method?:string, count?:number) {
        return fetch(`http://localhost:3004/stat/?user_id=${this.uid}&service_name=${service_name}&method=${method}&count=${count}&admin=${true}`,
            {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            })
            .then(this.check);
    }

    public getGroupMembersNamesAndIds(group_id:string) {
        return fetch(`http://localhost:3003/groups/members/${group_id}/?user_id=${this.uid}`,
        {
                method: "GET",
                    mode: 'cors',
                credentials: "include",
                headers: {
                "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
            }
        })
            .then(this.check)
            .then((ids) => {
            const promises = ids.map((id:string) => {
                return fetch(`http://localhost:3001/users/${id}/?user_id=${this.uid}`,
                    {
                        method: 'GET',
                        mode: 'cors',
                        credentials: "include",
                        headers: {
                            "Access-Control-Allow-Credentials": "true",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer <" + this.token + ">"
                        }
                    }
                ).then((res) => res.json());
            });

            return Promise.all(promises);
        })
    }

    public deleteGroup(group_id:string) {
        return fetch(`http://localhost:3003/groups/${group_id}/?user_id=${this.uid}`,
            {
                method: "DELETE",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            }).then(this.check);
    }

    private check = (res:Response) => {
        if (res.status === 401) {
            this.cookie_worker.deleteAllCookies();
            this.logout();
        }
        return res.json();
    }

    private cookie_worker = new CookieWorker();
    private uid = this.cookie_worker.get("uid");
    private token = this.cookie_worker.get("token");
}
