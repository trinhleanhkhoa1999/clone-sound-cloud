import { Form, Input, InputNumber, Modal, notification, Select } from "antd"

interface IProps {
    access_token: string;
    fetchData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void
}

const CreateUserModal = (props: IProps) => {
    const { access_token, isCreateModalOpen, setIsCreateModalOpen, fetchData } = props

    const [form] = Form.useForm();

    const handleCloseModalCreateUser = () => {
        setIsCreateModalOpen(false);
        form.resetFields()
    }

    const { Option } = Select;

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const { name, email, password, age, gender, address, role } = values
        const data = {
            name, email, password, age, gender, address, role
        }
        const res = await fetch("http://localhost:8000/api/v1/users", {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(data),
        });
        const d = await res.json()

        console.log("check res Add New User: ", d)
        if (d.data) {
            //success
            await fetchData()
            notification.success({
                message: `${d.message}`,
            })
            handleCloseModalCreateUser()
        } else {
            //error
            notification.error({
                message: "Có lỗi xảy ra !",
                description: `${d.message}`
            })
        }
    };

    return (
        <Modal
            title="Add new user"
            maskClosable={false}
            open={isCreateModalOpen}
            onOk={form.submit}
            onCancel={() => handleCloseModalCreateUser()}>
            <Form
                form={form}

                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>


                <Form.Item
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your age!' }]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please input your gender!' }]}
                >
                    <Select
                        placeholder="Select a option gender"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="MALE">MALE</Option>
                        <Option value="FEMALE">FEMALE</Option>
                        <Option value="OTHER">OTHER</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please input your role!' }]}
                >
                    <Select
                        placeholder="Select a option role"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="USER">USER</Option>
                        <Option value="ADMIN">ADMIN</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default CreateUserModal