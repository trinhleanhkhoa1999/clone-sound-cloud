import { Input, Modal, notification } from "antd"
import { useEffect, useState } from "react"
import { IUsers } from "./users.table";
import App from './../../App';

interface IProps {
    access_token: string;
    fetchData: any;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    updateData: null | IUsers;
    setUpdateData: any;
}

const UpdateUserModal = (props: IProps) => {
    const { access_token, isUpdateModalOpen, setIsUpdateModalOpen, updateData, setUpdateData, fetchData } = props

    // console.log("check updateData :", updateData)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [address, setAddress] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        if (updateData) {

            setName(updateData.name);
            setEmail(updateData.email);
            setPassword(updateData.password);
            setAge(updateData.age);
            setGender(updateData.gender);
            setAddress(updateData.address);
            setRole(updateData.role)
        }
    }, [updateData])




    const handleOk = async () => {
        if (updateData) {
            const data = {
                _id: updateData?._id
                , name, email, age, gender, address, role
            }
            console.log("check data form : ", data)

            const res = await fetch("http://localhost:8000/api/v1/users", {
                method: "PATCH",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ ...data }),
            });
            const d = await res.json()
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
        }
    };

    const handleCloseModalCreateUser = () => {
        setIsUpdateModalOpen(false);
        setUpdateData(null);

        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("USER")
    }
    return (
        <Modal
            title="Update new user"
            maskClosable={false}
            open={isUpdateModalOpen}
            onOk={handleOk}
            onCancel={() => handleCloseModalCreateUser()}>
            {/* <div>
                <label>ID</label>
                <Input placeholder="Name"
                    value={_id}
                    onChange={(e) => set_Id(e.target.value)} />
            </div> */}
            <div>
                <label>Name</label>
                <Input placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <Input placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Password</label>
                <Input placeholder="Password"
                    disabled={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Age</label>
                <Input placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
                <label>Gender</label>
                <Input placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)} />
            </div>
            <div>
                <label>Address</label>
                <Input placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
                <label>Role</label>
                <Input placeholder="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)} />
            </div>
        </Modal>
    )
}
export default UpdateUserModal