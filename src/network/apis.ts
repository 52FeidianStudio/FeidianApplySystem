import request from "./request";
import type {LoginInfoType,RegisterInfoType,UserInfotype,NewPasswordType} from "../type/common";

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
    SendApplication(data:UserInfotype)
    {
        return request({
            url:"/user",
            method:"POST",
            data:data
        })
    },
    SendCode(data:string){
        return request({
            url:`/verification/email?username=${data}`,
            method:"GET"
        })
    },
    ChangePassword(data:NewPasswordType){
        return request({
            url:`/verification/email`,
            method:"POST",
            data:data
        })
    },
    //用户管理相关接口
    GetAllApplyInfo(data:any){
        return request({
            url:"/admin/view",
            method:"POST",
            data:data
        })
    },
    GetAllGrade(){
        return request({
            url:"/admin/grade",
            method:"GET"
        })
    },
    SendEmail(data:any)
    {
        return request({
            url:"/admin/review",
            method:"POST",
            data:data
        })
    }
};
export default apis;
