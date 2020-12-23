module.exports = class {
  constructor() { }

  error(m) {
    console.log(`[Erreur] ${m}`)
  }

  success(m) {
    console.log(`[Succès] ${m}`)
  }

  warn(m) {
    console.log(`[Avertissement] ${m}`)
  }

  info(m) {
    console.log(`[Info] ${m}`)
  }
}