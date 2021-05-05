import { ChannelMessageData } from "./channelMessageData";
import { SessionMessageData } from "./sessionMessageData";

export interface Message {
    type: string,
    data: ChannelMessageData | SessionMessageData
}