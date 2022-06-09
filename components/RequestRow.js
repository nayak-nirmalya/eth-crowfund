import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'

class RequestRow extends Component {
  onApprove = async () => {
    const accounts = await web3.eth.getAccounts()
    const campaign = Campaign(this.props.address)
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    })
  }

  onFinalize = async () => {
    const accounts = await web3.eth.getAccounts()
    const campaign = Campaign(this.props.address)
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    })
  }

  render() {
    const { Row, Cell } = Table
    const id = this.props.id
    const approversCount = this.props.approversCount
    const {
      description,
      value,
      recipient,
      complete,
      approvalCount,
    } = this.props.request
    const readyToFinalize = approvalCount > approversCount / 2

    return (
      <Row disabled={complete} positive={readyToFinalize && !complete}>
        <Cell>{id + 1}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>
          {approvalCount}/{approversCount}
        </Cell>
        <Cell>
          <Button
            disabled={complete}
            color="green"
            basic
            onClick={this.onApprove}
          >
            Approve
          </Button>
        </Cell>
        <Cell>
          <Button
            disabled={complete}
            color="teal"
            basic
            onClick={this.onFinalize}
          >
            Finalize
          </Button>
        </Cell>
      </Row>
    )
  }
}

export default RequestRow
