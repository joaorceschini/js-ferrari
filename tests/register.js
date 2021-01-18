const { format } = require('date-fns')
const faker = require('faker')

const name = faker.name.firstName() + ' ' + faker.name.lastName()
const email = faker.internet.email().toLowerCase()
const birthDate = format(faker.date.past(), 'yyyy-MM-dd')
const password = faker.internet.password()

module.exports = {
  'PASSO 1: Acessar a página de autenticação': function(browser) {
    browser
      .resizeWindow(1300, 900)
      .url("http://localhost:8080")
      .waitForElementVisible('body')
      .assert.titleContains('Ferrari - Hcode Lab')
      .assert.visible('#header > div.menu > div > a')
      .click('#header > div.menu > div > a')
      .pause(5000)
  },
  'PASSO 2: Tentar fazer cadastro': function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.visible('#login > div.actions > div > a:nth-child(2)')
      .click('#login > div.actions > div > a:nth-child(2)')
      .assert.visible('#register')
      .setValue('#email-register', email)
      .setValue('#name', name)
      .setValue('#birth_at', birthDate)
      .setValue('#password-new', password)
      .setValue('#password-confirm', password)
      .saveScreenshot('./tests/screenshots/formulario-preenchido.png')
      .assert.visible('#register > div.actions > button')
      .click('#register > div.actions > button')
  },
  'PASSO 3: Verificar se autenticou após o cadastro': function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.urlEquals('http://localhost:8080/')
      .assert.visible('#header > div.menu.logged > div > div > div > a > small')
      .saveScreenshot('./tests/screenshots/home-autenticada.png')
      .assert.containsText('#header > div.menu.logged > div > div > div > a > small', email)
      .pause(3000)
      .end()

  }
}