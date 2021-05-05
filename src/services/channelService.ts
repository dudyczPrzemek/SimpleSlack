import { Channel } from "../models/channel";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../models/user";

export class ChannelService {
    private channels: Channel[] = [];

    create(channelName: string): {id: string} {
        if (this.channels.some((channel: Channel) => channel.name === channelName)) {
            throw new Error("Channel already exists!");
        }

        const newChannel: Channel = {
            id: uuidv4(),
            name: channelName,
            users: []
        };
        this.channels.push(newChannel);

        console.log(`Channel created! ChannelName: ${channelName}`);
        return { id: newChannel.id }
    }

    registerUserToChannel(channelId: string, user: User): void {
        const channel = this.channels.find(ch => ch.id ===  channelId);

        if (!channel) {
            throw new Error("Channel doesn't exists");
        }

        channel.users.push(user);
    }

    deregisterUserFromChannel(channelId: string, userLogin: string): void {
        const channel = this.channels.find(ch => ch.id ===  channelId);

        if (!channel) {
            throw new Error("Channel doesn't exists");
        }

        const user = channel.users.find(user => user.login === userLogin);
        if (!user) {
            throw new Error("User is not assigned to channel");
        }

        const index = channel.users.indexOf(user);
        channel.users.splice(index, 1);
    }
}