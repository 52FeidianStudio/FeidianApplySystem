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
            url:"/register/submitRegister",
            method:"POST",
            data:data
        })
    },
    SendCode(data:object){
        return request({
            url:`/forgetPassword`,
            method:"POST",
            data:data
        })
    },
    ChangePassword(data:NewPasswordType){
        return request({
            url:`/verifyProcess`,
            method:"POST",
            data:data
        })
    },
    //获取用户个人信息
    GetSingleApplyinfo(){
        return request({
            url:"/user/getMessage",
            method:"GET"
        })
    },
    //用户管理相关接口
    GetAllSelectInfo(data:any){
        return request({
            url:"/register/selectQueryCategory",
            method:"POST",
            data:data
        })
    },
    GetAllApplyInfo(data:any){
        return request({
            url:"/register/selectByQueryRegister",
            method:"POST",
            data:data
        })
    },
    GetOneApplyInfo(data:any){
        return request({
            url:"/register/viewRegister",
            method:"POST",
            data:data
        })
    },
    GetAllFaculty(){
        return request({
            url:"/faculty/getAllName",
            method:"GET"
        })
    },
    GetAllSubjectsByFaculty(data:any){
      return request({
        url:'/subject/getSubjectNameByFaculty',
        method:'GET',
        params:data
      })
    },
    SendEmail(data:any)
    {
        return request({
            url:"/sendEmail",
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
