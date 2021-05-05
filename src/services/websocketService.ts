import WebSocket, { Server } from "ws";
import { Message } from "../models/message";

export class WebSocketService {

    handleConnection(ws: WebSocket, wss: Server): void {
        ws.send(`Welcome to App! Have fun!`);

        ws.on('message', (data: any) => {
            let message: Message;

            try {
                message = JSON.parse(data);
            } catch (e) {
                this.sendError(ws, 'Wrong format');
                return;
            }

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`${message.author}: ${message.content}`);
                }
            });
        });
    }

    private sendError(ws: WebSocket, message: any): void {
        const messageObject = {
            type: 'ERROR',
            payload: message,
        };
    
        ws.send(JSON.stringify(messageObject));
    };
}