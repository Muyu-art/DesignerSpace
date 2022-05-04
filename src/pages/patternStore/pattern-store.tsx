import React from 'react'
import Taro,{ Config,Component } from "@tarojs/taro";
import { View, ScrollView,Image } from '@tarojs/components'
// import pattern1 from './img/patternstore/pattern1.png';
// import pattern2 from './img/patternstore/pattern2.png';
// import pattern3 from './img/patternstore/pattern3.png';
// import pattern4 from './img/patternstore/pattern4.png';
// import pattern5 from './img/patternstore/pattern5.png';
// import pattern6 from './img/patternstore/pattern6.png';
// import pattern7 from './img/patternstore/pattern7.png';
// import pattern8 from './img/patternstore/pattern8.png';
// import pattern9 from './img/patternstore/pattern9.png';
// import pattern10 from './img/patternstore/pattern10.png';
import './pattern-store.scss'


export default class patternStore extends Component<any,any> {
  static defaultProps = {

  };
  config: Config = {
    navigationBarTitleText: "内置图库",
  };
  constructor(props) {
    super(props);
    this.state = {
      patternList:[
        // {path:pattern1},
        // {path:pattern2},
        // {path:pattern3},
        // {path:pattern4},
        // {path:pattern5},
        // {path:pattern6},
        // {path:pattern7},
        // {path:pattern8},
        // {path:pattern9},
        // {path:pattern10},
      ],
    };
  }
  componentWillMount () { }

  componentDidMount () {
    var that=this;
    const db = wx.cloud.database();
    db.collection('imgPattern').get().then(res=> {
        that.setState({
          //将从云端获取的数据放到patternList中
          patternList:res.data,
        })
      }
    ).catch(console.error)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handlePattern(path){
    // var that=this;
    //  let pages=Taro.getCurrentPages();
    // console.log(pages[0]);
    // let prevPage=pages[pages.length-2];
    // prevPage.setState({
    //   patternState:path,
    // })
    const app=Taro.getApp();
    app.patternPath=path;
    wx.setStorageSync("patternPath", path)
    wx.navigateBack({delta:1});//返回上一级页面
  }

  render () {
    const {patternList} = this.state;
    return (
      <View className='pattern'>
        <ScrollView scrollY className={"scroll"}>
          {patternList.map((item, i) =>
            <View key={i} className={"patternItem"} onClick={()=>this.handlePattern(item.fileid)}>
              <View className={"patternImg"}>
                <Image className={"img"} src={item.fileid} mode='heightFix'/>
              </View>
            </View>
          )
          }
        </ScrollView>

      </View>
    )
  }
}
