import request from "./request";
import type {LoginInfoType,RegisterInfoType} from "../type/common";

const apis = {
    //用户登录接口
    Login(data:LoginInfoType){
        return request({
            url: '/login',
            method:'POST',
            data:data
        })
    },
    Register(data:RegisterInfoType){
        return request({
            url:'/register',
            method:'POST',
            data:data
        })
    },
    SendApplication(data:any)
    {
        return request({
            url:"/user",
            method:"POST"
        })
    }
};
export default apis;
