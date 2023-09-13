export interface LoginInfoType  {
    username:string,
    password:string,

}
export interface RegisterInfoType  {
    username:string,
    email:string,
    password:string,
    name:string,
    sex:string,
    studentId:string,
    className:string,
    subject:string,
    nationality:string,
    phone:string,
    qq:string,
    gradeName:string,
    birthday:any
}
export interface NewPasswordType  {
    username:string,
    password:string,
    code:string,
    email:string
}
export interface UserInfotype {
    loading?: boolean;
    selected?: boolean;
    username?:string,
    studentId?:string,
    grade?:string,
    faculty?:string
    className?:string,
    name?:string,
    sex?:string,
    nationality?:string,
    phone?:string,
    email?:string,
    department?:string,
    reason?:string,
    resume?:string,
    status?:string,
    imgUrl?:string,
    selectState?:boolean
    desireDepartmentId?:number,
    arrangement?:string,
    direction?:string
    registerId?:string,
}
export interface TabsType{
    key:string,
    label:string
}

export interface UserApplyType{
  key:string,
  label:string
}

export interface InfoEmail{
  registerId:number,
  isApprovedFlag:string,
  emailContent:string,
}