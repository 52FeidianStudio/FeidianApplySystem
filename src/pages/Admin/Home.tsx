import "./Home.less"
import React, { Children, Component, useEffect, useState } from 'react';
import { Avatar, List, Tabs, Switch, Row, Col, Divider, Button, Modal, message, Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { UserInfotype } from "../../types/common";
import apis from "../../network/apis";
import logoUrl from "../../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
  regiterId?: number;
}
const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="site-description-item-profile-wrapper">
    <p>{title}:</p>
    <p className="info-content">{content}</p>
  </div>
);
const AdminHome: React.FC = () => {
  const [list, setList] = useState<UserInfotype[]>([]);
  const [info, setInfo] = useState<any>({});
  // const [tabs, setTabs] = useState<TabsType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate()
  //侧边栏相关
  type MenuItem = {
    label: string;
    key: string | number;
    icon?: React.ReactNode;
    children?: MenuItem[];
  };
  let items: MenuItem[] = [];
  async function getItems(): Promise<void> {
    let grades: MenuItem[]=[];
    let majors: MenuItem[]=[];
    try {
      const gradeResponse = await apis.GetAllSelectInfo({ "queryCategoryId": 1 });
      grades = gradeResponse.data.data.map((item: any) => ({
        "label": item.gradeName,
        "key": item.gradeName,
        "icon": <AppstoreOutlined />,
      }));  
      const majorResponse = await apis.GetAllSelectInfo({ "queryCategoryId": 2 });
      
      majors = majorResponse.data.data.map((item: any) => ({
        "label": item.subjectName,
        "key": item.subjectId,
        "icon": <AppstoreOutlined />,
      }));
  
      const departmentResponse = await apis.GetAllSelectInfo({ "queryCategoryId": 3 });
      departmentResponse.data.data.forEach((item: any) => {
        items.push({
          "label": item.departmentName,
          "key": item.desireDepartmentId,
          "icon": <AppstoreOutlined />,
          "children": [
            {
              "label": '年级',
              "key":"年级",
              "icon": <AppstoreOutlined />,
              "children": grades,
            },
            {
              "label": '专业',
              "key":"专业",
              "icon": <AppstoreOutlined />,
              "children": majors,
            },
          ],
        });
        console.log(items)
        setMenuItems(items);
      });
    } catch (error) {
      // 处理错误
      console.error("An error occurred:", error);
    }
  };
  //数据初始化
  useRequest(() => apis.GetAllApplyInfo({ 'queryAllFlag': 0 }), {
    onSuccess: async (res: any) => {
      console.log(res.data.data)
      setList(res.data.data);
      await getItems();
    }
  })
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      message.error("请先登录")
      navigate('/')
    }
    
  }, []);
  const getSelectInfo = async (selectInfo: any) => {
    let res = await apis.GetAllApplyInfo(selectInfo);
    console.log(res.data.data)
    setList(res.data.data);
  };
  //用户信息弹窗
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const showUserInfoModal = async (newIndex: number) => {
    await setCurrentIndex(newIndex);
    setOpen(true);
  };
  const showUserInfo = async (item: any) => {
    setInfo({})
    let userInfo = await apis.GetOneApplyInfo({ 'registerId': item.registerId });
    // let partUrl = userInfo.data.data.imgUrl.replace(/\/\//g, "/");
    // userInfo.data.data.imgUrl = partUrl;
    console.log(userInfo.data.data)
    setInfo(userInfo.data.data);
  }
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
    list.map((item) => {
      item.selected = value;
    })
    setList(list);
  }
  const SingleSelect = (value: boolean, index: number) => {
    list[index].selectState = value;
  }
  const SendEmail = async (type: string) => {
    const passMessage:string = '沸点工作室衷心地向您表示祝贺！您已成功通过我们的面试过程，我们很高兴地通知您成为我们工作室预备成员中的一员。'
    const outMessage:string = '感谢您能参与我们的面试，但经过综合的评估与考虑，我们不得不遗憾地通知您，您暂时未能成功通过我们的面试。'
    message.info("邮件发送中....")
    //邮件发送
    function send(item: UserInfotype) {
      //判断是否已经审核过，避免重复发送邮件
      if (item.status == "0") {
        item.loading = true;
        setList([...list]);
        apis.SendInfoEmail({
          "registerId": +item.registerId!,
          "isApprovedFlag": type == "pass" ? "2" : "3",
          "emailContent": type == "pass" ? `${item.name}同学: \n\t` + passMessage : `${item.name}同学: \n\t` + outMessage
        }).then( async (res) => {
          // if (res.data.message == "成功修改报名表状态为已通过，并将其添加至预备成员") {
          //   item.loading = false;
          //   setList([...list]);
          // }
          let list = await apis.GetAllApplyInfo({ 'queryAllFlag': 0 });
          setList(list.data.data);
          item.loading = false;
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
  };
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    if(e.keyPath[1]=="专业"){
      console.log({ 'desireDepartmentId': e.keyPath[2],'subjectId':e.keyPath[0]})
      const selectInfo = {'desireDepartmentId': e.keyPath[2],'subjectId':e.keyPath[0]};
      getSelectInfo(selectInfo);
    }
    else if(e.keyPath[1]=="年级"){
      console.log({ 'desireDepartmentId': e.keyPath[2],'gradeName':e.keyPath[0]})
      const selectInfo = {'desireDepartmentId': e.keyPath[2],'gradeName':e.keyPath[0]};
      getSelectInfo(selectInfo);
    }
    
  };
  return (
    <div className="admin-container">
      <div className="left-menu-content">
        {/* <Menu
          onClick={onClick}
          style={{ width: "100%", marginTop: 30 }}
          mode="inline"
          items={items}
        /> */}
        <Menu onClick={onClick} style={{ width: '100%', marginTop: 30 }} mode="inline">
          {menuItems.map((item: MenuItem) => (
            <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
              {item.children?.map((child: MenuItem) => (
                <Menu.SubMenu key={child.key} title={child.label} icon={child.icon}>
                  {child.children?.map((grandson: MenuItem) => (
                    <Menu.Item key={grandson.key} icon={grandson.icon}>
                      {grandson.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </div>
      <div className="admin-home-content">
        <div className="header-content">
          <img alt="logo" src={logoUrl} />
          <div className="header-title">报名系统后台</div>
          <div className="header-button-container">
            <div className="header-button"><Button type="primary" onClick={showReviewModal}>审核</Button></div>
            <div style={{ right: "58px" }} className="header-button"><Button onClick={() => { localStorage.setItem("token", ''); navigate("/") }}>退出</Button></div>
            <div className="header-switch"><Switch checkedChildren="全选" unCheckedChildren="无" defaultChecked={allSelectState} onChange={AllSelect} /></div>
          </div>
        </div>
        {/* <div className="tabs-content">
                    <Tabs items={tabs} onChange={ChangeTabs} />
                </div> */}
        {
          <div className="list-content">
            <List
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item, index) => (
                <List.Item
                  actions={[<a key="list-loadmore-more" onClick={() => {
                    showUserInfoModal(index);
                    showUserInfo(item);
                  }
                  }>more</a>,
                  item.status=="0"?(<Switch 
                    checked={item.selected}
                    loading={item.loading}
                    size="default"
                    onChange={(value) => {
                      SingleSelect(value, index);
                    }}
                  />):item.status=="2"?(<Button type="primary" size="small" >已通过</Button>):(<Button type="primary" danger size="small">未通过</Button>)
                  ,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.imgUrl} />}
                    title={<div className="name-title">{item.name}</div>}
                    description={<div className="description">{item.resume}</div>}
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
        footer={[<Button onClick={() => { showReviewModal(), SendEmail('fail') }} danger>淘汰</Button>,
        <Button onClick={() => { showReviewModal(), SendEmail('pass') }} type="primary">通过</Button>]}
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
            <Avatar shape="square" size={150} src={info.imgUrl} />
          </div>
          <Row>

            <Col span={12}>
              <DescriptionItem title="姓名" content={info.name} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="用户名" content={info.username} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="性别" content={info.sex} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="学院" content={info.facultyName} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="班级" content={info.className} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="年级" content={info.gradeName} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="组别" content={info.desireDepartmentName} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="学号" content={info.studentId} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem title="民族" content={info.nationality} />
            </Col>
            <Col span={24}>
              <DescriptionItem title="个人介绍" content={info.resume} />
            </Col>

          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="加入沸点的原因"
                content={info.reason}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title="大学四年规划"
                content={info.arrangement}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title="发展方向"
                content={info.direction}
              />
            </Col>
          </Row>
          <Divider />
          <p className="info-title">联系方式</p>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Email" content={info.email} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Phone Number" content={info.phone} />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  )
}
export default AdminHome;
