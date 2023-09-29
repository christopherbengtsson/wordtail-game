import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout as AntdLayout, Menu, MenuProps } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';

const { Header, Content } = AntdLayout;

export function Layout() {
  // TODO: Should maybe not use mainstore hook?
  const { authStore } = useMainStore();
  const { pathname } = useLocation();

  const [current, setCurrent] = useState(
    pathname.includes('home') ? '' : pathname.replace('/', ''),
  );

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      {
        label: <Link to="/">Home</Link>,
        key: 'home',
        icon: <HomeOutlined />,
      },
      {
        label: <Link to={`/profiles/:${authStore.userId}`}>Profile</Link>,
        key: 'profiles',
        icon: <UserOutlined />,
      },
    ],
    [authStore.userId],
  );

  const handleNavigation = ({ key }: { key: string }) => {
    setCurrent(key);
  };

  return (
    <AntdLayout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          selectedKeys={[current]}
          items={menuItems}
          onClick={handleNavigation}
        />
      </Header>
      <StyledContent>
        <Outlet />
      </StyledContent>
    </AntdLayout>
  );
}

const StyledContent = styled(Content)`
  padding: 16px 24px;
`;
