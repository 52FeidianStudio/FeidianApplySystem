import './Register.less'
import {Button, Input, notification,message} from "antd";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    PaperClipOutlined,
    UserOutlined,
    MailOutlined,
    SmileOutlined, FrownOutlined
} from "@ant-design/icons";
import React,{useState} from "react";
import LogoUrl from "../../assets/logo.png"
import apis from "../../network/api";
import {useNavigate} from "react-router-dom";
const Register:React.FC = function () {
    const RegisterInfo = {
        username:'',
        password:'',
        email:''
    }
    const [form,setForm] = useState(RegisterInfo);
    const handleChange = async (e:any)=> {
        await setForm({...form,[e.target.name]:e.target.value});
    }
    //用户注册函数
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const RegisterMethod = async ()=>{
        let res = await apis.Register(form);
        notification.open({
            message: res.data.message,
            description:
                'Please check your username or password',
            icon: res.data.code == "200" ? <SmileOutlined style={{ color: '#108ee9' }} /> : <FrownOutlined style={{color:"red"}} />,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
        if (res.data.code == "200")
        {
            messageApi.info('注册成功，请登录');
            setTimeout(()=>{
                navigate("/login")
            },1000)
        }
    }
    const toLogin = ()=>{
        navigate("/login")
    }
    return (
        <div className="register-content flex-center margin-center">
            {contextHolder}
            <div className="register-box">
                <img className="logo" src={LogoUrl}/>
                <div className="input-content">
                    <Input size="large" placeholder="Username" prefix={<UserOutlined />} name="username" value={form.username} onChange={handleChange}/>
                    <Input style={{marginTop:"20px"}} size="large" placeholder="Email" prefix={<MailOutlined />} name="email" value={form.email} onChange={handleChange}/>
                    <Input.Password
                        style={{marginTop:"20px"}}
                        size="large"
                        prefix={<PaperClipOutlined />}
                        placeholder="Password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        name="password" value={form.password} onChange={handleChange}
                    />
                </div>
                <Button onClick={RegisterMethod} style={{margin:"20px 50px 20px 50px",width:'calc(100% - 100px)'}} type="primary" size="large">Register</Button>
                <div onClick={toLogin} className="tips">已有账号点此登录</div>
            </div>
        </div>
    );
}
export default Register;
