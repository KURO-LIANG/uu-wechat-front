declare type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
declare interface RequestData {

}
declare interface ResultRes<T> {
    code:number
    message: string
    data: T
}
declare interface PageRes<T> {
    currentPage: number
    total: number
    list: Array<T>
}

declare interface UserInfo {
    avatar: string
    cancelSubscribeTime?: string
    channelId?: number
    language?: string
    longAndLati?: string
    maOpenId?: string
    mpOpenId?: string
    nickName: string
    phone?: string
    qrSceneStr?: string
    subscribe?: number
    subscribeNum?: number
    subscribeScene?: string
    subscribeTime?: string
    uid?: string
    unionId?: string
    userId: number
    smsNum?: number
    vmsNum?: number
}

declare interface ResultAuth {
    openId: string
    unionId: string
    token: string
    userInfo?: UserInfo
}

declare interface ListReq {

}
declare interface ListRes {

}
declare interface InfoRes {

}
