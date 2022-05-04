import React from 'react';
import Taro, { Config,Component } from "@tarojs/taro";
import {Image, Slider, View,Text,ScrollView,Input} from '@tarojs/components'
import './tools-bar.scss'

import camera from '../../img/tool-bar/camera.png';
import cameraCur from '../../img/tool-bar/cameraCur.png';
import photo from '../../img/tool-bar/photo.png';
import photoCur from '../../img/tool-bar/photoCur.png';
import edit from '../../img/tool-bar/edit.png';
import editCur from '../../img/tool-bar/editCur.png';
import pen from '../../img/tool-bar/pen.png';
import penCur from '../../img/tool-bar/penCur.png';
import font from '../../img/tool-bar/font.png';
import fontCur from '../../img/tool-bar/fontCur.png';
import graph from '../../img/tool-bar/graph.png';
import graphCur from '../../img/tool-bar/graphCur.png';
import circle from './simpleGraphImg/circle.png';
import square from './simpleGraphImg/square.png';
import triangle from './simpleGraphImg/triangle.png';
import line from './simpleGraphImg/line.png';
import heart from './simpleGraphImg/heart.png';
import fiveAngle from './simpleGraphImg/five-angle.png';
import sixLine from './simpleGraphImg/six-line.png';

interface ToolsBarProps {
  curTool: any; //当前页面路径
  getTool?:any;
  getLineWidth?:any;
  r?:any;
  g?:any;
  b?:any;
  width?:any;
  TakePhoto?:any;
  isPen?:any;
  isGraph?:any;
  isFont?:any;
  getFont?:any;
  curFont?:any;
  postInput?:any;
  postGraph?:any;
  graphId?:any;
  isEdit?:any;
  postEdit?:any;
  X?:any;
  Y?:any;
  S?:any;
  R?:any;
}
let count1=0;let count2=0;
let count7 = 0;
let count4 = 0;
let count5 = 0;
let count6 = 0;
export default class ToolsBar extends Component<ToolsBarProps, any> {
  static defaultProps = {};
  config: Config = {
    navigationBarTitleText: "首页",
  };

  constructor(props) {
    super(props);
    this.state = {
      isCamera: false,
      isPhoto: false,
      isPatternStore: false,
      isShowSlider: false,
      isShowFont: false,
      isShowGraph: false,
      isShowEdit: false,
      lineWidth: 0,
      toolList: [
        {
          name: "相机",
          icon: camera,
          iconCur: cameraCur,
        },
        {
          name: "内置图案",
          icon: photo,
          iconCur: photoCur,
        },
        {
          name: "文字",
          icon: font,
          iconCur: fontCur,
        },
        {
          name: "画笔",
          icon: pen,
          iconCur: penCur,
        },
        {
          name: "简单图形",
          icon: graph,
          iconCur: graphCur,
        },
        {
          name: "编辑",
          icon: edit,
          iconCur: editCur,
        },
      ],
      fontList:[
        {name:"宋体",value:0},
        {name:"楷体",value:0},
        {name:"黑体",value:0},
        {name:"华文彩云",value:0},
        {name:"华文琥珀",value:0},
        {name:"华文行楷",value:0},
        {name:"华文隶书",value:0},
        {name:"微软雅黑",value:0},
        {name:"华文隶书",value:0},
        {name:"华文新魏",value:0},
        // "黑体",
        // "楷体",
        // "华文彩云",
        // "华文琥珀",
        // "华文行楷",
        // "华文隶书",
        // "微软雅黑",
        // "华文隶书",
        // "华文新魏",
      ],
      fontValue:"",
      font:"",
      graphList:[
        {id:1,path:line},
        {id:2,path:triangle},
        {id:3,path:square},
        {id:4,path:circle},
        {id:5,path:heart},
        {id:6,path:fiveAngle},
        {id:7,path:sixLine},
      ],
      X:0,
      Y:0,
      S:0,
      R:0,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  public allFalse(){
    this.props.getTool('');
  }

  public handleToolBar(name) {
    if (name === "相机") {
      this.getCamera(name);
      this.props.isPen(false);
      this.props.isGraph(false);
      this.props.isFont(false);
      var that=this;
      setTimeout(function(){that.allFalse()},200);
    } else if (name === "内置图案") {
      this.openPatternStore(name);
      this.props.isPen(false);
      this.props.isGraph(false);
      this.props.isFont(false);
      this.props.isEdit(false);
      var that=this;
      setTimeout(function(){that.allFalse()},200);
    } else if (name === "文字") {
      this.SelectFont(name);
      this.props.isPen(false);
      this.props.isGraph(false);
      this.props.isEdit(false);
      var that=this;
      setTimeout(function(){that.allFalse()},200);
    } else if (name === "画笔") {
      this.ToPen(name);
      this.props.isGraph(false);
      this.props.isFont(false);
      this.props.isEdit(false);
      var that=this;
      setTimeout(function(){that.allFalse()},200);
    } else if (name === "简单图形") {
      this.ShowGraph(name);
      this.props.isPen(false);
      this.props.isFont(false);
      this.props.isEdit(false);
    }
    else if (name === "编辑") {
      this.ShowEdit(name);
      this.props.isPen(false);
      this.props.isFont(false);
      this.props.isGraph(false);
    }
  }

  public ToPen(name) {
    if (count1 % 2 === 0) {
      this.setState({
        //isShowSlider: true,
        isCamera: false,
        isPhoto: false,
        isPatternStore: false,
        isShowFont: false,
        isShowGraph: false,
        isShowEdit: false
      });
      count1++;
      count2 = 0;
      count4 = 0;
      count5 = 0;
      count6 = 0;
      count7 = 0;
      this.props.getTool(name);
      this.props.isPen(true);
      Taro.navigateTo({
        url: '/pages/index/pen/pen'
      });
    } else {
      this.setState({isShowSlider: false});
      this.props.getTool('');
      this.props.isPen(false);
      count1--;
    }
  }

  public ToLineWidth(e) {
    this.props.getLineWidth(e.detail.value);
  }


  public getCamera(name) {
    if (count2 % 2 === 0) {
      count2++;
      count1 = 0;
      count4 = 0;
      count5 = 0;
      count6 = 0;
      count7 = 0;
      this.props.getTool(name);
      this.setState({
        isCamera: true,
        isShowSlider: false,
        isPhoto: false,
        isPatternStore: false,
        isShowFont: false,
        isShowGraph: false,
        isShowEdit: false
      });
      this.props.TakePhoto();
      // const ctx=wx.createCameraContext()
      // ctx.takePhoto({
      //   quality:'high',
      //   success:(res)=>{
      //     this.setState({
      //       src:res.tempImagePath
      //     })
      //   }
      // })
    } else {
      count2--;
      this.setState({isCamera: false});
      this.props.getTool('');
    }
  }

  public openPatternStore(name) {
    if (count4 % 2 === 0) {
      this.setState({
        isPatternStore: true,
        isCamera: false,
        isPhoto: false,
        isShowSlider: false,
        isShowFont: false,
        isShowGraph: false,
        isShowEdit: false
      });
      count4++;
      count2 = 0;
      count1 = 0;
      count5 = 0;
      count6 = 0;
      count7 = 0;
      this.props.getTool(name);
      Taro.navigateTo({
        url: '/pages/patternStore/pattern-store'
      });
    } else {
      this.setState({isPatternStore: false});
      count4--;
      this.props.getTool('');
    }
  }

  public SelectFont(name) {
    if (count5 % 2 === 0) {
      this.setState({
        isShowFont: true,
        isCamera: false,
        isPhoto: false,
        isPatternStore: false,
        isShowSlider: false,
        isShowGraph: false,
        isShowEdit: false
      });
      count5++;
      count2 = 0;
      count4 = 0;
      count1 = 0;
      count6 = 0;
      count7 = 0;
      this.props.getTool(name);
      this.props.isFont(true);
    } else {
      this.setState({isShowFont: false});
      count5--;
      this.props.getTool('');
      this.props.isFont(false);
    }
  }

  public ShowGraph(name) {
    if (count6 % 2 === 0) {
      this.setState({
        isShowGraph: true,
        isCamera: false,
        isPhoto: false,
        isPatternStore: false,
        isShowFont: false,
        isShowSlider: false,
        isShowEdit: false
      });
      count6++;
      count2 = 0;
      count4 = 0;
      count5 = 0;
      count1 = 0;
      count7 = 0;
      this.props.getTool(name);
      this.props.isGraph(true);
    } else {
      this.setState({isShowGraph: false});
      count6--;
      this.props.getTool('');
      this.props.isGraph(false);
    }
  }
  public ShowEdit(name){
    this.props.isEdit(true);
    if (count7 % 2 === 0) {
      this.setState({
        isShowGraph: false,
        isCamera: false,
        isPhoto: false,
        isPatternStore: false,
        isShowFont: false,
        isShowSlider: false,
        isShowEdit: true,
      });
      count7++;
      count6 = 0;
      count2 = 0;
      count4 = 0;
      count5 = 0;
      count1 = 0;
      this.props.getTool(name);
      this.props.isEdit(true);
    } else {
      this.setState({isShowEdit: false});
      count7--;
      this.props.getTool('');
      this.props.isEdit(false);
    }
  }


  public handleFont(font){
    this.setState({font:font,})
    this.props.getFont(font);
  }

  public handleInput= e =>{
    this.setState({fontValue:e.detail.value,})
  }

  public submitFont(){
    this.props.getFont(this.state.font);
    this.props.postInput(this.state.fontValue);
    this.setState({isShowFont: false,})
    //console.log(this.state.font,this.state.fontValue)
  }

  public submitEdit(){
    this.props.postEdit(this.state.X,this.state.Y,this.state.S,this.state.R);
    this.setState({isShowEdit: false,})
    //console.log(this.state.font,this.state.fontValue)
  }

  public handleGraph(id){
    //this.setState({font:font,})
    this.props.postGraph(id);
    var that=this;
    setTimeout(function(){that.NullGraph()},200);
  }
  public NullGraph(){
    this.props.postGraph(0);
  }

  public handleInputX= e =>{
    this.setState({X:e.detail.value,})
  }

  public handleInputY= e =>{
    this.setState({Y:e.detail.value,})
  }

  public handleInputS= e =>{
    this.setState({S:e.detail.value,})
  }

  public handleInputR= e =>{
    this.setState({R:e.detail.value,})
  }

  render () {
    const {toolList,isShowSlider,isShowGraph,isShowFont,fontList,graphList,isShowEdit}=this.state;
    const {curTool,width,curFont,graphId,X,Y,S,R}=this.props;
    return (
      <View className='tool'>
        <ScrollView scrollX={true} className='Scroll'>
        {
          toolList.map((item, i) =>
            <View key={i} className={`toolBar_item ${curTool === item.name ? 'active' : ''}`} onClick={()=>this.handleToolBar(item.name)}>
              <View className='toolBar_item-icon'>
                <Image className='toolBar_item-icon-img' src={curTool === item.name ? item.iconCur : item.icon} />
              </View>
              <View className='toolBar_item-text'>{item.name}</View>
            </View>
          )
        }
        </ScrollView>
        {isShowSlider===true&&
          <View className="choose-box">
            <Text className={"pen-title"}>画笔</Text>
            <View className="color-box"
                  style={{backgroundColor:'black',height:width+'px',width:'50vw',borderRadius:'2vh'}} />
            <View className={"slider"}>
              <Text>粗细</Text>
              <Slider min={1} max={30} step={1} show-value="true" activeColor="black" value={width} data-color="r" onChanging={this.ToLineWidth}/>
            </View>
          </View>
        }
        {/*{isCamera&&<Camera device-position="back" flash="off" />}*/}
        {isShowGraph&&
          <View className={"simple-graph"}>
            <ScrollView scrollX={true} className='graph-scroll'>
              {
                graphList.map((item, i) =>
                  <View key={i} className={`graphBar_item ${graphId === item.id ? 'active' : ''}`} onClick={()=>this.handleGraph(item.id)}>
                    <View className='graphBar_item-icon'>
                      <Image className='graphBar_item-icon-img' src={item.path} />
                    </View>
                  </View>
                )
              }
            </ScrollView>
          </View>
        }
        {isShowFont&&
          <View className={"select-font"}>
            <Text className={"cancel"} onClick={()=>this.SelectFont("文字")}>取消</Text>
            <Text className={"font-title"}>编辑</Text>
            <Text className={"submit"} onClick={()=>this.submitFont()}>确认</Text>
            <View className={"input"}>
              <View className='pen-icon'>
                <Image className='pen' src={pen} />
              </View>
              <Input className={"font-input"} placeholder={"请在此编辑"} onInput={this.handleInput}/>
            </View>
            <ScrollView scrollY className={"font-select"}>
              {
                fontList.map((item, i) =>
                  <View key={i} className={`font-item ${curFont === item.name ? 'active' : ''}`} onClick={()=>this.handleFont(item.name)}>
                    <View className={"font-picker"}>{item.name}</View>
                  </View>
                )
              }
            </ScrollView>
          </View>
        }
        {isShowEdit&&
          <View className={"show-edit"}>
            <Text className={"cancel"} onClick={()=>this.ShowEdit("编辑")}>取消</Text>
            <Text className={"edit-title"}>编辑</Text>
            <Text className={"submit"} onClick={()=>this.submitEdit()}>确认</Text>
            <ScrollView scrollY className={"edit-scroll"}>
              <View className={"input"}>
                <Text>X:</Text>
                <Input className={"font-input"} placeholder={X} onInput={this.handleInputX}/>
              </View>
              <View className={"input"}>
               <Text>Y:</Text>
               <Input className={"font-input"} placeholder={Y} onInput={this.handleInputY}/>
              </View>
              <View className={"input"}>
                <Text>S:</Text>
                <Input className={"font-input"} placeholder={S} onInput={this.handleInputS}/>
              </View>
              <View className={"input"}>
                <Text>R:</Text>
                <Input className={"font-input"} placeholder={R} onInput={this.handleInputR}/>
              </View>
            </ScrollView>
          </View>
        }
      </View>
    )
  }
}
