import {
  Button,
  Flex,
  Image,
  Input,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
const { Title } = Typography;

interface DataType {
  key: string;
  image: string;
  name: string;
  type: string;
  status: boolean;
  createdAt: Date;
  creator: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Hình ảnh",
    dataIndex: "image",
    key: "image",
    render: (text) => <Image width={50} preview={false} src={text} />,
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Loại sự kiện",
    dataIndex: "type",
    key: "type",
    sorter: (a, b) => a.type.length - b.type.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (_, { status }) => (
      <Tag color={status ? "green" : "red"}>
        {status ? "Đang hoạt động" : "Đã kết thúc"}
      </Tag>
    ),
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_, { createdAt }) => createdAt.toLocaleDateString(),
    sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Người tạo",
    dataIndex: "creator",
    key: "creator",
  },
  {
    title: "Hành động",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button icon={<EditOutlined />} />
        <Button icon={<DeleteOutlined />} />
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026701f",
    name: "John Brown",
    type: "Event",
    status: true,
    createdAt: new Date("2022-05-10"),
    creator: "John Brown",
  },
  {
    key: "2",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026701f",
    name: "Jim Green",
    status: false,
    createdAt: new Date("2022-05-12"),
    creator: "Jim Green",
    type: "Workshop",
  },
  {
    key: "3",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026701f",
    name: "Joe Black",
    type: "Hackathon",
    status: true,
    createdAt: new Date("2022-05-14"),
    creator: "Joe Black",
  },
];
export default function EventPage() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <Title level={3}>Danh sách sự kiện</Title>
        <Button type="primary">Thêm sự kiện</Button>
      </Flex>
      <Flex gap={20} style={{ marginBottom: 20 }}>
        <Input
          size="middle"
          placeholder="Tìm kiếm"
          style={{ maxWidth: 200 }}
          prefix={<SearchOutlined />}
        />
        <Select
          showSearch
          placeholder="Lọc theo Trạng thái"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "active", label: "Đang hoạt động" },
            { value: "end", label: "Đã kết thúc" },
            { value: "all", label: "Tất cả" },
          ]}
        />
      </Flex>
      <Table<DataType> columns={columns} dataSource={data} />;
    </>
  );
}
