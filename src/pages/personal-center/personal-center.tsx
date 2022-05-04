import React from 'react'
import Taro, { Config,Component } from "@tarojs/taro";
import {View, Image,Button} from '@tarojs/components'
import BottomNavbar from "../../components/bottom-navbar";
import getLoginIcon from './img/login.png'
import LoginOutIcon from './img/loginout.png'
import onlineServiceIcon from './img/service.png'
import feedbackIcon from './img/feedback.png'
import patternIcon from './img/pattern.png'
import './personal-center.scss'

const app = Taro.getApp();//设为全局对象
export default class PersonalCenter extends Component<any,any> {
  static defaultProps = {

  };
  config: Config = {
    navigationBarTitleText: "个人中心",
  };
  constructor(props) {
    super(props);
    this.state = {
      userInfo:app.globalData.userInfo,
      hasUserInfo:false,
    };
  }
  componentWillMount () { }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  public login(){
    let that=this;
    wx.getUserProfile({
      desc:"获取用户授权",
      success:res=>{
        that.setState({
          userInfo:res.userInfo,
          hasUserInfo:true,
        })
        let user=res.userInfo;
        app.globalData.userInfo=user;
        wx.setStorageSync("globalData.userInfo", user)
        wx.cloud.database().collection('login_users').add({
          data : {
            avatarUrl:user.avatarUrl,
            nickName:user.nickName,
          },
          success:res=>{
            console.log(res);
            wx.showToast({
              title:"授权登录成功"
            })
          }
        })
      }
    });
  }
  public loginOut(){
    app.globalData.userInfo=null;
    this.setState({
      userInfo:null,
    })
  }
  public goToPattern(){
    Taro.redirectTo({
      url: '/pages/pattern/pattern'
    });
  }

  render () {
    const {userInfo}=this.state;
    return (
      <View className='center-content'>
        <View className={"head-info"}>
          {!userInfo&&
            <View>
              <Button className={"get-login-btn"} onClick={this.login}>
                <Image className={"get-login-icon"} src={getLoginIcon} onClick={this.login}/>授权登录
              </Button>
            </View>
          }
          {userInfo&&
            <View>
              <View className={"head-img"}>
                <Image className={"head-img-info"} src={userInfo.avatarUrl}/>
              </View>
              <View className={"head-name"}>
                <View className={"head-name-font"}>{userInfo.nickName}</View>
              </View>
            </View>
          }
        </View>
        <View className={"personal-content"}>
          {userInfo&&
            <View className={"my-pattern"} onClick={this.goToPattern}>
              <Image className={"my-pattern-icon"} src={patternIcon}/>
              <View className={"my-pattern-font"}>我的设计</View>
            </View>
          }
          <View className={"online-service"}>
            <Image className={"online-service-icon"} src={onlineServiceIcon}/>
            <Button className={"online-service-btn"} openType={"contact"}>在线客服</Button>
          </View>
          <View className={"feedback"}>
            <Image className={"feedback-icon"} src={feedbackIcon}/>
            <Button className={"feedback-btn"} openType={"feedback"}>反馈建议</Button>
          </View>
          {userInfo&&
            <View className={"login-out"} onClick={this.loginOut}>
              <Image className={"login-out-icon"} src={LoginOutIcon}/>
              <View className={"login-out-font"}>退出登录</View>
            </View>
          }
        </View>
        <BottomNavbar curNav={"personal-center"}/>
      </View>
    )
  }
}
