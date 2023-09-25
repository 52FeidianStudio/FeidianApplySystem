import React, { useState, useCallback } from 'react';
import './Login.less'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, PaperClipOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';
import {Input, Button, notification, message} from 'antd';
import LogoUrl from "../../assets/logo.png"
import type { LoginInfoType } from "../../types/common";
import apis from "../../network/apis";
import { useNavigate } from "react-router-dom";
const Login: React.FC = function () {
    const LoginInfo: LoginInfoType = {
        username: "",
        password: ""
    }
    const [form, setForm] = useState(LoginInfo)
    const handleChange = async (e: any) => {
        await setForm({ ...form, [e.target.name]: e.target.value });
    }
    //登录部分函数
    const navigate = useNavigate();
    const LoginMethod = async () => {
        // let res = await apis.Login(form);
        //  message.info("登录成功");
        //     localStorage.setItem('token', res.data.data.token);
        //     if (res.data.data.role == "user") {
        //         let userInfo;
        //         apis.GetSingleApplyinfo().then((res) => {
        //             userInfo = res.data.data;
        //             //表单提交会有所有信息，所以判断department即可知道用户是否填过表单
        //             if (userInfo.department) {
        //                 localStorage.setItem('state', userInfo.status);
        //                 navigate("/pass_result");
        //             }
        //             else {
        //                 navigate("/apply");
        //             }
        //         });
        //     }
        //     else {
        //         navigate("/admin_home")
        //     }
        // }
        try {
          if(localStorage.getItem('token')){
            localStorage.removeItem('token')
          }
          console.log(form);
          let res = await apis.Login(form);
          console.log(res.data.data)
          message.info("登录成功");
          localStorage.setItem('token', res.data.data.token);
          if (res.data.data.roleId > 3 ) {
            let {data:userInfo} = await apis.GetSingleApplyinfo(); // 使用 await 等待异步请求
            console.log(userInfo);
            if (userInfo.data.status != null){
              localStorage.setItem('state', userInfo.data.status);
              navigate("/pass_result");
            } else {
              navigate("/apply");
            }
          } else {
            navigate("/admin_home");
          }
        } catch (error) {
          console.log(error);
        }
    }

    //页面跳转函数
    const toRegister = () => {
        navigate("/register")
    }
    const toChangePassword = () => {
        navigate("/forget")
    }
    const toOwe = () => {
        //跳转网页
        window.open("http://182.254.242.96/")
    }
    return (
        <div className="login-content flex-center margin-center">
            <div className="login-box">
                <img className="logo" src={LogoUrl} />
                <div className="input-content">
                    <Input maxLength={30} size="large" placeholder="用户名" prefix={<UserOutlined />} name="username" value={form.username} onChange={handleChange} />
                    <Input.Password
                        style={{ marginTop: "20px" }}
                        size="large"
                        prefix={<PaperClipOutlined />}
                        placeholder="密码"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        name="password" value={form.password} onChange={handleChange}
                        maxLength={250}
                    />
                </div>
                <Button onClick={LoginMethod} className="login-button" type="primary" size="large">登录</Button>
                <div className="tips">
                    <div onClick={toRegister} className="tips-register" style={{cursor:'pointer'}}>点此注册</div>
                    <div onClick={toOwe} className='tips-register' style={{cursor:'pointer'}}>进入官网</div>
                    <div onClick={toChangePassword} className="tips-forget" style={{cursor:'pointer'}}>忘记密码</div>
                </div>
            </div>
        </div>
    );
}
export default React.memo(Login);
