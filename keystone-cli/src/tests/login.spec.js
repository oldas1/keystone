require('./utils/mock')
const { prepareEnvironment } = require('./utils')
const nock = require('nock')
const fs = require('fs')
const path = require('path')
const {
  publicKey,
  privateKey,
  encryptedSession,
  profile,
} = require('./utils/keypair')
// Mock "open" module only for this test.
// If you want to always mock module for all tests,
// create a file in __mocks__ folder (at root),
// with file name with the module name, like (__mocks__/open.js):
// module.exports = jest.genMockFromModule('open')
jest.mock('open', () => {
  return jest.genMockFromModule('open')
})

jest.mock('../lib/blockstackLoader')
jest.mock('../lib/commands')

const open = require('open')
const LoginCommand = require('../commands/login')
const {
  login,
  logout,
  runCommand,
  putFile,
  getSessionWithConfig,
} = require('./utils/helpers')

nock('https://gaia.blockstack.org')
  .persist()
  .get(/.*login.*/)
  .reply((uri, body) => {
    console.log('mocked login', uri)
    return [200, encryptedSession]
  })

nock('https://gaia.blockstack.org')
  .persist()
  .get(/.*profile.*/)
  .reply((uri, body) => {
    console.log('URI', uri)
    return [200, [profile]]
  })

nock('https://gaia.blockstack.org')
  .persist()
  .get(/.*public.*/)
  .reply((uri, body) => {
    console.log('URI', uri)
    return [200, publicKey]
  })

describe('Login Command', () => {
  let result

  beforeEach(() => {
    // catch everything on stdout>
    // and put it in result
    result = []

    // this hides console.log calls
    jest.spyOn(process.stdout, 'write').mockImplementation(val => {
      result.push(val)
      fs.appendFile('unit-test.log', val)
    })
  })

  afterEach(() => jest.restoreAllMocks())

  it('Login', async () => {
    await prepareEnvironment()
    // Start logged out
    await logout()

    // overwrite static function getKeypair in order to know the keypair
    LoginCommand.getKeypair = () => {
      return {
        publicKey,
        privateKey,
      }
    }

    const simulateUserConfirm = async () => {
      // simulate the user login to generate a file with the session
      // encrypted with the key above.
      await login()

      const userSession = await getSessionWithConfig()

      await putFile({
        path: `${publicKey}.json`,
        content: JSON.stringify(userSession.store.getSessionData()),
        encrypt: publicKey,
      })

      await logout()
    }
    const username = 'keystone_test1.id.blockstack'
    await simulateUserConfirm()

    fs.writeFile(
      path.join(__dirname, `./hub/${username}--public.key`),
      publicKey
    )
    await runCommand(LoginCommand, [username])

    expect(open).toHaveBeenCalledTimes(1)

    const logged = result.find(log => {
      return log.indexOf(`You can logout with`) > -1
    })
    expect(logged).toBeDefined()
  }, 10000)
})
