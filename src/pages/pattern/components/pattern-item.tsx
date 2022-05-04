import React from 'react'
import { Component } from "@tarojs/taro";
import { View, Image,Button} from '@tarojs/components'
import './pattern-item.scss'

interface PatternProps {
  name?:any;
  num?:any;
  path?:any;
  patternId?:any;
  postId?:any;
  patternIndex?:any;
  postIndex?:any;
}
export default class PatternItem extends Component<PatternProps,any> {

  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  public deletePattern(id){
    this.props.postId(id);
  }

  public editPattern(index){
    this.props.postIndex(index);
  }

  render () {
    const {name,num,path,patternId,patternIndex}=this.props;
    return (
      <View className='pattern-item'>
        <Image className={"pattern-img"} src={path}/>
        <View className={"pattern-name"}>{name}</View>
        <View className={"pattern-num"}>图案组件数量:{num}</View>
        <Button className={"pattern-edit-btn"} onClick={()=>{this.editPattern(patternIndex)}}>编辑</Button>
        <Button className={"pattern-delete-btn"} onClick={()=>{this.deletePattern(patternId)}}>删除</Button>
      </View>
    )
  }
}
