const { Composer, mount } = require('micro-bot')
const mtg = require('mtgsdk')

const bot = new Composer()

bot.command('start', (ctx) => {
  ctx.reply('To na area')
})

bot.command('card', (ctx) => {
  const cardName = ctx.message.text.split("/card")[1].trim()
  mtg.card.where({name: cardName, pageSize: 15}).then(cards => {
    if ( cards.length == 0 ) {
      ctx.reply(`Nao encontrei cartas com o nome ${cardName}`)
      return
    }
    const names = new Set(cards.map(c => c.name))
    //Same card, different editions, get first one
    if (names.size == 1) {
      ctx.reply(cards[0].imageUrl)
      return
    } else {
      const options = Array.from(names).map((name, index) => `${index + 1}) ${name}`)
      ctx.reply(`Encontrei ${names.size} opcoes para ${cardName}: \n${options.join("\n")}`)
    }
  }, (error) => {
    ctx.reply(`Vixe, deu zika ${error}`)
  })
})

module.exports = bot
