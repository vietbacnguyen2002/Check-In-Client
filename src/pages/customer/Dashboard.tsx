import { Card, Col, Row, Statistic, theme } from "antd";
import { Content } from "antd/es/layout/layout";
// const { Title, Text } = Typography;
import { useEffect, useState } from "react";
import { getDashboardService } from "../../services/customer.service";
import DashboardResponse from "../../types/dashboard";
import { io } from "socket.io-client";
export default function Dashboard() {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const socketServer = import.meta.env.VITE_SOCKET_SERVER;
  const socket = io(socketServer);

  const [data, setData] = useState<DashboardResponse>({
    numberCustomer: 0,
    numberCheckedIn: 0,
    numberNotCheckedIn: 0,
  });
  const getDashboard = async () => {
    try {
      const response = await getDashboardService();
      if (response.message !== "success") {
        setData({
          numberCustomer: 0,
          numberCheckedIn: 0,
          numberNotCheckedIn: 0,
        });
      }
      setData(response.data);
    } catch (error) {
      setData({
        numberCustomer: 0,
        numberCheckedIn: 0,
        numberNotCheckedIn: 0,
      });
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      console.log(data);
      getDashboard();
      // setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);
  }, []);

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: "#F1F0E9",
        borderRadius: borderRadiusLG,
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Card
            variant="borderless"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            <Statistic
              value={!data ? 0 : data.numberCustomer}
              title={"Số lượng khách hàng".toUpperCase()}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8} style={{ textAlign: "center", fontWeight: "bold" }}>
          <Card variant="borderless">
            <Statistic
              title="KHÁCH HÀNG ĐÃ CHECK-IN"
              value={!data ? 0 : data.numberCheckedIn}
              valueStyle={{ color: "#3f8600", textAlign: "center" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            variant="borderless"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            <Statistic
              title="KHÁCH HÀNG CHƯA CHECK-IN"
              value={!data ? 0 : data.numberNotCheckedIn}
              valueStyle={{ color: "#cf1322", textAlign: "center" }}
              formatter={(value) => (
                <span style={{ color: "#cf1322" }}>{value}</span>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
}
