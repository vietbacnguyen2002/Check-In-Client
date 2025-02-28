import React, { useEffect, useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type {
  GetProp,
  InputRef,
  TableColumnsType,
  TableColumnType,
  TableProps,
} from "antd";
import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  QRCode,
  Space,
  Table,
  Form,
  Tag,
} from "antd";
import type {
  FilterDropdownProps,
  SorterResult,
  TablePaginationConfig,
} from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Customer, CustomerRequest } from "../types/customer";
import {
  deleteCustomerService,
  getCustomersService,
  updateCustomerService,
} from "../services/customer.service";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { update } from "../redux/statusSlice";

type DataIndex = keyof Customer;
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const DataTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const [customerId, setCustomerId] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [form] = Form.useForm();
  const showModal = () => {
    setOpen(true);
  };

  const [customerUpdate, setCustomerUpdate] = useState<CustomerRequest>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    position: "",
  });
  const status = useAppSelector((state) => state.status.value);
  const dispatch = useAppDispatch();

  const confirm = async () => {
    try {
      const response = await deleteCustomerService(customerId);
      if (response.message !== "success") {
        messageApi.open({ content: response.message, type: "error" });
        return;
      }
      await getCustomers();
      messageApi.open({ content: "Xóa thành công", type: "success" });
    } catch (error) {
      messageApi.open({ content: "Xóa thất bại", type: "error" });
    }
  };

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomersService();
      const data: Customer[] = response.data;

      setCustomers(() => [...data]);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: 20,
        },
      });
    } catch (error) {
      return {
        message: error,
        data: "",
      };
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    if (status) {
      getCustomers();
    }
    dispatch(update(false));
  }, [status]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const { name, email, phone, position } = customerUpdate;
      if (!name || !email || !phone || !position) {
        messageApi.open({
          content: "Vui lòng nhập tất cả các trường",
          type: "error",
        });
        return;
      }
      const response = await updateCustomerService(customerUpdate);
      if (response.message === "success") {
        messageApi.open({ content: "Cập nhật thành công", type: "success" });
        dispatch(update(true));
      }
      form.resetFields();
      setCustomerUpdate({
        id: 0,
        name: "",
        email: "",
        phone: "",
        position: "",
      });
      setOpen(false);
    } catch (error) {
      messageApi.open({ content: "Cập nhật không thành công", type: "error" });
    }
  };

  const handleChange = (name: string, value: string) => {
    setCustomerUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Customer> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<Customer> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("id"),
    },

    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: "20%",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("email"),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position.length - b.position.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("position"),
    },
    {
      title: "QR",
      render: (_text, record) => {
        return (
          <div>
            <QRCode value={"CHECKIN-" + record.id} size={80} />
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Số lần checked in",
      dataIndex: "numberCheckedIn",
      key: "numberCheckedIn",
      sorter: (a, b) => a.numberCheckedIn - b.numberCheckedIn,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Thời gian checked in",
      dataIndex: "timeCheckedIn",
      key: "timeCheckedIn",
      // sorter: (a, b) => a.timeCheckedIn.length - b.timeCheckedIn.length,
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "isCheckedIn",
      key: "isCheckedIn",
      render: (_text, record) => (
        <Tag color={record.isCheckedIn ? "green" : "red"}>
          {record.isCheckedIn
            ? "Đã check in".toUpperCase()
            : "Chưa check in".toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Chỉnh sửa",
      key: "id",
      dataIndex: "id",
      render: (_text, record) => (
        <Space direction="horizontal" size="middle">
          <Button
            type="primary"
            onClick={() => {
              showModal();
              setCustomerUpdate(record);
              form.setFieldsValue(record);
            }}
            color="geekblue"
            icon={<EditOutlined />}
          ></Button>

          {/* Delete button */}
          <Popconfirm
            title={`Bạn có muốn xóa khách  hàng này không?`}
            // description="Open Popconfirm with Promise"
            onConfirm={confirm}
            onOpenChange={() => setCustomerId(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table<Customer>
        loading={loading}
        columns={columns}
        dataSource={[...(customers ?? [])]}
        rowKey={(record) => record.id}
        size="middle"
        style={{ width: "100vw" }}
        pagination={{
          position: ["bottomCenter"],
          defaultCurrent:1,
          total: customers?.length ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />
      <Modal
        title="Title"
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
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input onChange={(e) => handleChange("name", e.target.value)} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
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
            <Input onChange={(e) => handleChange("phone", e.target.value)} />
          </Form.Item>
          <Form.Item
            name={"position"}
            label="Vị trí"
            rules={[{ required: true }]}
          >
            <Input onChange={(e) => handleChange("position", e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;
