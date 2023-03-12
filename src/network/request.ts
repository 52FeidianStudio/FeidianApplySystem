import axios from 'axios';
import {message} from 'antd';
export default function request(config:any) {
  const instance = axios.create({
    // baseURL: 'https://backend.ifeidian.cc',
      baseURL:'http://101.43.181.13:8888', //测试环境接口
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': localStorage.getItem('token')
    },
    method:config.method
  })
// http response 拦截器，统一处理异常请求
instance.interceptors.response.use(
  response => {
    if(response.data.code == "200")
    {
       return response;
    }
    else
    {
      if(response.data.message == "登录已过期"||response.data.message == "权限不足")
      {
          message.error(response.data.message+",请重新登录");
          localStorage.setItem("token","");
          location.reload();
      }
      else{
        message.error(response.data.message);
      }

      return Promise.reject(response.data.messsage);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

  return instance(config)
}
