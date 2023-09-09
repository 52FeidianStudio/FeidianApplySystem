import React, { useEffect } from 'react';
import { Button, Result, message } from 'antd';
import "./ApplyResult.less"
import ercodeUrl from "../../assets/ercode.jpg"
import { useNavigate } from "react-router-dom";
const ApplyResult: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            message.error("请先登录")
            navigate('/')
        }
    }, [])
    const logout = () => {
        localStorage.setItem("token", '');
        navigate("/")
    }
    return (
        <div style={{ width: '100%', height: '100vh' }} className='flex-center'>
            <div className="result-content">
                <Result
                    status="success"
                    title="你的报名申请我们已经收到!"
                    subTitle="感谢你选择沸点工作室，具体面试时间请关注QQ招新群：660578134"
                    extra={[
                        <div className="ercode-content flex-center">
                            <img src={ercodeUrl} alt="ercode" />
                        </div>,

                        <Button onClick={logout} type="primary" key="logout">
                            退出登录
                        </Button>,
                        <Button onClick={() => { navigate("/pass_result") }
                        } key="resu;t">结果查询</Button>,
                        <Button onClick={() => { navigate("/apply") }
                        } key="change">修改申请</Button>,
                    ]}
                />
            </div>
        </div>
    );
}
export default React.memo(ApplyResult);
