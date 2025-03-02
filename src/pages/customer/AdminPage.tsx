import {
  Form,
  Layout,
  Modal,
  theme,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import {
  DownloadOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, message } from "antd";
import DataTable from "../../components/DataTable";
import ExcelJS from "exceljs";
import {
  createCustomerService,
  exportCustomersService,
} from "../../services/customer.service";
import api from "../../constants/api";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { update } from "../../redux/statusSlice";
import { CustomerRequest } from "../../types/customer";
const { Content } = Layout;
const { Title } = Typography;

export default function AdminPage() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [customer, setCustomer] = useState<CustomerRequest>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  const successMessage = () => {
    messageApi.open({
      type: "success",
      content: "Thêm khách hàng thành công",
    });
  };
  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Thêm khách hàng thất bại",
    });
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (name: string, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await createCustomerService(customer);
      if (response.message === "success") {
        form.resetFields();
        successMessage();
        dispatch(update(true));
      }
    } catch (error) {
      errorMessage();
    }
  };
  // feature

  const props: UploadProps = {
    name: "file",
    action: `${api}/import`,
    onChange(info) {
      if (info.file.status === "uploading") {
        console.log("is loading");
      }
      if (info.file.status === "done") {
        messageApi.open({
          type: "success",
          content: "Import dữ liệu thành công",
        });
        dispatch(update(true));
      } else if (info.file.status === "error") {
        messageApi.open({
          type: "error",
          content: "Import dữ liệu thất bại",
        });
      }
    },
  };

  const toDataURL = async (url: string) => {
    const promise = new Promise((resolve, _reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () {
          resolve({ base64Url: reader.result });
        };
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
    return promise;
  };

  const handleExport = async () => {
    try {
      const response = await exportCustomersService();
      const data = response.data as any[];
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Customer check-in");
      sheet.properties.defaultRowHeight = 110;
      sheet.columns = [
        {
          header: "ID",
          key: "id",
          width: 10,
        },
        { header: "Họ và tên", key: "name", width: 20 },
        {
          header: "Email",
          key: "email",
          width: 20,
        },
        {
          header: "Số điện thoại",
          key: "phone",
          width: 20,
        },
        {
          header: "Vị trí",
          key: "position",
          width: 15,
        },
        {
          header: "QR Code",
          key: "qrCode",
          width: 20,
        },
        {
          header: "Trạng thái",
          key: "isCheckedIn",
          width: 20,
        },
        {
          header: "Số lần check-in",
          key: "numberCheckedIn",
          width: 20,
        },
        {
          header: "Thời gian check-in",
          key: "timeCheckedIn",
          width: 20,
        },
      ];

      await Promise.all(
        data?.map(async (product, index) => {
          const rowNumber = index + 1;
          sheet.addRow({
            id: product?.id,
            name: product?.name,
            phone: product?.phone,
            email: product?.email,
            position: product?.position,
            numberCheckedIn: product?.numberCheckedIn,
            timeCheckedIn: product?.timeCheckedIn,
            isCheckedIn: product?.isCheckedIn,
          }).height = 85;

          const result: any = await toDataURL(
            `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=CHECKIN-${product.id}`
          );
          const imageId2 = workbook.addImage({
            base64: result.base64Url,
            extension: "jpeg",
          });

          sheet.addImage(imageId2, {
            tl: { col: 5, row: rowNumber },
            ext: { width: 60, height: 60 },
          });

          sheet.getColumn(4).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        })
      );

      // promise.then(() => {
      //   workbook.xlsx.writeBuffer().then(function (data: any) {
      //     const blob = new Blob([data], {
      //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //     });
      //     const url = window.URL.createObjectURL(blob);
      //     const anchor = document.createElement("a");
      //     anchor.href = url;
      //     anchor.download = "data-export.xlsx";
      //     anchor.click();
      //     window.URL.revokeObjectURL(url);
      //     messageApi.open({
      //       type: "success",
      //       content: "Xuất báo cáo thành công",
      //     });
      //   });
      // });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "data-export.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);

      // ✅ Show success message **only after export completes**
      messageApi.open({
        type: "success",
        content: "Xuất báo cáo thành công",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Xuất báo cáo thất bại",
      });
    }
  };

  const validateMessages = {
    required: "${label} là yêu cầu!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {contextHolder}
      <Title style={{ textAlign: "center" }} level={3}>
        DANH SÁCH KHÁCH HÀNG
      </Title>
      <Flex justify="flex-end" gap={20} style={{ marginBottom: 20 }}>
       
        <Flex gap={6}>
          <Button
            type="primary"
            size="middle"
            icon={<PlusCircleOutlined />}
            onClick={handleOpen}
          >
            Thêm khách hàng
          </Button>
          <Modal
            title="THÊM KHÁCH HÀNG"
            open={open}
            onCancel={handleCancel}
            footer={[
              <Button key="back" danger onClick={handleCancel}>
                HỦY
              </Button>,
              <Button
                color="geekblue"
                key="submit"
                type="primary"
                onClick={handleSubmit}
              >
                XÁC NHẬN
              </Button>,
            ]}
          >
            <Form
              {...formItemLayout}
              validateMessages={validateMessages}
              form={form}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true }]}
              >
                <Input
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Email"
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true }]}
              >
                <Input
                  // value={customer.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name={"position"}
                label="Vị trí"
                rules={[{ required: true }]}
              >
                <Input
                  onChange={(e) => handleChange("position", e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>

          <Upload {...props} showUploadList={false}>
            <Button type="primary" size="middle" icon={<UploadOutlined />}>
              Import khách hàng
            </Button>
          </Upload>

          <Button
            type="primary"
            size="middle"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Xuất báo cáo
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              dispatch(update(true));
            }}
          ></Button>
        </Flex>
      </Flex>

      <DataTable />
    </Content>
  );
}
