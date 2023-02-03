import React from 'react';
import { Button, Result } from 'antd';
import "./Result.less"
import ercodeUrl from "../../assets/ercode.jpg"
import {useNavigate} from "react-router-dom";
const App: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="result-content margin-center">
            <Result
                status="success"
                title="你的报名申请我们已经收到!"
                subTitle="感谢你选择沸点工作室，具体面试时间请关注QQ招新群：950492051"
                extra={[
                    <div className="ercode-content flex-center">
                        <img src={ercodeUrl} alt="ercode"/>
                    </div>,

                    <Button type="primary" key="console">
                        <a href="http://ifeidian.cc">To Home</a>
                    </Button>,
                    <Button onClick={()=>{navigate("/apply")}
                    } key="buy">Change Again</Button>,
                ]}
            />
        </div>
    );
}
export default App;
