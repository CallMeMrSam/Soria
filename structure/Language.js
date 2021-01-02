const fs = require('fs');
const yaml = require('js-yaml');
const { sep } = require('path');

var ALL_LANGUAGES = [];

function getValue(obj, path = "") {
  let error = false;
  path.split('.').forEach((p) => {
    if(obj[p]) obj = obj[p]
    else error = true;
  })
  return {obj, error};
}

module.exports = class {
  constructor(name, path) {
    this.name = name;
    ALL_LANGUAGES.push(name);
    
    this.files = {}
    this.defaultFiles = {};

    fs.readdirSync(path + sep + name).forEach(file => {
      this.files[file.split('.').shift()] = yaml.safeLoad(fs.readFileSync(path + sep + name + sep + file, 'utf8'));
    })
    fs.readdirSync(path + sep + 'en').forEach(file => {
      this.defaultFiles[file.split('.').shift()] = yaml.safeLoad(fs.readFileSync(path + sep + 'en' + sep + file, 'utf8'));
    })
  }

  get(file, path, data = {}) {
    if(!this.files[file]) return '<< null >>';
    let value = getValue(this.files[file], path);
    let str = '';

    if(value.error) {
      let defaultValue = getValue(this.defaultFiles[file], path);
      if(defaultValue.error) return '<< null >>';
      str = defaultValue.obj;
    } else str = value.obj;
    
    for(const d in data) {
      str = str.replace(`%{${d}}`, data[d] || '<< Undefined >>');
    }

    return str;
  }

  get getAllLanguage() {
    return ALL_LANGUAGES
  }
}