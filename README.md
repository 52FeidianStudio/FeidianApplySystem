# Feidian-Apply-System

## 基础

基于：React + Vite + Typescript + antd

### **拉取：**

```git
# GitHub
git clone https://github.com/52FeidianStudio/FeidianApplySystem
```

### **运行：**

```shell
npm install
//运行
npm run dev
//构建
npm run build
```

## 

##  🚀 功能

- 用户登录注册

- 通过邮箱找回密码

- 申请提交（表单校验，证件照上传）

- 查看面试结果

- 管理员可对申请表进行审核（通过邮件进行通知）

- 后台查看详细的用户数据

- 适配手机端布局

- 审核添加确认判断

- 完善后台邮件发送状态，发送中添加loading动画
  

  ### TODO
  - 完善后台数据切换动画
  - 用户数据区分 ,根据不同组别
  - 后台数据分页
  - 已审核的用户与未审核用户区分（默认不显示已经审核的用户，手动选择）

## 文件资源目录 📚

```text
Hooks-Admin
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ network                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ hooks               # 常用 Hooks
│  ├─ routers             # 路由管理
│  ├─ redux               # redux store
│  ├─ types               # 全局 ts 声明
│  ├─ utils               # 工具库
│  ├─ pages               # 项目所有页面
│  ├─ App.tsx             # 入口页面
│  ├─ main.tsx            # 入口文件
│  └─ env.d.ts            # vite 声明文件
├─ .gitignore             # git 提交忽略
├─ index.html             # 入口 html
├─ package-lock.json      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ postcss.config.js      # postcss 配置
├─ README.md              # README 介绍
├─ tsconfig.json          # typescript 全局配置
└─ vite.config.ts         # vite 配置
```

  ## 页面截图

![login](https://apply.ifeidian.cc/img/1.png)
![apply](https://apply.ifeidian.cc/img/2.png)
![result](https://apply.ifeidian.cc/img/3.png)
![admin](https://apply.ifeidian.cc/img/4.png)
![user_information](https://apply.ifeidian.cc/img/5.png)
