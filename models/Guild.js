/**
 * @author CallMeMrSam
 */
const { Schema, model } = require('mongoose');
const { DEFAULT_SETTINGS: defaults } = require('../utils/config');

const guildSchema = Schema({
    _id: Schema.Types.ObjectId,
    
    guildID: String,
    
    language: {
      type: String,
      default: defaults.language
    },

    settings: {
      type: Object,
      default: {}
    },

    modules: {
      type: Array,
      default: defaults.modules
    },
    
    prefix: {
      type: String,
      default: defaults.prefix
    },

    users: {
      type: Array,
      default: []
    }
});

module.exports = model("Guild", guildSchema);