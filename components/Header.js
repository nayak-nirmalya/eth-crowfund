// import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from '../routes'

const Header = () => {
  return (
    <Menu inverted style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">Ethereum DAO</a>
      </Link>

      <Menu.Menu position="right">
        {/* <Menu.Item>Campaign</Menu.Item>
        <Menu.Item>+</Menu.Item> */}
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  )
}

export default Header
