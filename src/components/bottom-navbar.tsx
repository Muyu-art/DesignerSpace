import React from 'react'
import Taro,{Component} from "@tarojs/taro";
import { View,Image } from '@tarojs/components'
import panel from '../../img/bottom-navbar/panel.png'
import panelCur from '../../img/bottom-navbar/panelCur.png'
import pattern from '../../img/bottom-navbar/pattern.png'
import patternCur from '../../img/bottom-navbar/patternCur.png'
import personal_center from '../../img/bottom-navbar/personal-center.png'
import personal_centerCur from '../../img/bottom-navbar/personal-centerCur.png'
import './bottom-navbar.scss'

interface NavBarProps {
  curNav: any; //当前页面路径
  parent?: any;//获取点击路径
}
export default class BottomNavbar extends Component<NavBarProps,any> {

  constructor(props) {
    super(props);
    this.state = {
      navList:[
        {
          name:"画板",
          url:"index",
          icon:panel,
          iconCur:panelCur,
        },
        {
          name:"作品",
          url:"pattern",
          icon:pattern,
          iconCur:patternCur,
        },
        {
          name:"我的",
          url:"personal-center",
          icon:personal_center,
          iconCur:personal_centerCur,
        },
      ],
    };
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  public ToIndex(url) {
    this.props.parent(url);
  }

  goRedirectTo(url){
    if(url !== this.props.curNav){
      Taro.redirectTo({
        url: '/pages/' + url +'/'+ url
      });
      //this.goRedirectTo.bind(this, item.url)
    }
  }

  render () {
    const{curNav}=this.props;
    const{navList}=this.state;
    return (
      <View className='navBar'>
        {
          navList.map((item, i) =>
            <View key={i} className={`navBar_item ${curNav === item.url ? 'active' : ''}`} onClick={this.goRedirectTo.bind(this, item.url)}>
              <View className='navBar_item-icon'>
                <Image className='navBar_item-icon-img' src={curNav === item.url ? item.iconCur : item.icon} />
              </View>
              <View className='navBar_item-text'>{item.name}</View>
            </View>
          )
        }
      </View>
    )
  }
}

