import "./ApplyTable.less"
import apis from "../../network/apis"
import {
    Button,
    Form,
    Input, notification,
    Select,
    Upload,
    message, Alert
} from 'antd';
import { FrownOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import logoUrl from "../../assets/logo.png";
import { UserInfotype } from "../../types/common";
import { useNavigate } from "react-router-dom";
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

const ApplyTable: React.FC = () => {
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    let [preForm, SetPreForm] = useState<UserInfotype>();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            message.error("请先登录")
            navigate('/')
        }
    }, [])
    //判断图片是否上传
    let imgUploadState = false;
    const uploadCallBack = (e:any) =>
    {
        if(e.fileList.length >= 1)
        {
            imgUploadState = true;
        }
    }
    //图片大小限制
    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    //申请提交
    const onFinish = async (values: UserInfotype) => {
        if (values.studentID?.slice(0, 2) != "20")
        {
            message.error("请输入正确的学号")
        }
        else if(!imgUploadState)
        {
            message.error("请上传图片")
        }
        else
        {

            let grade = values.studentID?.slice(0, 4);
            values.grade = grade;
            let res = await apis.SendApplication(values);
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
                    closable
                    style={{margin:"6vh 5vw 0 5vw"}}
                />
                <Form
                    {...formItemLayout}
                    form={form}
                    name="apply"
                    onFinish={onFinish}
                    // 初始化表单数据
                    initialValues={{}}
                    style={{ width: "100%", marginTop: "50px"}}
                    scrollToFirstError
                    className="apply-form-container"
                >
                    <Form.Item label="上传照片" valuePropName="fileList">
                        <Upload action="http://101.43.181.13:8888/user/img"
                            headers={{ token: `${token}` }}
                            listType="picture-card"
                            accept=".png,.jpg,.jpeg"
                            onChange={uploadCallBack}
                            maxCount={1}
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
                            <Option value="男性">男性</Option>
                            <Option value="女性">女性</Option>
                            <Option value="其他">其他</Option>
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
                        name="studentID"
                        label="学号"
                        rules={[{ required: true, message: '请输入你的学号!' }]}
                    >
                        <Input minLength={13} maxLength={20} style={{ width: '100%' }} />
                    </Form.Item>


                    <Form.Item
                        name="faculty"
                        label="院系"
                        rules={[{ required: true, message: '请输入你所在的学院!' }]}
                    >
                        <Input maxLength={20} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="class_"
                        label="班级"
                        rules={[{ required: true, message: '请输入你所在的班级!' }]}
                    >
                        <Input maxLength={20} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="nationality"
                        label="民族"
                        rules={[{ required: true, message: '请输入你的民族名称!' }]}
                    >
                        <Input maxLength={10} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="申请的部门"
                        rules={[{ required: true, message: '请选择你要加入的部门!' }]}
                    >
                        <Select placeholder="选择你要加入的部门">
                            <Option value="大前端组">大前端组</Option>
                            <Option value="JAVA组">JAVA组</Option>
                            <Option value="IOS组">IOS组</Option>
                            <Option value="信安组">信安组</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="reason"
                        label="想要加入的原因"
                        rules={[{ required: true, message: '请输入你想要加入的原因' }]}
                    >
                        <Input.TextArea showCount maxLength={300} />
                    </Form.Item>
                    <Form.Item
                        name="selfIntroduction"
                        label="自我介绍"
                        rules={[{ required: true, message: '请输入你的自我介绍' }]}
                    >
                        <Input.TextArea showCount maxLength={300} />
                    </Form.Item>


                    <Form.Item {...tailFormItemLayout}>
                        <Button style={{ marginBottom: "50px" }} type="primary" htmlType="submit">
                            发送申请
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </div>

    );
};

export default React.memo(ApplyTable);
