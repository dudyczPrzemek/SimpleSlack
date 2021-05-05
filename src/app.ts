import express, { Application, Request, Response } from 'express';
import { CreateChannelRequest } from './models/createChannelRequest';
import { ChannelService } from './services/channelService';
import { WebSocketService } from './services/websocketService';
import { Server } from "ws";
import { User } from './models/user';

const app: Application = express();

const channelService = new ChannelService();
const webSocketService = new WebSocketService(channelService);

const defaultPortNumber: number = 8080;
const wss = new Server({ port: defaultPortNumber });
wss.on('connection', (ws) => webSocketService.handleConnection(ws, wss));

app.use(express.json());

app.post('/channel', (req: Request, res: Response) => {
    try {
        const requestBody: CreateChannelRequest = req.body;
        const createChannelResponse = channelService.create(requestBody.channelName);
        res.send(createChannelResponse);
    } catch(e) {
        res.status(500).send({
            message: e.message
        });
    }
});

app.put('/channel/:channelId/register', (req: Request, res: Response) => {
    try {
        const channelId = req.params.channelId;
        const user: User = req.body;

        channelService.registerUserToChannel(channelId, user);
        res.sendStatus(200);
    } catch(e) {
        res.status(500).send({
            message: e.message
        });
    }
})

app.put('/channel/:channelId/deregister', (req: Request, res: Response) => {
    try {
        const channelId = req.params.channelId;
        const user: User = req.body;

        channelService.deregisterUserFromChannel(channelId, user.login);
        res.sendStatus(200);
    } catch(e) {
        res.status(500).send({
            message: e.message
        });
    }
})

export default app;