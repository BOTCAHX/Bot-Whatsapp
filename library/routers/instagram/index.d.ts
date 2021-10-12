/// <reference types="node" />
import { SessionsInstagram, ResponLoginInsta, IRequestInstagram, ResponseFollow, ResponseUnFollow, ResponseChangeProfilePicture, IGetFollower, IResponComentar } from "./types";
export default class InstagramAPI {
    private username;
    private passwords;
    constructor(username: string, passwords: string);
    BaseInstagram: string;
    WS_URL: string;
    PathSessions: string;
    private graphqlInsta;
    Sessions: SessionsInstagram;
    request: IRequestInstagram;
    RegexIgUsername: RegExp;
    getIdByUsername: (username: string) => Promise<string | null>;
    changeProfilePicture: (media: string) => Promise<ResponseChangeProfilePicture>;
    getFollowers: (id: string) => Promise<IGetFollower>;
    getFollowings: (id: string) => Promise<IGetFollower>;
    private getInfoBeforeUpdate;
    Follow: (id: string) => Promise<ResponseFollow>;
    UnFollow: (id: string) => Promise<ResponseUnFollow>;
    Block: (id: string) => Promise<{
        status: string;
    }>;
    UnBlock: (id: string) => Promise<{
        status: string;
    }>;
    Logout: () => Promise<boolean>;
    Login: (save?: boolean | undefined) => Promise<ResponLoginInsta | string>;
    getIdMedia: (url: string) => Promise<string>;
    Komentar: (id: string, text: string, replyID?: string | undefined) => Promise<IResponComentar>;
    Like: (id: string) => Promise<{
        status: string;
    }>;
    unLike: (id: string) => Promise<{
        status: string;
    }>;
    SaveMedia: (id: string) => Promise<{
        status: string;
    }>;
    UnSaveMedia: (id: string) => Promise<{
        status: string;
    }>;
    UploadMedia: (media: string | Buffer) => Promise<string>;
    uploadMediaPost: () => Promise<unknown>;
}
