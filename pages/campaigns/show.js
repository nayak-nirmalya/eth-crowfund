import React, { Component } from 'react'
import { Button, Card, Grid } from 'semantic-ui-react'
import ContributForm from '../../components/ContributeForm'
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'
import { Link } from '../../routes'

class CampaignShow extends Component {
  static async getInitialProps(porps) {
    const campaign = Campaign(porps.query.address)

    const summury = await campaign.methods.getSummury().call()

    return {
      minimumContribution: summury[0],
      balance: summury[1],
      requestCount: summury[2],
      approversCount: summury[3],
      manager: summury[4],
      address: porps.query.address,
    }
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestCount,
      approversCount,
      manager,
    } = this.props

    const items = [
      // {
      //   header: manager,
      //   meta: 'Address of Manager',
      //   description:
      //     'Manager created this campaign and can create request to withdraw money.',
      //   style: { overflowWrap: 'break-word' },
      // },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'One must contribute at least this amount of wei, to become approver.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: requestCount,
        meta: 'Number of Request',
        description:
          'A request tries to withdraw money from contract. Request must be approved by approvers.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have donated to this campaign.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'Amount of Money this campaign has to spend.',
        style: { overflowWrap: 'break-word' },
      },
    ]

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Contract Address - {this.props.address}
          </div>
        </h3>
        <Grid>
          {/* Manager Row */}
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Header>
                  <div className="center aligned" style={{ marginTop: 5 }}>
                    <strong>{this.props.manager}</strong>
                  </div>
                </Card.Header>
                <Card.Meta>
                  <div className="center aligned" style={{ marginTop: 5 }}>
                    Address of Manager
                  </div>
                </Card.Meta>
                <Card.Description>
                  <div
                    className="center aligned"
                    style={{ marginTop: 5, marginBottom: 5 }}
                  >
                    Manager created this campaign and can create request to
                    withdraw money.
                  </div>
                </Card.Description>
              </Card>
            </Grid.Column>
          </Grid.Row>

          {/* Summary Row */}
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributForm address={this.props.address} />
              <Grid.Row>
                <Grid.Column>
                  <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                      <div style={{ marginTop: 15 }}>
                        <Button primary>View Requests</Button>
                      </div>
                    </a>
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>

          {/* Request Button Row */}
          {/* <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row> */}
        </Grid>
      </Layout>
    )
  }
}

export default CampaignShow
