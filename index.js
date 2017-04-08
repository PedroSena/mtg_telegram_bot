const { Composer, mount, Telegraf } = require('micro-bot')
const mtg = require('mtgsdk')

const bot = new Composer()
bot.use(Telegraf.memorySession())

bot.command('start', (ctx) => {
  ctx.reply('To na area')
})

bot.command('card', (ctx) => {
  const cardName = ctx.message.text.split("/card")[1].trim()

  // Numeric option
  if (cardName % 1 == 0) {
    const card = ctx.session.cards[parseInt(cardName) - 1]
    ctx.replyWithPhoto(card.imageUrl)
    ctx.session.cards = null
    return
  }

  const promise = mtg.card.where({name: cardName, pageSize: 15})
  promise.then(cards => {
    if ( cards.length == 0 ) {
      ctx.reply(`Nao encontrei cartas com o nome ${cardName}`)
      return
    }
    const nonUniqueNames = cards.map(c => c.name)
    const names = new Set(nonUniqueNames)
    //Same card, different editions, get first one
    if (names.size == 1) {
      ctx.replyWithPhoto(cards[0].imageUrl)
      return
    } else {
      ctx.session.cards = cards
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
