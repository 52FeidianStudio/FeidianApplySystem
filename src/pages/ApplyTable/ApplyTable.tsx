import "./ApplyTable.less"
import apis from "../../network/api"
import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from 'antd';
import React, { useState } from 'react';
import logoUrl from "../../assets/logo_text.png";
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

const App: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        apis.SendApplication(values);
    };



    return (
        <div className="apply-table-content margin-center">
            <div className="feidian-logo margin-center flex-center">
                <img alt="feidianlogo" src={logoUrl}/>
            </div>
            <div className="apply-form">
                <Form
                    {...formItemLayout}
                    form={form}
                    name="apply"
                    onFinish={onFinish}
                    initialValues={{ prefix: '86' }}
                    style={{ width:"80%",marginTop:"50px"}}
                    scrollToFirstError
                >

                    <Form.Item
                        name="name"
                        label="姓名"
                        tooltip="What do you want others to call you?"
                        rules={[{ required: true, message: '请输入你的姓名！', whitespace: true }]}

                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        name="sex"
                        label="性别"
                        rules={[{ required: true, message: 'Please select gender!' }]}
                    >
                        <Select placeholder="select your gender">
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
                            style={{ width: '100%' }} maxLength={15}/>
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
                        <Input maxLength={20} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="grade"
                        label="年级"
                        rules={[{ required: true, message: '请输入你所在的年级!' }]}
                    >
                        <Input maxLength={20} style={{ width: '100%' }} />
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
                        <Select placeholder="select your gender">
                            <Option value="fe">大前端组</Option>
                            <Option value="ios">JAVA组</Option>
                            <Option value="java">IOS组</Option>
                            <Option value="safe">信安组</Option>
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
                        <Button style={{marginBottom:"50px" }} type="primary" htmlType="submit">
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    );
};

export default App;
