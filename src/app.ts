import express, { Application, Request, Response } from 'express';
import { CreateChannelRequest } from './models/createChannelRequest';
import { ChannelService } from './services/channelService';
import { WebSocketService } from './services/websocketService';
import { Server } from "ws";

const app: Application = express();

const channelService = new ChannelService();
const webSocketService = new WebSocketService();

const defaultPortNumber: number = 8080;
const wss = new Server({ port: defaultPortNumber });
wss.on('connection', (ws) => webSocketService.handleConnection(ws, wss));

app.use(express.json());

app.post('/channel', (req: Request, res: Response) => {
    const requestBody: CreateChannelRequest = req.body;
    channelService.create(requestBody.channelName);
    res.sendStatus(200);
});

export default app;