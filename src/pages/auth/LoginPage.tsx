import {
  Avatar,
  Button,
  Form,
  Grid,
  Input,
  theme,
  Typography,
} from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Link } = Typography;
import logo from "../../assets/logo.png";
export default function LoginPage() {
  const { token } = useToken();
  const navigate = useNavigate();
  const screens = useBreakpoint();

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
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          

          <Avatar src={logo} alt="logo" size={100}  />
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
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              noStyle
            ></Form.Item>
            <a style={styles.forgotPassword as object}>Quên mật khẩu</a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              style={{
                fontWeight: "bold",
              }}
            >
              ĐĂNG NHẬP
            </Button>
            <div style={styles?.footer as object}>
              <Text style={styles.text}>Bạn có tài khoản chưa?</Text>{" "}
              <Link onClick={() => navigate("/register")}>Đăng ký</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
