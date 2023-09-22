import "./ApplyTable.less"
import apis from "../../network/apis"
import axios from "axios";
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Alert,
  Skeleton
} from 'antd';
import { FrownOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import logoUrl from "../../assets/logo.png";
import { UserInfotype } from "../../types/common";
import { useNavigate } from "react-router-dom"
import { useRequest } from 'ahooks';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
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
const nationalityOptions = [
  '白族',
  '保安族',
  '布朗族',
  '布依族',
  '朝鲜族',
  '达斡尔族',
  '傣族',
  '德昂族',
  '东乡族',
  '侗族',
  '独龙族',
  '俄罗斯族',
  '鄂伦春族',
  '鄂温克族',
  '高山族',
  '仡佬族',
  '哈尼族',
  '哈萨克族',
  '汉族',
  '赫哲族',
  '回族',
  '基诺族',
  '京族',
  '景颇族',
  '柯尔克孜族',
  '拉祜族',
  '黎族',
  '傈僳族',
  '珞巴族',
  '满族',
  '毛南族',
  '门巴族',
  '蒙古族',
  '苗族',
  '仫佬族',
  '纳西族',
  '怒族',
  '普米族',
  '羌族',
  '撒拉族',
  '畲族',
  '水族',
  '塔吉克族',
  '塔塔尔族',
  '土家族',
  '土族',
  '佤族',
  '维吾尔族',
  '乌兹别克族',
  '锡伯族',
  '瑶族',
  '彝族',
  '裕固族',
  '藏族',
  '壮族',
  '仡佬族'
];

const ApplyTable: React.FC = () => {
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [facultys, setFacultys] = useState([])
  const [subjects, setSubjects] = useState([])
  const [isCommited, setIsCommited] = useState(false);
  const [imgUploadState, setImgUploadState] = useState(false);
  const [subject, setSubject] = useState('')
  // 后端有接口，所以要尝试从后端获取preForm
  let [preForm, SetPreForm] = useState<UserInfotype>();
  const handleFacultyChange = async (value: string, option: any) => {
    let res = await apis.GetAllSubjectsByFaculty({ name: value })
    form.setFieldsValue({ subjectName: '' });
    setSubjects(res.data.data)
  }
  useRequest(apis.GetAllFaculty, {
    onSuccess: (res) => {
      setFacultys(res.data.data)
    }
  })
  useRequest(apis.GetSingleApplyinfo, {
    onSuccess: async (res) => {
      let userInfo: any = res.data.data;
      console.log(userInfo);
      if (userInfo.status != '0' && userInfo.status != null) {
        navigate("/pass_result");
        message.info("当前已无法修改申请，面试结果已出！")
      } else if (userInfo.status == '0') {
        setIsCommited(true);
        const res = await apis.GetSelfApplyinfo();
        console.log(res);
        const fetchData = { ...res.data.data, ...userInfo.frontUserVO };
        fetchData.department = fetchData.desireDepartmentName;
        SetPreForm(fetchData);
        setImgUploadState(true)
      } else {
        SetPreForm(userInfo.frontUserVO);
      }
      console.log(preForm);
      let faculty = userInfo.frontUserVO.facultyName;
      let subjects = await apis.GetAllSubjectsByFaculty({ name: faculty })
      setSubjects(subjects.data.data)
    }
  });
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      message.error("请先登录")
      navigate('/')
    }
  })
  // //判断图片是否上传
  // const uploadCallBack = (e: any) => {
  //   console.log(e);
  //   if (e.file.response?.message == "图片上传成功") {
  //     imgUploadState = true;
  //   }
  // }
  //图片大小限制
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
      return false;
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('请上传小于3M的图片');
      return false;
    }
    // 创建新的 FormData 对象
    const formData = new FormData();
    formData.append('imageFile', file); // 将文件字段名设置为 'imageFile'

    // 在这里可以将 formData 发送到服务器端
    // 发送POST请求
    axios.post('http://182.254.242.96:3333/register/submitImage', formData, {
      headers: {
        'Authorization': token, // 替换为你的授权头部信息
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryxxxxxxxx'
      }
    })
      .then(response => {
        // 处理成功响应
        console.log(response)
        setImgUploadState(true);
        message.success('上传成功！');
      })
      .catch(error => {
        // 处理错误
        message.error('上传失败，请重试！');
      });

    return true; // 阻止默认上传行为
  };
  //申请提交
  const onFinish = async (values: UserInfotype) => {
    if (("" + values.studentId).slice(0, 2) != "20") {
      message.error("请输入正确的学号")
    }
    else if (!imgUploadState) {
      console.log(imgUploadState);
      message.error("请上传图片")
    }
    else {
      if (!isCommited) {
        values.desireDepartmentId = parseInt(values.department!)
        console.log(values);
        await Promise.all([
          apis.SendApplication({ resume: values.resume, reason: values.reason, arrangement: values.arrangement, direction: values.direction, desireDepartmentId: values.desireDepartmentId } as UserInfotype),
          apis.ChangeSingleApplyinfo({ name: values.name, sex: values.sex, phone: values.phone, email: values.email, studentId: values.studentId, facultyName: values.facultyName, subjectName: values.subjectName, className: values.className, nationality: values.nationality })
        ])
      } else {
        if (values.department == "1" || values.department == "2" || values.department == "3" || values.department == "4") {
          values.desireDepartmentId = parseInt(values.department!)
        } else {
          values.desireDepartmentId = 1
        }
        console.log(values);
        await Promise.all([
          apis.SendApplicationAgain({ resume: values.resume, reason: values.reason, arrangement: values.arrangement, direction: values.direction, desireDepartmentId: values.desireDepartmentId } as UserInfotype),
          apis.ChangeSingleApplyinfo({ name: values.name, sex: values.sex, phone: values.phone, email: values.email, studentId: values.studentId, facultyName: values.facultyName, subjectName: values.subjectName, className: values.className, nationality: values.nationality })
        ])
      }
      message.info("申请提交成功！")
      navigate("/apply_result")
    }
  }

  return (
    <div className="apply-table-content margin-center">
      <div className="feidian-logo margin-center">
        <div className="feidian-logo-content">
          <img alt="feidianlogo" src={logoUrl} />
          <div className="title">沸点报名系统</div>
        </div>
      </div>
      <div className="apply-form">
        <Alert
          message="Warning"
          description="请认真填写所有信息，并上传本人图片，信息不全或无证件照，均视为无效申请！"
          showIcon
          style={{ margin: "5vh 5vw 0 5vw" }}
        />
        {
          !preForm &&
          <div className="skeleton-loading">
            <Skeleton active />
          </div>
        }
        {
          preForm &&
          <Form
            {...formItemLayout}
            form={form}
            name="apply"
            onFinish={onFinish}
            // 初始化表单数据
            initialValues={preForm}
            style={{ width: "100%", marginTop: "20px" }}
            scrollToFirstError
            className="apply-form-container"
          >
            {/* TODO:上传照片给后端 */}
            <Form.Item label="上传照片" name="imgUrl">
              <Upload
                listType="picture-card"
                accept=".png,.jpg,.jpeg"
                // onChange={uploadCallBack}
                maxCount={1}
                defaultFileList={preForm.imgUrl ? [{
                  uid: '-1',
                  name: 'image.png',
                  status: 'done',
                  url: preForm.imgUrl,
                }] : []
                }
                beforeUpload={beforeUpload}>
                <div>
                  <PlusOutlined />
                  <div>上传你的照片</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item
              name="name"
              label="姓名"
              tooltip="What do you want others to call you?"
              rules={[{ required: true, message: '请输入你的姓名！', whitespace: true }]}
            >
              <Input maxLength={30} />
            </Form.Item>

            <Form.Item
              name="sex"
              label="性别"
              rules={[{ required: true, message: '请选择你的性别!' }]}
            >
              <Select placeholder="你是GG还是MM">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </Form.Item>


            <Form.Item
              name="phone"
              label="电话号码"
              rules={[{ required: true, message: '请输入你的手机号!' }]}
            >
              <Input
                style={{ width: '100%' }} minLength={11} maxLength={15} />
            </Form.Item>


            <Form.Item
              name="email"
              label="E-mail"
              tooltip="邮箱用来接收面试结果，请认真填写"
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
              <Input maxLength={30} />
            </Form.Item>

            <Form.Item
              name="studentId"
              label="学号"
              rules={[{ required: true, message: '请输入你的学号!' }]}
            >
              <Input minLength={13} maxLength={20} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="facultyName"
              label="学院"
              rules={[{ required: true, message: '请选择你所在的学院!' }]}
            >
              <Select placeholder="选择你所在的学院" onChange={handleFacultyChange}>
                {facultys.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="subjectName"
              label="专业"
              dependencies={['facultyName']}
              rules={[
                { required: true, message: '请选择你所在的专业!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('facultyName') && !value) {
                      return Promise.reject(new Error('请选择你所在的专业!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select placeholder="选择你所在的专业" value={subject}>
                {subjects.map((subject) => (
                  <option value={subject} key={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="className"
              label="班级(例：2301)"
              rules={[{ required: true, message: '请输入你所在的班级!' }, { pattern: /^\d{4}$/, message: '请输入正确的班级' }]}
            >
              <Input maxLength={20} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="nationality"
              label="民族"
              rules={[{ required: true, message: '请输入你的民族名称!' }]}
            >
              <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder="请选择你的民族"
              >
                {nationalityOptions.map((nationality) => (
                  <Option key={nationality} value={nationality}>
                    {nationality}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="department"
              label="申请的部门"
              rules={[{ required: true, message: '请选择你要加入的部门!' }]}
            >
              <Select placeholder="选择你要加入的部门">
                <Option value="1">前端</Option>
                <Option value="2">后端</Option>
                <Option value="3">IOS</Option>
                <Option value="4">信息安全</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="resume"
              label="自我介绍"
              rules={[{ required: true, message: '请输入你的自我介绍' }]}
            >
              <Input.TextArea showCount maxLength={300} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="想要加入的原因"
              rules={[{ required: true, message: '请输入你想要加入的原因' }]}
            >
              <Input.TextArea showCount maxLength={300} />
            </Form.Item>
            <Form.Item
              name="arrangement"
              label="大学四年整体规划"
              rules={[{ required: true, message: '请输入你大学四年的规划' }]}
            >
              <Input.TextArea showCount maxLength={300} />
            </Form.Item>
            <Form.Item
              name="direction"
              label="发展方向"
              rules={[{ required: true, message: '请输入你规划的发展方向' }]}
            >
              <Input.TextArea showCount maxLength={300} />
            </Form.Item>
            <Form.Item {...tailFormItemLayout} className="btns">
              <Button style={{ marginBottom: "50px" }} type="primary" htmlType="submit">
                发送申请
              </Button>
              <Button className="btn" style={{ marginBottom: "50px" }} type="primary" htmlType="submit" onClick={() => { localStorage.setItem("token", ''); navigate("/") }}>
                退出
              </Button>
            </Form.Item>

          </Form>
        }
      </div>
    </div>

  );
};

export default React.memo(ApplyTable);
