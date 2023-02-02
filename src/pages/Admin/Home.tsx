import "./Home.less"
import React, { useEffect, useState } from 'react';
import {Avatar, List, Tabs, Switch, Row, Col, Divider, Drawer} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {UserInfotype,TabsType} from "../../type/common";
import apis from "../../network/apis"
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
const AdminHome:React.FC = ()=>{
    const [list, setList] = useState<UserInfotype[]>([]);
    const [tabs,setTabs] = useState<TabsType[]>([]);
    //标签栏相关
    const ChangeTabs = (key: string) => {
        apis.GetAllApplyInfo({grade:key}).then((res)=>{
            if(res.data.code == "200")
            {
                setList(res.data.data.users);
            }
        });
    };
    //数据初始化
    useEffect(() => {
        apis.GetAllGrade().then(async (res)=>{
            if (res.data.code == "200")
            {
                let grades = res.data.data.grade;
                const newTabs: any[] = [];
                grades.map((item:any)=>{
                    newTabs.push({
                        key:item,
                        label:item
                    })
                })
                await setTabs(newTabs);
                apis.GetAllApplyInfo({grade:tabs[0].key}).then((res)=>{
                    if(res.data.code == "200")
                    {
                        setList(res.data.data.users);
                    }
                });
            }
        })

    }, []);

    //遮罩
    const [open, setOpen] = useState(false);
    const [currentIndex,setCurrentIndex] = useState(0);
    const showDrawer = async (newIndex:number) => {
        await setCurrentIndex(newIndex);
        setOpen(true);

    };
    const onClose = () => {
        setOpen(false);
    };
    // @ts-ignore
    return(
        <>
        <div className="admin-home-content">
            <div className="tabs-content">
                <Tabs items={tabs} onChange={ChangeTabs} />
            </div>
            <div className="list-content">
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={list}
                    renderItem={(item,index) => (
                        <List.Item
                            actions={[  <a key="list-loadmore-more" onClick={()=>{
                                showDrawer(index);
                            }
                            }>more</a>,   <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                                size="small"
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
            <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
                <p className="info-title" style={{ marginBottom: 24 }}>
                    User Profile
                </p>
                <div style={{margin:"10px auto"}}>
                    <Avatar shape="square" size={150} src={list[currentIndex]?.imgURL}  />
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
                        <DescriptionItem title="Email" content={list[currentIndex]?.email}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Phone Number" content={list[currentIndex]?.phone} />
                    </Col>
                </Row>
            </Drawer>
            </>
    )
}
export default AdminHome;
