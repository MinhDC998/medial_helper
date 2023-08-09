import React, { useEffect } from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Dropdown, Button, Space } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import { getUser, logout } from '@utils/user';
import { COMMON } from '@constants/common';
import routersEndpoint from '@routers/routersEndpoint';
import * as cookie from '@services/cookies';

import './styles.scss';
import '@public/css/core.scss';

const { Header, Content, Sider } = Layout;

export default function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate(routersEndpoint.login);
    }
  }, []);

  const menuItems: MenuProps['items'] = [HomeOutlined].map((icon) => ({
    key: routersEndpoint.home,
    icon: React.createElement(icon),
    label: 'Trang chủ',
    onClick: () => {
      navigate(routersEndpoint.home);
    },
  }));

  const handleMenuClick: MenuProps['onClick'] = () => {
    cookie.default.remove(COMMON.COOKIE.TENANT);
    logout();
    navigate(routersEndpoint.login);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Đăng xuất',
      key: 'logOut',
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    user && (
      <Layout>
        <Header className="header">
          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                {user?.displayName}
                <UserOutlined rev="true" />
              </Space>
            </Button>
          </Dropdown>
        </Header>
        <Layout style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Sider
            width={70}
            style={{ background: colorBgContainer, padding: '24px 0' }}
            breakpoint="lg"
            collapsedWidth="0"
          >
            <Menu mode="inline" style={{ height: '100%', borderRight: 0 }} items={menuItems} />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 'calc(100vh - 60px)',
                background: colorBgContainer,
              }}
            >
              <div className="main_content">
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  );
}
