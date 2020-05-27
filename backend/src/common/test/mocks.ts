export interface req {
    params: any,
    body: any,
    query: any
}

export interface res {
    status: () => void,
    json: () => void
    send: () => void
}
