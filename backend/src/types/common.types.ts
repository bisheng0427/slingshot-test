export interface IMessage {
    type: string
    action: string
    payload: any
}

export interface IRes {
    success: boolean
    type?: string
    message?: string
    data?: any
}