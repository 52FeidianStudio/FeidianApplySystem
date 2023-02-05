export interface LoginInfoType  {
    username:string,
    password:string,

}
export interface RegisterInfoType  {
    username:string,
    email:string,
    password:string
}
export interface NewPasswordType  {
    username:string,
    password:string,
    code:string,
}
export interface UserInfotype {
    username?:string,
    studentID?:string,
    grade?:string,
    faculty?:string
    class_?:string,
    name?:string,
    sex?:string,
    nationality?:string,
    phone?:string,
    email?:string,
    department?:string,
    reason?:string,
    selfIntroduction?:string,
    status?:string,
    imgURL?:string,
    selectState?:boolean
}
export interface TabsType{
    key:string,
    label:string
}
