import { useEffect, useState } from "react";
import { Button, notification, Table, message, Popconfirm, TableProps } from "antd";
import { PlusOutlined, } from '@ant-design/icons';
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";



export interface IUsers {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  address: string;
  role: string;
}

const UsersTable = () => {

  const [listUser, setListUser] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState<null | IUsers>(null);

  const [meta, setMeta] = useState({
    current: 1, // trang duoc render hien tai
    pageSize: 5, // lay bao nhieu bang ghi 1 lan
    pages: 0, //tong so trang
    total: 0, // tong so bang ghi
  })

  // console.log("check meta current : ", meta.current)


  const access_token = localStorage.getItem("access_token") as string

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res1 = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const d = await res1.json();
    if (!d.data) {
      notification.error({
        message: `${d.message}`
      })
    }
    setListUser(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.page,
      total: d.data.meta.total,
    })
  };


  const columns: TableProps<IUsers>["columns"] = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      render: (text, record, index) => {

        const confirm = async (dataDeleteUser: IUsers) => {
          // console.log("check dataDelete: ", dataDelete)
          const res = await fetch(`http://localhost:8000/api/v1/users/${dataDeleteUser._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          })
          const d = await res.json()
          // console.log("check d : ", d)
          if (d.data) {
            //success
            await fetchData()
            notification.success({
              message: `${d.message}`,
            })
            await fetchData()
          } else {
            //error
            notification.error({
              message: `${d.message}`,
            })
          }
        };

        return (
          <>
            <Button
              onClick={() => {
                // console.log("record: ", record)
                setIsUpdateModalOpen(true)
                setUpdateData(record)

              }}>
              Update
            </Button >
            <Popconfirm
              placement="topLeft"
              title="Delete the user"
              description={`Are you sure to delete this user with name ${record.name} ?`}
              onConfirm={() => confirm(record)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                style={{ marginLeft: "1rem" }}
              >

                Delete
              </Button>
            </Popconfirm>
          </>
        )
      }
    },
  ];

  const handleOnchange = async (page: number, pageSize: number) => {
    // console.log("check page", page);
    // console.log("check pageSize", pageSize);
    const res1 = await fetch(`http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const d = await res1.json();
    if (!d.data) {
      notification.error({
        message: `${d.message}`
      })
    }
    setListUser(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.page,
      total: d.data.meta.total,
    })
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Table Users</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}>
          Add new
        </Button>

      </div>
      <Table
        dataSource={listUser}
        columns={columns}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total) => `Total ${total} items`,
          onChange: (page: number, pageSize: number) => handleOnchange(page, pageSize),
          showSizeChanger: true
        }}
      />
      <CreateUserModal
        access_token={access_token}
        fetchData={fetchData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UpdateUserModal
        access_token={access_token}
        fetchData={fetchData}

        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}

        updateData={updateData}
        setUpdateData={setUpdateData}
      />
    </div>
  )

};

export default UsersTable;
