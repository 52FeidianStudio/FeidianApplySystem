import React, {useState} from 'react';
import './ChangePassword.less'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone ,PaperClipOutlined,SmileOutlined,FrownOutlined ,BulbOutlined} from '@ant-design/icons';
import { Input,Button,notification ,Space,message} from 'antd';
import LogoUrl from "../../assets/logo.png";
import type {NewPasswordType} from "../../type/common";
import apis from "../../network/apis";
import { useNavigate } from "react-router-dom";
const Login:React.FC = function () {
    const NewPassword:NewPasswordType = {
        username:'',
        password:'',
        code:''
    }
    const [form, setForm] = useState(NewPassword)
    const handleChange = async (e:any)=> {
        await setForm({...form,[e.target.name]:e.target.value});
    }
    //修改密码部分函数
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const ChangePasswordMethod = async ()=>
    {
        let res = await apis.ChangePassword(form);
        notification.open({
            message: res.data.message,
            description:res.data.code == "200" ? "change successfully.Please login!.":'Please check your verify code',
            icon: res.data.code == "200" ? <SmileOutlined style={{ color: '#108ee9' }} /> : <FrownOutlined style={{color:"red"}} />,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
        if(res.data.code == "200")
        {
            localStorage.setItem('token',res.data.data.token);
            navigate("/apply");
        }
    }
    const GetCode = async ()=>{
        let res = await apis.SendCode(form.username);
        if (res.data.code == "200")
        {
            messageApi.info('验证码已发送，请查看邮箱邮件');
        }
    }
    const toLogin = ()=>{
        navigate("/login")
    }
    return (
        <div className="login-content flex-center margin-center">
            {contextHolder}
            <div className="login-box">
                <img className="logo" src={LogoUrl}/>
                <div className="input-content">
                    <Input style={{marginBottom:"20px"}}
                           size="large" placeholder="Username"
                           prefix={<UserOutlined />}  name="username"
                           value={form.username}
                           onChange={handleChange}
                           maxLength={20}
                    />
                    <Space direction="horizontal">
                        <Input
                            placeholder="Verify Code"
                            size="large"
                            style={{width:"248px"}}
                            prefix={<BulbOutlined />}
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            maxLength={6}
                        />
                        <Button onClick={GetCode} size="large" style={{ width: 120,color:"grey" }} > 发送验证码</Button>
                    </Space>
                    <Input.Password
                        style={{marginTop:"20px"}}
                        size="large"
                        prefix={<PaperClipOutlined />}
                        placeholder="New Password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined/> )}
                        name="password" value={form.password} onChange={handleChange}
                        maxLength={250}
                    />
                </div>
                <Button onClick={ChangePasswordMethod} style={{margin:"20px 50px 20px 50px",width:'calc(100% - 100px)'}} type="primary" size="large">Change</Button>
                <div onClick={toLogin} className="tips">点此登录</div>
            </div>
        </div>
    );
}
export default Login;
