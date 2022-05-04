import React from 'react'
import Taro, { Config,Component} from "@tarojs/taro";
import {Canvas, View, Button, Text, Slider} from "@tarojs/components";
import './pen.scss'

let pen=wx.createCanvasContext('pen',this);
let windowW=0,windowH=0;
export default class Pen extends Component<any,any> {
  static defaultProps = {

  };
  config: Config = {
    navigationBarTitleText: "画笔 ",
  };

  constructor(props) {
    super(props);
    this.state = {
      isPen:false,//是否点击pen
      lineWidth:1,//线粗细
      prevPosition:[],//已经经过的点
      movePosition:[],//移动的路径
      canvasHeightLen:0,
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  public getPen=(isPen)=>{
    this.setState({isPen:isPen})
  }

  public handleTouchStart(options){
      this.setState({
        canvasHeightLen:0,
        prevPosition:[options.touches[0].x,options.touches[0].y],
        movePosition:[options.touches[0].x,options.touches[0].y],
      });
  }

  public handleTouchMove(e){
      const { r, g, b,prevPosition, movePosition, eraser, lineWidth, } = this.state;
      let color=`rgb(${r},${g},${b})`;
      let width=lineWidth;
      if (eraser) { //橡皮擦除
        pen.clearRect(e.touches[0].x, e.touches[0].y, 30, 30);
        pen.draw();
        return;
      }
      const [pX, pY, cX, cY] = [...prevPosition, e.touches[0].x, e.touches[0].y];
      const drawPosition = [(cX+pX)/2 ,(cY+pY)/2, cX ,cY];
      pen.setLineWidth(width);
      pen.setStrokeStyle(color);
      pen.setLineCap('round');
      pen.setLineJoin('round');
      pen.moveTo(...movePosition);
      pen.quadraticCurveTo(...drawPosition);
      pen.stroke();
      pen.draw(true);
      //console.log(prevPosition,movePosition)
      this.setState({
        movePosition:[e.touches[0].x, e.touches[0].y],
        prevPosition:[e.touches[0].x, e.touches[0].y],
      })
  }

  public ToLineWidth(e){
    this.setState({lineWidth:e.detail.value});
  }

  public getSystemInfo= () =>{
    wx.getSystemInfo({
      success: function (res) {
        windowW=res.windowWidth;
        windowH=res.windowHeight;
      },
    })
  }

  public handlePen(){
    this.getSystemInfo();
    wx.canvasToTempFilePath({     //将canvas生成图片
      canvasId: 'pen',
      x: 0,
      y: 0,
      width: Number(windowW),
      height: Number(windowH)*0.6,
      destWidth: Number(windowW),     //截取canvas的宽度
      destHeight: Number(windowH)*0.6,   //截取canvas的高度
      success: function (res) {
        const app=Taro.getApp();
        app.penImg=res.tempFilePath;
        console.log(res.tempFilePath)
        wx.setStorageSync("penImg", res.tempFilePath)
        wx.navigateBack({delta:1});//返回上一级页面
      }
    })
  }

  render(){
    const {lineWidth}=this.state;
    return(
      <View className='pen-panel'>
        <Canvas canvasId='pen' className={"panel"}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
        />
        <View className="choose-box">
          <Text className={"pen-title"}>画笔</Text>
          <View className="color-box"
                style={{backgroundColor:'black',height:lineWidth+'px',width:'50vw',borderRadius:'2vh'}} />
          <View className={"slider"}>
            <Text>粗细</Text>
            <Slider min={1} max={30} step={1} show-value="true" activeColor="black" value={lineWidth} data-color="r" onChanging={this.ToLineWidth}/>
          </View>
        </View>
        <Button className={"pen-btn"} onClick={this.handlePen}>确认</Button>
      </View>
    )
  }

}
