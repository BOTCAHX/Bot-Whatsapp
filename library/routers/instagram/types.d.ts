import { AxiosRequestConfig, AxiosPromise } from "axios";
export declare class SessionsInstagram {
    status: boolean;
    headers: HeadersInstagram;
    _sharedData: any | null;
}
export declare interface HeadersInstagram {
    "X-CSRFToken": string | null;
    "X-Instagram-AJAX": number;
    "X-Requested-With": string;
    "accept-language": string | null;
    cookie: null | string;
    "User-Agent": string;
}
export declare interface DataLoginInsta {
    enc_password: string;
    username: string;
}
export declare interface ResponLoginInsta {
    user: boolean;
    userId: string;
    authenticated: boolean;
    oneTapPrompt: boolean;
    status: string;
}
export declare class IRequestInstagram {
    get: (options: AxiosRequestConfig, headers?: any) => AxiosPromise<any> | Error;
    post: (options: AxiosRequestConfig, headers?: any) => AxiosPromise<any> | Error;
}
export declare interface CookieParsed {
    key: string;
    value: string;
    expires: string;
    maxAge: number;
    domain: string;
    path: string;
    secure: boolean;
    creation: string;
}
export declare interface ResponseFollow {
    result: string;
    status: string;
}
export declare interface ResponseUnFollow {
    status: string;
}
export declare interface ResponseChangeProfilePicture {
    changed_profile: boolean;
    id: number;
    has_profile_pic: boolean;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    status: string;
}
export declare interface BeforeInfoUpdate {
    name: string;
    username: string;
    website: string;
    bio: string;
    email: string;
    phone: string;
    gender: string;
}
export declare class IConfigChangeProfile {
    first_name?: string;
    email?: string;
    username?: string;
    phone_number?: string;
    biography?: string;
    external_url?: string;
    chaining_enabled?: string | boolean;
}
export declare class IGetNodeFollower {
    node: IGetFollowers;
}
export declare class IGetFollowers {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
    is_verified: boolean;
    followed_by_viewer: boolean;
    requested_by_viewer: boolean;
}
export declare interface IGetFollower {
    total_followers: number;
    list: IGetFollowers[];
}
export declare class IResponComentar {
    id: string;
    from: IFromComentar;
    text: string;
    created_time: number;
    status: string;
}
export declare interface IFromComentar {
    id: string;
    username: string;
    full_name: string;
    profile_picture: string;
}
export declare interface ICreateParamsUploadInsta {
    media_type: number;
    upload_id: string;
    upload_media_height: number;
    upload_media_width: number;
    xsharing_user_ids: string;
    image_compression: string;
}
