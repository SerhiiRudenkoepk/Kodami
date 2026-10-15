import { Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ComponentType, ButtonStyle, Partials } from 'discord.js';
import { readFile, writeFile } from 'node:fs/promises';

const followerRoleID = "1560414083470065754";
const announcePath = new URL('./announce_text.json', import.meta.url);
const announceData = await readFile(announcePath, 'utf8');
let announceParse = JSON.parse(announceData);
let announcementText = [...announceParse];

// Pages
let page = 0;
let pages = [
    "General commands: /help, /ping",
    "Moderation commands: soon.",
    "Configuartion commands: soon",
    // "Page 4: Other commands"
];

// Action row for help
const actionRow_help = new ActionRowBuilder({
    components: [
        {
            custom_id: "help_page_1",
            label: "1",
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
        },
        {
            custom_id: "help_page_2",
            label: "2",
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
        },
        {
            custom_id: "help_page_3",
            label: "3",
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
        },

    ],
})


// Announce Action Row
const actionRow_announce = new ActionRowBuilder({
    components: [
        {
            custom_id: "ann_page_1",
            label: "1",
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
        },
        {
            custom_id: "ann_page_2",
            label: "2",
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
        },
        {
            custom_id: "ann_page_3",
            label: "3",
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
        },

    ],
});




// Embed Help
const embed_help = new EmbedBuilder()

    .setTitle('Kodami - commands')
    .setDescription(pages[page])

    .setFooter({ text: "That's a footer, bro" });

// Embed Announce
const embed_announce = new EmbedBuilder()
    .setTitle('Kodami - commands')
    .setDescription(announcementText[page])

    .setFooter({ text: "That's a footer, bro" });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers

    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User
    ],
});

// Executes it once
client.once(Events.ClientReady, (readyClient) => {

    console.log(`Kodami is online! Logged in as ${readyClient.user.tag}`);
});




// adding a specifict role to people, who reacted in the specific channel
client.on(Events.MessageReactionAdd, async(reaction, user) => {
    const reason = "You accepted the rules";
    const guild = reaction.message.guild;
    const userReactedID = await guild.members.fetch(user.id);
    userReactedID.roles.add(followerRoleID);
    // const channel = await client.channels.fetch(channelID);
    
});




// The whole event statement
client.on(Events.InteractionCreate, async interaction => {

    try {
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'ping':
                    await interaction.reply('Pong!');
                    return;
                case 'help':
                    await interaction.reply({
                        embeds: [embed_help],
                        components: [actionRow_help]
                    });
                    return;
                case 'checkevents':
                    await interaction.reply({
                        embeds: [embed_announce],
                        components: [actionRow_announce]
                    });
                    return;
                case 'post': {
                    const channelID = interaction.options.getString('channel');
                    const channel = await client.channels.fetch(channelID);
                    const choice = interaction.options.getInteger('text');
                    if (!choice || choice < 1 || choice > announcementText.length) {
                        await interaction.reply({ content: 'Choose a number between 1 and 3.', ephemeral: true });
                        return;
                    }

                    await channel.send(announcementText[choice - 1]);
                    return;
                }
                case "changetext": {
                    const choice = interaction.options.getInteger('text_number');
                    const textchange = interaction.options.getString('new_text');
                    if (!choice || choice < 1 || choice > announcementText.length) {
                        await interaction.reply({ content: 'Choose a number between 1 and 3.', ephemeral: true });
                        return;
                    }

                    announcementText[choice - 1] = textchange;
                    announceParse = [...announcementText];
                    const updateJsonAnnounce = JSON.stringify(announceParse, null, 2);
                    await writeFile(announcePath, updateJsonAnnounce, 'utf8');

                    await interaction.reply({ content: `Updated announcement ${choice}.`, ephemeral: true });
                    return;
                }
            }
        }

        if (interaction.isButton() && interaction.customId?.startsWith('help_')) {
            switch (interaction.customId) {
                case 'help_page_1':
                    page = 0;
                    break;
                case 'help_page_2':
                    page = 1;
                    break;
                case 'help_page_3':
                    page = 2;
                    break;
                default:
                    return;
            }

            const updatedEmbed = new EmbedBuilder(embed_help.data)
                .setDescription(pages[page]);

            await interaction.update({
                embeds: [updatedEmbed],
                components: [actionRow_help]
            });
            return;
        }

        if (interaction.isButton() && interaction.customId?.startsWith('ann_')) {
            switch (interaction.customId) {
                case 'ann_page_1':
                    page = 0;
                    break;
                case 'ann_page_2':
                    page = 1;
                    break;
                case 'ann_page_3':
                    page = 2;
                    break;
                default:
                    return;
            }

            const updatedEmbed = new EmbedBuilder(embed_announce.data)
                .setDescription(announcementText[page]);

            await interaction.update({
                embeds: [updatedEmbed],
                components: [actionRow_announce]
            });
        }
    } catch (error) {
        if (error?.code === 10062 || error?.status === 404) {
            console.warn('Ignored stale Discord interaction.');
            return;
        }

        console.error('Unhandled interaction error:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);