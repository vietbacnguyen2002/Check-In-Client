import React, { useState } from "react";
import {
  BarChartOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar, Flex } from "antd";
import Logo from "../assets/logo.png";
import { Outlet, useNavigate } from "react-router";
const { Header, Sider } = Layout;

const RootLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* <div className="demo-logo-vertical"> */}
        <Flex align="center" justify="center">
          <Avatar
            size={40}
            src={Logo}
            style={{
              backgroundColor: "#fff",
              margin: "10px 16px",
            }}
          />
        </Flex>
        {/* </div> */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => {
                navigate("/dashboard");
              },
            },
            {
              key: "2",
              icon: <BarChartOutlined />,
              label: "Report",
              onClick: () => {
                navigate("/report");
              },
            },
            {
              key: "3",
              icon: <DatabaseOutlined />,
              label: "Data",
              onClick: () => {
                navigate("/data");
              },
            },
          ]}
        />
      </Sider>

      <Layout className="w-full">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Flex justify="space-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Avatar
              size={40}
              src={"https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk"}
              style={{ backgroundColor: "#001529", margin: "10px 16px" }}
            />
          </Flex>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default RootLayout;
