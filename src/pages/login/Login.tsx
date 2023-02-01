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
            description:res.data.code == "200" ? "please fill the applytable.":'Please check your username or password',
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
    //页面跳转函数
    const toRegister = ()=>{
        navigate("/register")
    }
    const toChangePassword = ()=>{
        navigate("/forget")
    }
    return (
       <div className="login-content flex-center margin-center">
           <div className="login-box">
               <img className="logo" src={LogoUrl}/>
               <div className="input-content">
                   <Input maxLength={30} size="large" placeholder="Username" prefix={<UserOutlined />}  name="username" value={form.username} onChange={handleChange}/>
                   <Input.Password
                       style={{marginTop:"20px"}}
                       size="large"
                       prefix={<PaperClipOutlined />}
                       placeholder="Password"
                       iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined/> )}
                       name="password" value={form.password} onChange={handleChange}
                       maxLength={250}
                   />
               </div>
               <Button onClick={LoginMethod} style={{margin:"20px 50px 20px 50px",width:'calc(100% - 100px)'}} type="primary" size="large">Login</Button>
               <div className="tips">
                   <div onClick={toRegister} className="tips-register">点此注册</div>
                   <div onClick={toChangePassword} className="tips-forget">忘记密码</div>
               </div>
           </div>
       </div>
    );
}
export default Login;
