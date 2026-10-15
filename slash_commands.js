import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';

let numberText = 0;
const commands = [
    // Finished
    {
        name: 'ping',
        description: "Replies with Pong!",
    },
    // Finished
    {
        name: "help",
        description: "Shows you all the commands"
    },

    // Finished
    {
        name: "changetext",
        description: "You can change an announcement texts",
        options: [
            {
                name: "text_number",
                description: "What text number you want to change?",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 1,
                max_value: 3
            },
            {
                name: "new_text",
                description: "Write a new text here",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },

    // Finished
    {
        name: "checkevents",
        description: "Check all text announcements"
    },

    //WIP
    {
        name: "post",
        description: "Send one of the 3 texts",
        options: [
            {
                name: "text",
                description: "Choose one out of 3",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 1,
                max_value: 3
            },
            {
                name: "channel",
                description: "What channel ID?",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    }


];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Started refreshing application (/) commands. ');

    const data = await rest.put(

        Routes.applicationCommands(process.env.CLIENT_ID),

        { body: commands }

    );

    console.log(data.map(command => command.name));
    // await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands. ');
} catch (error) {
    console.log(error);
};