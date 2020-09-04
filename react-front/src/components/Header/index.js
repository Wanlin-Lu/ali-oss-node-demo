import React from 'react'
import { Layout } from 'antd'

import './style.less'

const Header = () => {
  return (
    <Layout.Header className="header">
      <div className="logo" />
      <h1>Ali-OSS</h1>
    </Layout.Header>
  )
}

export default Header