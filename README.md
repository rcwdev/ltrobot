# LtRobot Redux

## About this project:

This project includes all the source code for LtRobot - the chatbot that stays over at [TheLtWilson on Twitch](https://twitch.tv/theltwilson). This project is built on [Node.js](https://nodejs.dev), and is not intended to be used on a larger scale. This is built to be more open to expanding feature sets, however, it is currently incredibly specific to my use case.

## Current integrations:

This project interfaces with specific sources that apply to my use case, currently, those services are the following:

- [RestDB](https://restdb.io) - used for command database.
- [LastFM](https://last.fm) - used for currently playing music.

This was last updated **November 11th, 2021**.

---

## Before deployment:

Because I use this project personally, my own API keys are hidden, so LtRobot **will not** work out of the box, a decent amount of work & configuration is needed. Obviously, I'm not handing out my API keys and various other information, so if you would like a verbatum copy that functions exactly the same as I intended it to, follow these instructions.

### **1.** Before We Continue

This project requires [Node.js](https://nodejs.dev) to function, and the [Node Package Manager (npm)](https://npmjs.com) to manage the node modules required for the project to function.

If you have installed both prerequisites, in the root folder of the project run the command:

`npm install`

### **2.** Configuation File
In the `./storage` folder, by default you should see a folder, and a JSON file. For now, focus on the `default-config.json` file. Only a file titled "config.json" will be read by LtRobot, so we will do exactly that. Rename the file to `config.json`

That's barely any of the work, now you have to actually configure LtRobot. Here is a fairly extensive list on how to configure LtRobot:

- **name** (string) » This is the name used everywhere, logs, commands, etc.
- **version** (string) » The version of the current build, you are free to change this value.
- **stage** (string) » The stage of the project, the stage "Dev" is used for some logging, otherwise, this doesn't matter.
- **modules** (array) » These are all the JS files that are ran by the `main.js` file. You can get a full understanding of how these are formatted by looking at the `chat` module.

LtRobot still won't function at this point, so let's get further into the configuration file. Next, we need to provide some information so that the bot can access Twitch chat. Here is another fairly extensive list on configuring the `chat` module:

- **onlineMsg** (boolean) » If true, the bot will say in all chats when it has been turned on.
- **chat_username** (string) » This is the Twitch username of the bot, you will need to create an account for it if you have not already.
- **chat_token** (string) » This is essentially the "password" to login to Twitch chat, you can obtain a token by logging in via your bot's account from [here](https://twitchapps.com/tmi/), this setting should look like this: `oauth:YOUR_OAUTH_TOKEN`.
- **chat_channels** (array) » The bot will join all channels includes in this array.

Congrats, we have now set up the main configuration file!

### **3.** Module Specific Configuration Files

What does this mean? Good question. To organize, configuration files used for specific parts of modules, are stored in the `./storage/[module]` folder. Let's get started.

1. In the `./storage/chat` folder you should see two folders, `database` and `lastfm`, similar to the main configuration file, both of these folders contain a `default-config.json` file.
2. For each of the `default-config.json` files, rename them to `config.json`, otherwise it will not be read (and not work!)

Next lets review the contents of both configuration files, on how to do so. We'll start with the **database configuration file**, since it's objectivley needed for the bot to function, unless you plan to implent local storage.

> **Note:** This requires a free [RestDB](https://restdb.io) account.

1. Create a new database, you can name it anything you'd like.
2. In the top right corner, click the settings icon that slides out to reveal the label "Developer Mode"
3. With developer mode enabled, you should now be looking at a list of tabs, with the currently active one titled "Resources," you should also see a table that contains various collections (system_jobs, system_log, users, etc.). Click the `Add Collection` button.
4. Name the collection `commands`, this **must** be the name otherwise, the bot will not work. You can set a description or an icon if you like, then click `Save`.
5. You should be navigated back to the resources tab. Click on the newly created `commands` collection. You should now see another list of tabs, with the active tab being "fields," you should also see two buttons, one labeled "Add Field". Using the `Add Field` function, replicate all fields from [this template](https://rcwdev.s-ul.eu/img/KGoR0E21).
6. Finally, click the `Settings` button near the bottom left corner, then click `API`, now copy the `Server API-key` and paste it as a string into the `api_key` field of the `./storage/chat/database/config.json` file.
7. While in the settings page, copy the displayed database URL (e.g https://ltrobot-of69.restdb.io). In the `url` field of the same configuration file, paste the link and add `/rest/` to the end of the string. It should look like this: `url: "https://ltrobot-of69.restdb.io/rest/"`

Congratulations! We have now setup the remote database for the chatbot.

Finally, we will move on to the **LastFM configuration file**, which is far more easier than the database, I can assure you. Let's get started.

1. Create a [LastFM API Account](https://www.last.fm/api/account/create), you will need to fill in the required information.
2. With your newly created API application - [you can see a list here](https://www.last.fm/api/accounts). Copy the `API Key` and paste it into the `api_key` field of the `./storage/chat/lastfm/config.json` file.

Yeah, that was a lot easier.

---

## Deployment

This is a personal project that I have work on very rarely, I do not recommend running this in a production environment. Regardless, **if you have setup all configuration files**, you can run the following command to start the bot:

`npm start`

> **Developer note:** I am not a professional by any means, obviously the way the bot works fits my use case, and it could be far more efficient in lots of areas.