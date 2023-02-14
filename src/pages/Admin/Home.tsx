import "./Home.less"
import React, { useEffect, useState } from 'react';
import {Avatar, List, Tabs, Switch, Row, Col, Divider, Button, Modal, message, Skeleton} from 'antd';
import { UserInfotype, TabsType } from "../../types/common";
import apis from "../../network/apis";
import logoUrl from "../../assets/logo.png"
import { useNavigate } from "react-router-dom";
import {useRequest} from "ahooks";
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
    //数据初始化
    useRequest(apis.GetAllGrade,{
        onSuccess:(res)=>{
            let grades:string[] = res.data.data.grade;
            const newTabs: any[] = [];
            grades.map((item: any) => {
                newTabs.push({
                    key: item,
                    label: item
                })
            });
            setTabs(newTabs);
            //获取初始化申请列表
            apis.GetAllApplyInfo({ grade: grades[0] }).then((res) => {
                setList(res.data.data.users);
            });
        }
    })
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            message.error("请先登录")
            navigate('/')
        }
    }, []);
    //标签栏相关
    const ChangeTabs = (key: string) => {
        setList([]);
        apis.GetAllApplyInfo({ grade: key }).then((res) => {
            setList(res.data.data.users);
        });
    };
    //用户信息弹窗
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const showUserInfoModal = async (newIndex: number) => {
        await setCurrentIndex(newIndex);
        setOpen(true);
    };
    const onUserInfoClose = () => {
        setOpen(false);
    };
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const showReviewModal = () => {
        setIsReviewOpen(!isReviewOpen);
    };
    //邮件发送
    const [allSelectState, setAllSelectState] = useState(false);
    const AllSelect = (value: boolean) => {
        setAllSelectState(value);
        list.map((item)=>{
            item.selected = value;
        })
        setList(list);
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
        //邮件发送
        function send(item:UserInfotype)
        {
            //判断是否已经审核过，避免重复发送邮件
            if(item.status == "not reviewed")
            {
                item.loading = true;
                setList([...list]);
                apis.SendEmail({
                    "username": item.username,
                    "status": type == "pass" ? "pass" : "out",
                    "message": type == "pass" ? `${item.name}同学` + passMessage : `${item.name}同学` + outMessage
                }).then((res)=>{
                    if(res.data.message == "审核成功")
                    {
                        item.loading = false;
                        setList([...list]);
                    }
                });
            }
        }
        //判断是全部发送还是部分发送
        if (allSelectState) {
            list.map(async (item) => {
                 send(item);
            })
        }
        else {
            list.map((item) => {
                if (item.selectState) {
                  send(item);
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
                    <div className="header-button-container">
                        <div className="header-button"><Button type="primary" onClick={showReviewModal}>审核</Button></div>
                        <div style={{ right: "58px" }} className="header-button"><Button  onClick={() => { localStorage.setItem("token",'');navigate("/")}}>退出</Button></div>
                        <div className="header-switch"><Switch checkedChildren="全选" unCheckedChildren="无" defaultChecked={allSelectState} onChange={AllSelect} /></div>
                    </div>
                </div>
                <div className="tabs-content">
                    <Tabs items={tabs} onChange={ChangeTabs} />
                </div>
                {
                    <div className="list-content">
                    <List
                        itemLayout="horizontal"
                        dataSource={list}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[<a key="list-loadmore-more" onClick={() => {
                                    showUserInfoModal(index);
                                }
                                }>more</a>,
                                    <Switch
                                        checked={item.selected}
                                        loading={item.loading}
                                        size="small"
                                        onChange={(value) => {
                                            SingleSelect(value, index);
                                        }}
                                    />,]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.imgURL}/>}
                                    title={<div className="name-title">{item.name}</div>}
                                    description={<div className="description">{item.selfIntroduction}</div>}
                                />
                                <div className="department-title">{item.department}</div>
                            </List.Item>
                        )}
                    />
                </div>
                }
            </div>
            {/*审核弹窗*/}
            <Modal title="审核结果" open={isReviewOpen}
                   onOk={showReviewModal}
                   onCancel={showReviewModal}
                   footer={[<Button onClick={() => {showReviewModal(),SendEmail('fail')}} danger>淘汰</Button>,
                       <Button onClick={() => {showReviewModal(),SendEmail('pass') }} type="primary">通过</Button>]}
            >
                 <p>选择审核的结果</p>
            </Modal>
            {/*用户信息弹窗*/}
            <Modal title="Application" open={open} onOk={onUserInfoClose} onCancel={onUserInfoClose} width={800} style={{ top: 30 }}>
                <div className="application-title">
                    <p className="info-title" style={{ marginBottom: 4 }}>
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
