const fs = require('fs');
const yaml = require('js-yaml');
const { sep } = require('path');

var ALL_LANGUAGES = [];

function getValue(obj, path = "") {
  path.split('.').forEach((p) => {
    obj = obj[p]
  })
  return obj;
}

module.exports = class {
  constructor(name, path) {
    this.name = name;
    ALL_LANGUAGES.push(name);
    
    this.files = {}

    fs.readdirSync(path + sep + name).forEach(file => {
      this.files[file.split('.').shift()] = yaml.safeLoad(fs.readFileSync(path + sep + name + sep + file, 'utf8'));
    })
  }

  get(file, path, data = {}) {
    if(!this.files[file]) return '<< null >>';
    let str = getValue(this.files[file], path);
    
    for(const d in data) {
      str = str.replace(`%{${d}}`, data[d]);
    }

    return str;
  }

  get getAllLanguage() {
    return ALL_LANGUAGES
  }
}