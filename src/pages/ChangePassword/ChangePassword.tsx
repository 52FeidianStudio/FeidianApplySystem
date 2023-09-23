import React, { useCallback, useState } from 'react';
import './ChangePassword.less'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, PaperClipOutlined, SmileOutlined, FrownOutlined, BulbOutlined } from '@ant-design/icons';
import { Input, Button, notification, Space, message } from 'antd';
import LogoUrl from "../../assets/logo.png";
import type { NewPasswordType } from "../../types/common";
import apis from "../../network/apis";
import { useNavigate } from "react-router-dom";
const Login: React.FC = function () {
    const NewPassword: NewPasswordType = {
        password: '',
        code: '',
        email: '',
    }
    const [form, setForm] = useState(NewPassword)
    const handleChange = async (e: any) => {
        await setForm({ ...form, [e.target.name]: e.target.value });
    }
    //修改密码部分函数
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const ChangePasswordMethod = async () => {
        let res = await apis.ChangePassword(form);
        notification.open({
            message: res.data.message,
            description: "密码修改成功，可以登录了！",
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        navigate("/login");

    };
    let [buttonState, setButtomState] = useState(false)
    const GetCode = async () => {
        let res = await apis.SendCode({ email: form.email });
        messageApi.info('验证码已发送，请查看邮箱邮件,60s内只能发送一次');
        setButtomState(true);
        setTimeout(() => {
            setButtomState(false);
        }, 60000)

    };
    const toLogin = () => {
        navigate("/login")
    }
    return (
        <div className="change-content flex-center margin-center">
            {contextHolder}
            <div className="login-box">
                <img className="logo" src={LogoUrl} />
                <div className="input-content">
                    {/* 写一个邮箱的输入框 */}
                    <Input style={{ marginBottom: "20px" }}
                        size="large" placeholder="邮箱"
                        prefix={<UserOutlined />} name="email"
                        value={form.email}
                        onChange={handleChange}
                        maxLength={20}
                    />
                    <Space direction="horizontal">
                        <div style={{ width: "110%", display: "flex" }}>
                            <Input
                                placeholder="验证码"
                                size="large"
                                prefix={<BulbOutlined />}
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                maxLength={6}
                                style={{ width:"63%" }}
                            />
                            <Button disabled={buttonState} onClick={GetCode} className="getCode-button" size="large" > 发送验证码</Button>
                        </div>

                    </Space>
                    <Input.Password
                        style={{ marginTop: "20px" }}
                        size="large"
                        prefix={<PaperClipOutlined />}
                        placeholder="新密码"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        name="password" value={form.password} onChange={handleChange}
                        maxLength={250}
                    />
                </div>
                <Button onClick={ChangePasswordMethod} className="change-button" type="primary" size="large">修改</Button>
                <div style={{width:"100%"}} className='to-login'><div onClick={toLogin} className="tips">点此登录</div></div>
            </div>
        </div>
    );
}
export default React.memo(Login);
