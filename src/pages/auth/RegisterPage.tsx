import { Avatar, Button, Form, Grid, Input, theme, Typography } from "antd";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Link } = Typography;

export default function RegisterPage() {
  const { token } = useToken();

  const screens = useBreakpoint();
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      textAlign: "center",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Avatar src={logo} alt="logo" size={100} />
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            rules={[
              {
                type: "string",
                required: true,
                message: "Vui lòng nhập nhập họ và tên!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Vui lòng nhập nhập email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                type: "string",
                required: true,
                message: "Vui lòng nhập nhập mật khẩu!",
              },
            ]}
          >
            <Input prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nhập lại mật khẩu!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              style={{ fontWeight: "bold" }}
            >
              ĐĂNG KÝ
            </Button>
            <div style={styles?.footer as object}>
              <Text style={styles.text}>Bạn chưa có tài khoản </Text>{" "}
              <Link onClick={() => navigate("/login")}>Đăng nhập</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
