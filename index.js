const { Composer, mount } = require('micro-bot')
const mtg = require('mtgsdk')

const bot = new Composer()

bot.command('start', (ctx) => {
  ctx.reply('To na area')
})

bot.command('card', (ctx) => {
  const cardName = ctx.message.text.split("/card")[1].trim()
  mtg.card.where({name: cardName, pageSize: 10}).then(cards => {
    if ( cards.length == 0 ) {
      ctx.reply(`Nao encontrei cartas com o nome ${cardName}`)
      return
    }
    const names = new Set(cards.map(c => { c.name }))
    //Same card, different editions, get first one
    if (names.size == 1) {
      ctx.reply(cards[0].imageUrl)
      return
    }
  })
})

module.exports = bot
