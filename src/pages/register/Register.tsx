import './Register.less'
import { Button, Input, notification, message, Form, Select, DatePicker, Tooltip } from "antd";
import React, { useState } from "react";
import { useRequest } from 'ahooks';
import LogoUrl from "../../assets/logo.png"
import apis from "../../network/apis";
import { useNavigate } from "react-router-dom";
import { checkEmail } from "../../utils/CheckEmail"
import { RegisterInfoType } from '../../types/common';
import FormItem from 'antd/es/form/FormItem';
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Register: React.FC = function () {
  //用户注册函数
  const navigate = useNavigate();
  const [facultys,setFacultys]=useState([])
  const [subjects,setSubjects]=useState([])
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailValue, setEmailValue] = useState('');
  useRequest(apis.GetAllFaculty,{
    onSuccess:(res)=>{
      setFacultys(res.data.data)
    }
  })
  const [messageApi, contextHolder] = message.useMessage();
  const handleFacultyChange= async(value:string,option:any)=>{
    let res = await apis.GetAllSubjectsByFaculty({name:value})
    setSubjects(res.data.data)
  }
  const handleEmailChange=(e:any)=>{
    const newValue=e.target.value;
    setEmailValue(newValue)
  }
  const handleSendCode = async()=>{
    if(isSending || countdown>0 || emailValue==''){
      return;
    }
    setIsSending(true)
    setCountdown(60)
    try{
      await apis.SendEmail({email:emailValue})
      message.success('验证码发送成功！')
    }catch(error){
      alert(error)
    }
    setIsSending(false)
    const timer=setInterval(()=>{
      setCountdown((countdown)=>{
        if(countdown<=0){
          clearInterval(timer)
          return 0
        }
        return countdown-1
      })
    },1000)
  }
  const onFinish = async (value: RegisterInfoType) => {
    let grade = value.studentId?.slice(0, 4);
    value.gradeName = grade;
    // value.birthday=formatDateToYYYYMMDD(value.birthday)
    value.birthday=`${value.birthday.$y}-${(""+(value.birthday.$M+1)).padStart(2,'0')}-${(""+(value.birthday.$D)).padStart(2,'0')}`
    console.log(value)
    //邮箱合法性校验
    if (checkEmail(value.email)) {
      await apis.Register(value);
      messageApi.info('注册成功，请登录');
      setTimeout(() => {
        navigate("/login")
      }, 1000)
    }
    else {
      messageApi.info({
        type: 'error',
        content: '请输入正确的邮箱后重新提交！',
      });
    }
  }

  const toLogin = () => {
    navigate("/login")
  }
  return (
    <div className="register-content flex-center margin-center">
      {contextHolder}
      <div className="register-box" style={{ width: '800px' }}>
        <img className="logo" src={LogoUrl} alt="logo" />
        <Form
          {...formItemLayout}
          name="apply"
          onFinish={onFinish}
          // 初始化表单数据
          style={{ width: "100%", marginTop: "0px", display: 'flex', flexWrap: 'wrap' }}
          scrollToFirstError
          className="apply-form-container"
        >
          <Form.Item style={{ display: 'block', width: '100%', paddingLeft: '43%', marginBottom: '2%', cursor: 'pointer' }}>
            <Tooltip title="用于登录的信息，请认真填写！">
              <h2>用户登录信息</h2>
            </Tooltip>
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的用户名！', whitespace: true }]}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的密码！', whitespace: true }]}
          >
            <Input.Password maxLength={30} />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            tooltip="邮箱用来接收面试结果，请认真填写"
            style={{ width: '50%' }}
            rules={[
              {
                type: 'email',
                message: '这不是有效的邮箱！',
              },
              {
                required: true,
                message: '请输入邮箱',
              },
            ]}
          >
            <Input maxLength={30} onChange={handleEmailChange} />
          </Form.Item>
          <Form.Item label="验证码" style={{ width: '50%' }} required>
            <Input.Group compact >
              <Form.Item
                style={{ width: '60%' }}
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码!',
                  },
                ]}
              >
                <Input placeholder="验证码"/>
              </Form.Item>
              <Button
                style={{ width: '40%', paddingLeft: '5%' }}
                type="primary"
              onClick={handleSendCode}
                loading={isSending}
                disabled={isSending}
              >
                {isSending ? `发送中...` : countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
              </Button>
            </Input.Group>
          </Form.Item>
          <Form.Item style={{ display: 'block', width: '100%', paddingLeft: '43%', marginBottom: '2%', cursor: 'pointer' }}>
            <Tooltip title="用于后续报名的信息，请认真填写！">
              <h2>个人信息完善</h2>
            </Tooltip>
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            tooltip="What do you want others to call you?"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的姓名！', whitespace: true }]}
          >
            <Input maxLength={30} />
          </Form.Item>

          <Form.Item
            name="sex"
            label="性别"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请选择你的性别!' }]}
          >
            <Select placeholder="你是GG还是MM">
              <Option value="男">男性</Option>
              <Option value="女">女性</Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: '50%' }}
            name="birthday"
            label="生日"
            rules={[
              {
                required: true,
                message: '请选择生日!',
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              placeholder="选择生日"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="电话号码"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的手机号!' }]}
          >
            <Input
              minLength={11} maxLength={15} />
          </Form.Item>
          <Form.Item
            name="qq"
            label="qq"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的qq号!' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="studentId"
            label="学号"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的学号!' }]}
          >
            <Input minLength={13} maxLength={20} />
          </Form.Item>

          <Form.Item
            name="faculty"
            label="学院"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请选择你所在的学院!' }]}
          >
            <Select placeholder="选择你所在的学院" onChange={handleFacultyChange}>
              {facultys.map((faculty)=>(
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="专业"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请选择你所在的专业!' }]}
          >
            <Select placeholder="选择你所在的专业">
              {subjects.map((subject)=>(
                <option value={subject} key={subject}>
                  {subject}
                </option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="className"
            label="班级"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你所在的班级!' }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            name="nationality"
            label="民族"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '请输入你的民族名称!' }]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item {...tailFormItemLayout} style={{ width: '100%' }}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
            <div onClick={toLogin} className="tips" style={{ display: 'inline', marginLeft: '30%', cursor: 'pointer' }}>已有账号点此登录</div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
export default React.memo(Register);