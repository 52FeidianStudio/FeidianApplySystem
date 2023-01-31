import React, {useState,useCallback} from 'react';
import './Login.less'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone ,PaperClipOutlined,SmileOutlined,FrownOutlined } from '@ant-design/icons';
import { Input,Button,notification } from 'antd';
import LogoUrl from "../../assets/logo.png";
import type {LoginInfoType} from "../../type/common";
import apis from "../../network/api";
import { useNavigate } from "react-router-dom";
const Login:React.FC = function () {
    const LoginInfo:LoginInfoType = {
        username:'',
        password:''
    }
    const [form, setForm] = useState(LoginInfo)
    const handleChange = async (e:any)=> {
        await setForm({...form,[e.target.name]:e.target.value});
    }
    //登录部分函数
    const navigate = useNavigate();
    const LoginMethod = async ()=>
    {
        let res = await apis.Login(form);
        notification.open({
            message: res.data.message,
            description:
                'Please check your username or password',
            icon: res.data.code == "200" ? <SmileOutlined style={{ color: '#108ee9' }} /> : <FrownOutlined style={{color:"red"}} />,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
        if(res.data.code == "200")
        {
            navigate("/apply");
        }
    }
    const toRegister = ()=>{
        navigate("/register")
    }
    return (
       <div className="login-content flex-center margin-center">
           <div className="login-box">
               <img className="logo" src={LogoUrl}/>
               <div className="input-content">
                   <Input size="large" placeholder="Username" prefix={<UserOutlined />}  name="username" value={form.username} onChange={handleChange}/>
                   <Input.Password
                       style={{marginTop:"20px"}}
                       size="large"
                       prefix={<PaperClipOutlined />}
                       placeholder="Password"
                       iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined/> )}
                       name="password" value={form.password} onChange={handleChange}
                   />
               </div>
               <Button onClick={LoginMethod} style={{margin:"20px 50px 20px 50px",width:'calc(100% - 100px)'}} type="primary" size="large">Login</Button>
               <div onClick={toRegister} className="tips">点此注册</div>
           </div>
       </div>
    );
}
export default Login;
