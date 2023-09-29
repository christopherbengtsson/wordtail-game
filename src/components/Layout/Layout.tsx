import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout as AntdLayout, Menu, MenuProps } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores/MainStoreContext';

const { Header, Content } = AntdLayout;

export function Layout() {
  const store = useMainStore();
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
        label: <Link to={`/profiles/:${store.userId}`}>Profile</Link>,
        key: 'profiles',
        icon: <UserOutlined />,
      },
    ],
    [store.userId],
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
