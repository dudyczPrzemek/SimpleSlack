import WebSocket from 'ws';
import { Message } from '../models/message';

export class ChannelService {
    private defaultPortNumber: number = 8080;
    private runningChannels: WebSocket.Server[] = [];

    create(channelName: string): void {
        const port = this.getFreePortNumber();
        const wss = new WebSocket.Server({ port: port });

        wss.on('connection', (ws) => {
            ws.send(`Welcome to ${channelName}! Have fun!`);

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
        });

        console.log(`Channel created! ChannelName: ${channelName}  Port: ${port}`);
        this.runningChannels.push(wss);
    }

    private getFreePortNumber(): number {
        if (!this.runningChannels.length) {
            return this.defaultPortNumber;
        }

        const lastRunningChannel = this.runningChannels[this.runningChannels.length-1];

        if(!lastRunningChannel.options.port) {
            throw Error("Wrong channel configuration");
        }

        return ++lastRunningChannel.options.port;
    }

    private sendError(ws: WebSocket, message: any): void {
        const messageObject = {
            type: 'ERROR',
            payload: message,
        };
    
        ws.send(JSON.stringify(messageObject));
     };
}