//@ts-nocheck
import React, { useEffect } from 'react';
import { Button, message, Result } from 'antd';
import "./PassResult.less"
import { useNavigate } from "react-router-dom";
import apis from '../../network/apis';
import funnyImgUrl from "../../assets/funny.gif"
const PassResult: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            message.error("请先登录")
            navigate('/')
        }
        apis.GetSingleApplyinfo().then((res) => {
            localStorage.setItem("state", res.data.data.status)
        })
    }, [])
    let state: string = localStorage.getItem('state');
    let status, messageInfo;
    if (state == "2") {
        status = "success";
        messageInfo = "恭喜你成功通过面试，很高兴你能成为我们之中的一员";
    }
    else if (state == "3") {
        status = "error";
        messageInfo = "很遗憾你未能通过面试，感谢你选择沸点工作室";
    }
    else {
        status = 'info';
        messageInfo = "结果还未出炉噢，请耐心等待"
    }
    const logout = () => {
        localStorage.setItem("token", '');
        navigate("/")
    }
    return (
        <div style={{ width: '100%', height: '100vh' }} className='flex-center'>
            <div className="pass-result-content margin-center">
                <Result
                    status={status}
                    title={messageInfo}
                    extra={[
                        <div className="funny-img-content flex-center">
                            <img src={state=="pass" ? funnyImgUrl: undefined}/>
                        </div>,

                        <Button onClick={logout} type="primary" key="logout">
                            退出登录
                        </Button>,
                        <Button onClick={() => { navigate("/apply") }
                        } key="change" disabled={state == "0" ? false : true}>修改申请</Button>,
                        <Button onClick={() => { window.open("http://182.254.242.96/") }} type='primary'>进入官网</Button>
                    ]}
                />
            </div>
        </div>
    );
}
export default React.memo(PassResult);
