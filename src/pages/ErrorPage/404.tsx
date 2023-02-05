import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const App: React.FC = () =>{
     const navigate = useNavigate();
     return (
      <div className='flex-center' style={{width:"100%",height:"100vh"}}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary" onClick={()=>{
                 navigate("/");
          }}>Back Home</Button>}
        />
        </div>
      );
      
} 

export default App;