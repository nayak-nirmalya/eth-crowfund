const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' })

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000',
  })

  ;[campaignAddress] = await factory.methods.getDeployedCampaigns().call()
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress,
  )
})

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('marks caller as the manager of campaign', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(accounts[0], manager)
  })

  it('allows people to contribute money and mark them approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    })
    assert(await campaign.methods.approvers(accounts[1]).call())
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: accounts[2],
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy Something', '100', accounts[5])
      .send({
        from: accounts[0],
        gas: '1000000',
      })

    const request = await campaign.methods.requests(0).call()
    assert.equal('Buy Something', request.description)
  })

  it('processes request', async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei('4', 'ether'),
      from: accounts[0],
    })

    await campaign.methods
      .createRequest('Buy B.', web3.utils.toWei('2', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      })

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    })

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    })

    let bal = await web3.eth.getBalance(accounts[1])
    bal = parseFloat(web3.utils.fromWei(bal, 'ether'))

    assert(bal > 65)
  })
})
