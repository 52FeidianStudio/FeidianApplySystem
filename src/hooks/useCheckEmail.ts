export function useCheckEmail(value:string){
    const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    if(value === ""){ //输入不能为空
        console.log("输入为空")
        return false;
    }else if(!reg.test(value)){ //正则验证不通过，格式不对
        console.log("验证不通过!");
        return false;
    }else{
        console.log("通过！");
        return true;
    }
}
