/**
 * @author CallMeMrSam
 */
const mongoose = require('mongoose');
const models = require('../models/index');

const Client = require('../structure/Client');
const { Guild, GuildMember } = require('discord.js');
const { DEFAULT_MEMBER_SETTINGS } = require('./config');

module.exports = class {

    /**
     * 
     * @param {Client} client
     */
    constructor(client) {
        this.client = client;

        this.guildsCache = {};
        this.usersCache = {};
        this.giveawaysCache = [];
    }

    /**
     * Initier la connexion avec la base de donnée.
     * @param {Object} opt Options de mongoose
     */
    init(opt = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false,
        poolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    }) {
        mongoose.connect(process.env.DB_URI, opt);
        mongoose.Promise = global.Promise;
        
        mongoose.connection.on("connected", () => {
            this.client.logger.success("BDD connected");
            this.client.connectedToDB = true;
        });
    }

    async _updateGuildCache(guild, data = undefined) {
        if(!data) data = models.Guild.findOne({ guildID: guild.id });
        this.guildsCache[guild.id] = data;
    }

    async _updateUserCache(user, data = undefined) {
        if(!data) data = models.User.findOne({ userID: user });
        this.usersCache[user] = data;
    }

    /**
     * Créer les données d'un serveur.
     * @param {Guild} guild 
     */
    async createGuild(guild) {
        let data = await models.Guild.findOne({ guildID: guild.id });
        if(data) return data;

        const pushData = Object.assign({_id: mongoose.Types.ObjectId()}, { guildID: guild.id });
        const createdGuild = new models.Guild(pushData);
        await createdGuild.save();
        this._updateGuildCache(guild, createdGuild);
        return createdGuild;
    }

    /**
     * Supprimer les données d'un serveur.
     * @param {Guild} guild Serveur
     */
    async deleteGuild(guild) {
        await models.Guild.findOneAndDelete({ guildID: guild.id });
        if(this.guildsCache[guild.id]) this.guildsCache[guild.id] = {};
    }


    /**
     * Récupérer les données d'un serveur
     * @param {Guild} guild Serveur
     */
    async getGuild(guild) {
        if(this.guildsCache[guild.id]) return this.guildsCache[guild.id];
        
        let data = await models.Guild.findOne({ guildID: guild.id });
        if(data || data !== null) {
            this._updateGuildCache(guild, data);
            return data;
        } else {
            let newGuild = await this.createGuild(guild);
            return newGuild;
        }
    }

    /**
     * 
     * @param {Guild} guild 
     * @param {object} settings 
     */
    async updateGuild(guild, pushData) {
        let data = await this.getGuild(guild);

        if(typeof data !== "object") data = {};
        for(const key in pushData) {
            if(data[key] !== pushData[key]) {
                if(typeof pushData[key] === "object" && !Array.isArray(pushData[key])) {
                    for(const key2 in pushData[key]) {
                        if(data[key][key2] !== pushData[key][key2]) data[key][key2] = Object.assign(data[key][key2], pushData[key][key2])
                    }
                }
                else data[key] = pushData[key];
            }
        }
        this._updateGuildCache(guild, data);
        return await data.updateOne(data);
    }

    /**
     * Créer les données d'un utilisateur
     * @param {Guild} guild Serveur
     * @param {GuildMember} member Membre
     */
    async createMember(guild, member) {
        await models.Guild.updateOne({ guildID: guild.id }, {
            $push: { users: [DEFAULT_MEMBER_SETTINGS] }
        });
        this._updateGuildCache(guild);
        return DEFAULT_MEMBER_SETTINGS
    }

    /**
     * Créer les données d'un utilisateur
     * @param {Guild} guild Serveur
     * @param {GuildMember} member Membre
     */
    async getMember(guild, member) {
        const data = await this.getGuild(guild);
        const position = data.users.map(u => u.id).indexOf(member.user.id);
        if(position == -1) return await this.createMember(guild, member);
        let memberData = data.users[position];

        return Object.assign( Object.assign({}, DEFAULT_MEMBER_SETTINGS), memberData );
    }

    /**
     * Récupérer les données d'un utilisateur
     * @param {Guild} guild Serveur
     * @param {GuildMember} member Membre
     */
    async updateMember(guild, member, data) {
        let pushData = {};
        for(var key in data) {
            pushData[`users.$.${key}`] = data[key];
        }
        await models.Guild.updateOne({ guildID: guild.id, "users.id": member.user.id },
            { $set: pushData }
        );
        this._updateGuildCache(guild);
    }

    /**
     * Créer les données d'un utilisateur (global)
     * @param {string} user ID de l'utilisateur
     */
    async createUser(user) {
        let data = await models.User.findOne({ userID: user });
        if(data) return data;

        const pushData = Object.assign({_id: mongoose.Types.ObjectId()}, { userID: user });
        const createdUser = new models.User(pushData);
        await createdUser.save();
        this._updateUserCache(user, createdUser);
        return createdUser;
    }

    /**
     * Récupérer les données d'un utilisateur
     * @param {string} user ID de l'utilisateur
     */
    async getUser(user) {
        if(this.usersCache[user]) return this.usersCache[user];
        
        let data = await models.User.findOne({ userID: user });
        if(data || data !== null) {
            this._updateUserCache(user, data);
            return data;
        } else {
            let pushData = {
                userID: user,
                wins: 0,
                lang: undefined
            }
            return pushData;
        }
    }

    /**
     * Récupérer les données d'un utilisateur
     * @param {string} user ID de l'utilisateur
     * @param {object} pushData 
     */
    async updateUser(user, pushData) {
        let data = await models.User.findOne({ userID: user });
        if(!data) data = await this.createUser(user);

        if(typeof data !== "object") data = {};
        for(const key in pushData) {
            if(data[key] !== pushData[key]) data[key] = pushData[key];
        }
        this._updateUserCache(user, data);
        return await data.updateOne(data);
    }

    get getGuildsCache() {
        return this.guildsCache;
    } 
    get getUsersCache() {
        return this.usersCache;
    }
}