export interface GetMessagesResponse {
    count: number;
    messages: string[];
}

export interface PostMessageResponse {
    ok: boolean;
}

export interface ErrorResponse {
    error: string;
}
