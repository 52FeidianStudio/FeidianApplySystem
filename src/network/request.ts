import axios from 'axios';
import {message} from 'antd';
export default function request(config:any) {
  const instance = axios.create({
    // baseURL: 'https://backend.ifeidian.cc',
      baseURL:'http://182.254.242.96:3333', //测试环境接口
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': localStorage.getItem('token'),
      'Authorization': localStorage.getItem('token')
    },
    // 把数据放在请求体中
    data: config.data,
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
      if(response.data.msg == "登录已过期"||response.data.msg == "无权限操作" || response.data.msg == "需要登录后操作")
      {
          alert(response.data.msg+",请重新登录");
          localStorage.setItem("token","");
          location.reload();
      }
      else{
        message.error(response.data.msg);
      }

      return Promise.reject(response.data.msg);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

  return instance(config)
}
