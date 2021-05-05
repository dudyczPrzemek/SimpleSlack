import express, { Application, Request, Response } from 'express';
import { CreateChannelRequest } from './models/createChannelRequest';
import { ChannelService } from './services/channelService';

const app: Application = express();
const channelService = new ChannelService();

app.use(express.json());

app.post('/channel', (req: Request, res: Response) => {
    const requestBody: CreateChannelRequest = req.body;
    channelService.create(requestBody.channelName);
    res.sendStatus(200);
});

export default app;