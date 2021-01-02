let _modules = [];
for(const m in require('./modules')) { _modules.push(m) }

module.exports = {
  DEFAULT_SETTINGS: {
    prefix: '!',
    language: 'en',
    modules: _modules
  },

  DEFAULT_MEMBER_SETTINGS: {
    id: '',
    experience: 0,
    level: 1,
    reputation: 0,
    money: 0,
    bio: '',
    lastRep: '',
    lastDaily: ''
  },

  BOT_ADMINS: ['239654425424035840', '498481028697030656']
}