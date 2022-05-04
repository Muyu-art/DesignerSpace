import React from 'react'
import Taro, {Config,Component} from "@tarojs/taro";
import  {Provider}  from "@tarojs/mobx";
import Index from "./pages/index/index"
import './app.scss'


class App extends Component {
  patternPath='';
  globalData={
    userInfo:[],
    openId:'',
    patternItem:[],
    patternNum:0,
  };
  componentWillMount() {
    wx. cloud. init({
      env:'cloud1-5gdlx59w87914e75'
    });
    let that=this;
    wx.cloud.callFunction({
      name:'login_get_openid',
      success:res=>{
        that.globalData.openId = res.result.userInfo.openId;
        wx.cloud.database().collection('login_users').where({
          _openid:res.result.userInfo.openId,
        }).get({
          success:result=>{
            that.globalData.userInfo=result.data[0];
          }
        })
      }
    });

  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config:Config={
    pages:[
      "pages/index/index",//画板
      "pages/index/pen/pen",//画笔
    ],
    subPackages:[
      {
        root:"pages/patternStore/",
        pages:["pattern-store"],//内置图库
      },
      {
        root:"pages/personal-center/",
        pages:["personal-center"],//个人中心
      },
      {
        root:"pages/pattern/",
        pages:["pattern"],//作品图案
      },
      // {
      //   root:"pages/pen/",
      //   pages:["pen"],//画笔
      // },
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#FFFFFF",
      navigationBarTextStyle: "black",
      //allowsBounceVertical: "NO",
    },
    "cloud":true,

  }

  // this.props.children 是将要会渲染的页面
  render () {
    return(
      <Provider >
        {console.log("here")}
        <Index />
      </Provider>
      //this.props.children
    );
  }
}

export default App
Taro.render(<App />, document.getElementById("app"));
