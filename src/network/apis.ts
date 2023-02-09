import request from "./request";
import type {LoginInfoType,RegisterInfoType,UserInfotype,NewPasswordType} from "../types/common";

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
    //获取用户个人信息
    GetSingleApplyinfo(){
        return request({
            url:"/user",
            method:"GET"
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
    },
    GetMailTemplate(){
        return request({
            url:"/mail/templates",
            method:"GET"
        })
    }
};
export default apis;
