import WebSocket, { Server } from "ws";
import { ChannelMessageData } from "../models/channelMessageData";
import { Message } from "../models/message";
import { SessionMessageData } from "../models/sessionMessageData";
import { User } from "../models/user";
import { ChannelService } from "./channelService";

export class WebSocketService {
    constructor(private channelService: ChannelService){}

    handleConnection(ws: WebSocket, wss: Server): void {
        ws.send(`Welcome to App! Have fun!`);

        ws.on('message', (data: any) => {
            const message = this.getMessage(ws, data);

            if (!message) {
                return;
            }

            if (message.type === "session") {
                this.handleSessionMessage(ws, message.data as SessionMessageData);
            }

            else if (message.type === "channel") {
                this.handleChannelMessage(wss, ws, message.data as ChannelMessageData);
            }
        });
    }

    private handleSessionMessage(ws: any, sessionMessageData: SessionMessageData): void {
        try {
            ws.userLogin = sessionMessageData.userLogin;
        } catch(e) {
            console.log(e);
            ws.send("There was an error when starting the session");
        }
        
        ws.send("Session started");
    }

    private handleChannelMessage(wss: any, ws: any, channelMessageData: ChannelMessageData): void {
        if (!ws.userLogin) {
            ws.send("Session is not started");
            return;
        }

        if (ws.userLogin !== channelMessageData.authorLogin) {
            ws.send("Malformed user data");
            return;
        }

        let usersToNotify: User[];
        try {
            usersToNotify = this.channelService.getRegisteredUsersForChannel(channelMessageData.channelId);
        }
        catch(e) {
            ws.send(`${e.message}`);
            return;
        }

        if (!usersToNotify.find(user => user.login === channelMessageData.authorLogin)) {
            ws.send("User is not registered in channel");
            return;
        }

        wss.clients.forEach((client: any) => {
            if (client.readyState === WebSocket.OPEN) {
                if (client.userLogin && usersToNotify.find(user => user.login === client.userLogin)) {
                    client.send(`${channelMessageData.authorLogin}: ${channelMessageData.content}`);
                }
            }
        });
    }

    private getMessage(ws: WebSocket, data: any): Message | null {
        try {
            return JSON.parse(data);
        } catch (e) {
            this.sendError(ws, 'Wrong format');
            return null;
        }
    }

    private sendError(ws: WebSocket, message: any): void {
        const messageObject = {
            type: 'ERROR',
            payload: message,
        };
    
        ws.send(JSON.stringify(messageObject));
    };
}