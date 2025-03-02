import React, { useState } from "react";
import {
  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar, Flex } from "antd";
import Logo from "../assets/logo.png";
import { Outlet, useNavigate } from "react-router";
import { Content } from "antd/es/layout/layout";
const { Header, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
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
              icon: <CalendarOutlined />,
              label: "Sự kiện",
              onClick: () => {
                navigate("/dashboard");
              },
            },
            {
              key: "2",
              icon: <UserSwitchOutlined />,
              label: "Quản lý người dùng",
              onClick: () => {
                navigate("/report");
              },
            },
            {
              key: "3",
              icon: <SettingOutlined />,
              label: "Cấu hình hệ thống",
              onClick: () => {
                navigate("/data");
              },
            },
          ]}
        />
      </Sider>

      <Layout className="w-full">
        {/* <Header style={{ padding: 0, background: colorBgContainer }}>
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
        </Header> */}
        <Content
          style={{
            margin: "12px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
