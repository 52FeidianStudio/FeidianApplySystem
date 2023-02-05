import "./Home.less"
import React, { useEffect, useState } from 'react';
import { Avatar, List, Tabs, Switch, Row, Col, Divider, Button, Modal, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { UserInfotype, TabsType } from "../../type/common";
import apis from "../../network/apis";
import logoUrl from "../../assets/logo.png"
import { useNavigate } from "react-router-dom";
interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}
const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="site-description-item-profile-wrapper">
        <p>{title}:</p>
        <p className="info-content">{content}</p>
    </div>
);
const AdminHome: React.FC = () => {
    const [list, setList] = useState<UserInfotype[]>([]);
    const [tabs, setTabs] = useState<TabsType[]>([]);
    const navigate = useNavigate()
    //标签栏相关
    const ChangeTabs = (key: string) => {
        apis.GetAllApplyInfo({ grade: key }).then((res) => {
            setList(res.data.data.users);
        });
    };
    //数据初始化
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            message.error("请先登录")
            navigate('/')
        }
        apis.GetAllGrade().then((res) => {

            let grades = res.data.data.grade;
            const newTabs: any[] = [];
            grades.map((item: any) => {
                newTabs.push({
                    key: item,
                    label: item
                })
            })
            setTabs(newTabs);
            //获取初始化申请列表
            apis.GetAllApplyInfo({ grade: grades[0] }).then((res) => {
                setList(res.data.data.users);
            });

        })


    }, []);

    //用户信息弹窗
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const showDrawer = async (newIndex: number) => {
        await setCurrentIndex(newIndex);
        setOpen(true);

    };
    const onClose = () => {
        setOpen(false);
    };
    //邮件发送
    const [allSelectState, setAllSelectState] = useState(false);
    const AllSelect = (value: boolean) => {
        setAllSelectState(value);
    }
    const SingleSelect = (value: boolean, index: number) => {
        list[index].selectState = value;
    }
    const SendEmail = async (type: string) => {
        let res = await apis.GetMailTemplate();
        let mailTemplates = res.data.data.templates;
        let passMessage: string, outMessage: string;
        mailTemplates.map((item: any) => {
            if (item.type == "pass") {
                passMessage = item.message;
            }
            else {
                outMessage = item.message;
            }
        })
        message.info("邮件发送中....")
        if (allSelectState) {
            list.map(async (item) => {
                let res = await apis.SendEmail({
                    "username": item.username,
                    "status": type == "pass" ? "pass" : "out",
                    "message": type == "pass" ? `${item.name}同学` + passMessage : `${item.name}同学` + outMessage
                });
            })
        }
        else {
            list.map(async (item) => {
                if (item.selectState) {
                    let res = await apis.SendEmail({
                        "username": item.username,
                        "status": type == "pass" ? "pass" : "out",
                        "message": type == "pass" ? `${item.name}同学` + passMessage : `${item.name}同学` + outMessage
                    });
                }
            })
        }
    }
    return (
        <>
            <div className="admin-home-content">
                <div className="header-content">
                    <img alt="logo" src={logoUrl} />
                    <div className="header-title">报名系统后台</div>
                    <div className="header-button"><Button type="primary" onClick={() => { SendEmail('pass') }}>通过</Button></div>
                    <div style={{ right: "62px" }} className="header-button"><Button danger onClick={() => { SendEmail('fail') }}>未过</Button></div>
                    <div className="header-switch"><Switch checkedChildren="全选" unCheckedChildren="无" defaultChecked={allSelectState} onChange={AllSelect} /></div>
                </div>
                <div className="tabs-content">
                    <Tabs items={tabs} onChange={ChangeTabs} />
                </div>
                <div className="list-content">
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={list}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[<a key="list-loadmore-more" onClick={() => {
                                    showDrawer(index);
                                }
                                }>more</a>, <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                    size="small"
                                    onChange={(value) => {
                                        SingleSelect(value, index);
                                    }}
                                />,]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.imgURL} />}
                                    title={<div>{item.name}</div>}
                                    description={<div className="description">{item.selfIntroduction}</div>}
                                />
                                <div>{item.department}</div>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
            <Modal title="Application" open={open} onOk={onClose} onCancel={onClose} width={755}>
                <div style={{ padding: "20px 50px" }}>
                    <p className="info-title" style={{ marginBottom: 24 }}>
                        User Profile
                    </p>
                    <div style={{ margin: "10px auto" }}>
                        <Avatar shape="square" size={150} src={list[currentIndex]?.imgURL} />
                    </div>
                    <Row>

                        <Col span={12}>
                            <DescriptionItem title="姓名" content={list[currentIndex]?.name} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="用户名" content={list[currentIndex]?.username} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="性别" content={list[currentIndex]?.sex} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="学院" content={list[currentIndex]?.faculty} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="班级" content={list[currentIndex]?.class_} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="年级" content={list[currentIndex]?.grade} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="组别" content={list[currentIndex]?.department} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="学号" content={list[currentIndex]?.studentID} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem title="民族" content={list[currentIndex]?.nationality} />
                        </Col>
                        <Col span={24}>
                            <DescriptionItem title="个人介绍" content={list[currentIndex]?.selfIntroduction} />
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="加入沸点的原因"
                                content={list[currentIndex]?.reason}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <p className="info-title">联系方式</p>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Email" content={list[currentIndex]?.email} />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="Phone Number" content={list[currentIndex]?.phone} />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    )
}
export default AdminHome;
