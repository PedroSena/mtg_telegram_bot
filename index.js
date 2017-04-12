const { Composer, mount } = require('micro-bot')
const mtg = require('mtgsdk')
const Telegraf = require('telegraf')

const bot = new Composer()
bot.use(Telegraf.memorySession())

bot.command('start', (ctx) => {
  ctx.reply('To na area')
})

bot.command('card', (ctx) => {
  let cardName = ctx.message.text.split("/card")[1].trim()

  // Numeric option
  if (cardName % 1 == 0) {
    const cardsNames = Array.from(ctx.session.cards)
    cardName = cardsNames[parseInt(cardName) - 1]
  }

  const promise = mtg.card.where({name: cardName, pageSize: 15})
  promise.then(cards => {
    if ( cards.length == 0 ) {
      ctx.reply(`Nao encontrei ${cardName}`)
      return
    }
    const nonUniqueNames = cards.map(c => c.name)
    const names = new Set(nonUniqueNames)
    //Same card, different editions, get first one
    if (names.size == 1) {
      const card = cards.find(c => c.imageUrl != null)
      if (card == null) {
        ctx.reply(`Nao ha imagens para ${cardName}`)
        return
      }
      ctx.replyWithPhoto(card.imageUrl)
    } else {
      ctx.session.cards = names
      if ((index = nonUniqueNames.indexOf(cardName)) != -1) {
        ctx.replyWithPhoto(cards[index].imageUrl)
        names.delete(cardName)
      }

      const options = Array.from(names).map((name, index) => `${index + 1}) ${name}`)
      ctx.reply(`Encontrei ${names.size} opcoes para ${cardName}: \n${options.join("\n")}`)
    }
  })
  promise.catch(error => {
    ctx.reply(`Vixe, deu zika ${error}`)
  })
})

module.exports = bot
