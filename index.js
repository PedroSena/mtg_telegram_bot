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
    const nonUniqueNames = cards.map(c => c.name)
    const names = new Set(nonUniqueNames)
    //Same card, different editions, get first one
    if (names.size == 1) {
      ctx.replyWithPhoto(cards[0].imageUrl)
      return
    } else {
      if ((index = nonUniqueNames.indexOf(cardName)) != -1) {
        ctx.replyWithPhoto(cards[index].imageUrl)
        names.delete(cardName)
      }

      const options = Array.from(names).map((name, index) => `${index + 1}) ${name}`)
      ctx.reply(`Encontrei ${names.size} opcoes para ${cardName}: \n${options.join("\n")}`)
    }
  }, (error) => {
    ctx.reply(`Vixe, deu zika ${error}`)
  })
})

module.exports = bot
