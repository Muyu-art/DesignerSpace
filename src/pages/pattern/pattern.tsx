import React from 'react'
import Taro, { Config,Component } from "@tarojs/taro";
import {View, ScrollView} from '@tarojs/components'
import BottomNavbar from "../../components/bottom-navbar";
import PatternItem from './components/pattern-item'
import './pattern.scss'

const app = Taro.getApp();//设为全局对象
export default class Pattern extends Component<any,any> {
  static defaultProps = {

  };
  static options = {
    addGlobalClass: true
  }

  config: Config = {
    navigationBarTitleText: "作品列表",
  };
  constructor(props) {
    super(props);
    this.state = {
      allPattern:[[]],
    };
  }
  componentWillMount () {
    let that=this;
    wx.cloud.database().collection("pattern_list").where({
      _openid:app.globalData.openId,
    }).get({
      success:res=>{
        that.setState({
          allPattern:res.data,
        })
      }
    });
  }

  componentDidMount () {
    //let that=this;
    //setTimeout(function(){that.countPatternNum()},500);
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  public countPatternNum(){

  }

  public getId = (id) => {
    // this.setState({
    //   patternId: id
    // });
    wx.cloud.database().collection('pattern_list').where({
      _id:id,
    }).remove({
      success:()=>{
        wx.showToast({
          title:"删除成功"
        })
      }
    });
    Taro.redirectTo({
      url: '/pages/pattern/pattern'
    });
  };

  public getPatternIndex=(index)=>{
    const {allPattern}=this.state;
    app.globalData.patternItem=allPattern[index].pattern;
    app.globalData.patternNum=allPattern[index].pattern.length;
    Taro.redirectTo({
      url: '/pages/index/index'
    });
  }

  render () {
    const {allPattern}=this.state;
    return (
      <View className='pattern'>
        <View className={"block"}/>
        <View className={"pattern-list"}>
          {allPattern==null&&
            <View className={"no-pattern"}>
              您暂时没有设计图案，请前往设计~
            </View>
          }
          {allPattern&&
            <ScrollView scrollY className={"pattern-scroll"}>
              {allPattern.map((item, i) =>
                <PatternItem
                  key={i}
                  name={item.name}
                  num={item.num}
                  path={item.coverImg}
                  patternId={item._id}
                  postId={this.getId}
                  patternIndex={i}
                  postIndex={this.getPatternIndex}
                />
              )}
            </ScrollView>
          }
        </View>
        <BottomNavbar curNav={"pattern"}/>
      </View>
    )
  }
}
