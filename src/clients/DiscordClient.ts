import {ChannelType, Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, TextChannel} from "discord.js";
import {ClientInterface} from "./ClientInterface";
import {Command} from "../command/Command";
import {Start} from "../command/Start";
import {CommandStructure} from "../types/CommandStructure";
import {Platforms} from "../enums/Platforms";

export class DiscordClient implements ClientInterface {
    private client: Client;
    private readonly clientId: string;
    private readonly botToken: string;
    private readonly commands: { [key: string]: Command };

    constructor(clientId: string, token: string) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
            ],
        });
        this.clientId = clientId;
        this.botToken = token;
        this.commands = {
            'start': new Start(),
        };
    }

    async start() {
        await this.setUpCommands();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
        });

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;
            const command = this.commands[interaction.commandName];

            if (!command) {
                console.log('Command not found!');
                return;
            }

            let commandArguments: string[] = [];
            if (command.options) {
                // @ts-ignore
                command.options.forEach(commandOption => {
                    const option = interaction.options.get(commandOption.name)?.value;
                    if (option) {
                        commandArguments.push(option.toString());
                    }
                });
            }

            await interaction.reply({content: 'Running command... Please wait.'});
            const commandStructure:CommandStructure = {
                command: interaction.commandName,
                arguments: commandArguments,
                platform: this.getName(),
                channelId: interaction.guildId+"|"+interaction.channelId,
                userId: interaction.user.id,
            };
            try {
                const result = await command.run(commandStructure);
                if (result.success) {
                    await interaction.editReply({content: result.message});
                } else {
                    await interaction.editReply({content: 'Error!' + result.message})
                }
            } catch(error) {
                console.error(error);
                await interaction.editReply({content: 'There was a problem running your command. Please try again later or report the issue!'});
            }
        });

        await this.client.login(this.botToken);
    }

    async sendMessage(discordChannelId: string, message: string) {
        // get the guild and the channel id from discordChannelId
        const [guildId, channelId] = discordChannelId.split('|');
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) {
            console.error('Guild '+guildId+' not found!')
            return;
        }
        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            console.error('Channel '+channelId+' not found!')
            return;
        }

        await (channel as TextChannel).send(message);
    }

    getName(): Platforms
    {
        return Platforms.Discord;
    }

    private async setUpCommands(): Promise<void> {
        console.log('Started refreshing application (/) commands.');

        const rest = new REST({ version: '10' }).setToken(this.botToken);
        let commands:any = [];
        Object.keys(this.commands).forEach(commandName => {
            const command = this.commands[commandName];
            if (!command) {
                return;
            }

            const slashCommandBuilder = new SlashCommandBuilder();
            slashCommandBuilder.setName(commandName);
            slashCommandBuilder.setDescription(command.description);
            if (command.options) {
                command.options.forEach(commandOption => {
                    slashCommandBuilder.addStringOption(option =>
                        option
                            .setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.required)
                    );
                });
            }

            commands.push(slashCommandBuilder.toJSON());
        });


        await rest.put(Routes.applicationCommands(this.clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    }
}
