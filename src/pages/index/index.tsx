import React from 'react'
import Taro, { Config,Component} from "@tarojs/taro";
import {Canvas, View, Image, Input,} from "@tarojs/components";
import BottomNavbar from "../../components/bottom-navbar";
import ToolsBar from "../../components/tools-bar";
import delIcon from "./components/img/delete.png"
import scaleIcon from "./components/img/scale.png"
import rotateIcon from "./components/img/rotate.png"
import lockIcon from "./components/img/lock.png"
import unlockIcon from "./components/img/unlock.png"
import downloadIcon from '../../../img/top-bar/download.png'
import uploadIcon from '../../../img/top-bar/upload.png'
import editNameIcon from '../../../img/top-bar/edit.png'
// import pattern1 from'./components/patternstore/pattern1.png'
// import pattern2 from'./components/patternstore/pattern2.png'
// import pattern3 from'./components/patternstore/pattern3.png'
// import pattern4 from'./components/patternstore/pattern4.png'
// import pattern5 from'./components/patternstore/pattern5.png'
// import pattern6 from'./components/patternstore/pattern6.png'
// import pattern7 from'./components/patternstore/pattern7.png'
// import pattern8 from'./components/patternstore/pattern8.png'
// import pattern9 from'./components/patternstore/pattern9.png'
// import pattern10 from'./components/patternstore/pattern10.png'
import whiteBg from "./components/img/white.png"
import './index.scss'

//var ctx=wx.createCanvasContext('drawline');
var windowW=0,windowH=0;
let countName=0;

let defaultCoverImg="cloud://cloud1-5gdlx59w87914e75.636c-cloud1-5gdlx59w87914e75-1311067855/img/degaultItemImg/geometric.png";
let index = 0, // 当前点击图片的index
  items = [{width:0,
    height:0,
    image:whiteBg,
    initImage:'',
    id:0,
    top:0,
    left:0,
    x:0,
    y:0,
    lx:0,
    ly:0,
    _lx:0,
    _ly:0,
    tx:0,
    ty:0,
    anglePre:0,
    r:0,
    scale:0,
    rotate:0,
    active:false,
    _tx:0,
    _ty:0,
    disPtoO:0,
    angleNext:0,
    new_rotate:0,
    angle:0,
    islock:false,
  },], // 图片数组信息
  itemId = 1; // 图片id，用于识别点击图片
let fontNum =0; // 图片数组信息
let restItem=0;
// const hCw = 1.62; // 图片宽高比
// const canvasPre = 1; // 展示的canvas占mask的百分比

export default class Index extends Component<any,any> {

  config: Config = {
    navigationBarTitleText: "画板",
  };
  constructor(props) {
    super(props);
    this.state = {
      index:"panel",//默认路径
      isVisualBar:false,//是否显示工具栏
      tool:'',//工具
      lineWidth:1,//线粗细
      isPen:false,//是否点击pen
      isFont:false,//是否点击编辑字体
      isGraph:false,//是否点击选择图案
      isEdit:false,//是否点击编辑
      isEditName:false,//是否点击编辑名称
      patternPath:'',//内置图库图片路径
      font:"",//字体
      fontValue:"",//编辑的内容
      graphId:0,//简单图形的id
      patternName:'',//图形名称
      itemList:[],
      canvasTemImg:'',
      X:0,
      Y:0,
      S:0,
      R:0,
      patternStoreImg:'',
    };
  }


  componentWillMount () { }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
    this.setState({
      itemList:[],
    })
    //内置图库
    let that=this;
    const app = Taro.getApp();
    let path=app.patternPath;
    wx.cloud.getTempFileURL({//将cloud链接转为http链接
      fileList: [path],
      success: res => {
        // that.setState({
        //   patternStoreImg:res.fileList[0].tempFileURL,
        // })
        wx.downloadFile({
          url:res.fileList[0].tempFileURL,
          success:res1=>{
            let img={url:res1.tempFilePath}
            that.setDropItem(img);
          }
        })
      }
    });

    app.patternPath='';
    //画笔图案
    let penImg=app.penImg;
    let img1={url:penImg}
    if(penImg){
      this.setDropItem(img1);
    }
    app.penImg='';
    //编辑图案
    if(app.globalData.patternItem){
      this.setState({
        itemList:app.globalData.patternItem
      });
      let num=app.globalData.patternNum;
      for(let i=1;i<num;i++){
        items[i]=app.globalData.patternItem[i]
      }
      //console.log(items)
    }
    app.globalData.patternItem=[];
    app.globalData.patternNum=0;
  }

  public getIndex = (index) => {
    this.setState({
      index: index
    });
  };
  public getTool = (tool) => {
    this.setState({
      tool: tool,
    });
  };
  public getFontStyle = (font) => {
    this.setState({
      font: font,
    });
  };

  public getPen=(isPen)=>{
    this.setState({isPen:isPen})
  }

  public getFontInput=(value)=>{
    this.setState({fontValue:value})
    if(value&&this.state.font){
      if(this.state.isFont===true){
        //this.drawFont(ctx,this.state.fontValue,this.state.font,30)
        this.drawFont(value,this.state.font);
      }
    }
    this.setState({
      font:'',
    })

  }

  public getFont=(isFont)=>{
    this.setState({isFont:isFont})
  }

  public getEdit=(isEdit)=>{
    this.setState({isEdit:isEdit});
  }

  public getEditValue=(X,Y,S,R)=>{
    if(items[index].active===false){
      wx.showToast({
        title: '请选择图案！',
        //icon: "success",
        duration:1000,
      })
    }else{
      this.setState({
        X:X,
        Y:Y,
        S:S,
        R:R,
      });
      items[index].left=X;
      items[index].top=Y;
      items[index].scale=S;
      items[index].angle=R;
      this.setState({
        itemList: items
      })
    }
  }

  public getGraphId=(id)=>{
    this.setState({graphId:id})
    if(id!=0){
      this.drawGraph(id);
    }
  }


  public getGraph=(isGraph)=>{
    this.setState({isGraph:isGraph})
  }

  public getLineWidth = (width) => {
    this.setState({
      lineWidth: width,
    });
  };

  public getSystemInfo= () =>{
    wx.getSystemInfo({
      success: function (res) {
        windowW=res.windowWidth;
        windowH=res.windowHeight;
      },
    })
  }

  public downLoadInfo(){
    var that=this;
    wx.downloadFile({
      url: '图片链接',//注意公众平台是否配置相应的域名
      success: function (res) {
        that.setState({
          canvasimgbg: res.tempFilePath
        })
      }
    })
  }

  public drawGraph(id){
    const graph = wx.createCanvasContext('simpleGraph');
    if(id===1){//直线
      graph.moveTo(0,0);
      graph.lineTo(200,200);
      graph.stroke();
      graph.draw();
      console.log("here")
    }
    if (id===2){//三角形
      graph.moveTo(100,20);
      graph.lineTo(0,200);
      graph.moveTo(0,200);
      graph.lineTo(200,200);
      graph.moveTo(200,200);
      graph.lineTo(100,20);
      graph.stroke();
      graph.draw();
    }
    if(id===3){//正方形
      graph.moveTo(0,0);
      graph.lineTo(0,200);
      graph.moveTo(0,200);
      graph.lineTo(200,200);
      graph.moveTo(200,200);
      graph.lineTo(200,0);
      graph.moveTo(200,0);
      graph.lineTo(0,0);
      graph.stroke();
      graph.draw();
    }
    if(id===4){//圆形
      graph.arc(100, 100, 100, 0, 2 * Math.PI);
      graph.stroke();
      graph.draw();
    }
    if(id===5){//心形
      let x = 100;
      let y = 85;
      let a = 6;
      let vertices = [{x:0,y:0},];
      for(let i=0; i<50; i++) {
        var step = i/50*(Math.PI*2);//设置心上面两点之间的角度，具体分成多少份，好像需要去试。
        var vector = {
          x : a*(16 * Math.pow(Math.sin(step), 3)),
          y : a*(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
        }
        vertices.push(vector);
      }
      graph.beginPath();
      graph.translate(x,y);
      graph.rotate(Math.PI);
      for(let i=0; i<50; i++) {
        var vector = vertices[i];
        graph.lineTo(vector.x, vector.y);
      }
      graph.closePath();
      graph.stroke();
      graph.draw();
    }
    if(id===6){//五角星
      let w=200;
      let r1 = w / 2;
      let r2 = r1 / 2;
      let x1,x2,y1,y2;
      graph.translate(r1, r1);
      graph.beginPath();
      for (let i = 0; i < 5; i++) {
        x1 = r1 * Math.cos((54 + i*72)/180*Math.PI);
        y1 = r1 * Math.sin((54 + i*72)/180*Math.PI);
        x2 = r2 * Math.cos((18 + i*72)/180*Math.PI);
        y2 = r2 * Math.sin((18 + i*72)/180*Math.PI);
        graph.lineTo(x2, y2);
        graph.lineTo(x1, y1);
      }
      graph.closePath();
      graph.stroke();
      graph.draw();
    }
    if(id===7){//六边形
      let w=200;
      let r1 = w / 2;
      let x1,y1;
      graph.translate(r1, r1);
      graph.beginPath();
      for (let i = 0; i < 6; i++) {
        x1 = r1 * Math.cos(( i*60)/180*Math.PI);
        y1 = r1 * Math.sin(( i*60)/180*Math.PI);
        graph.lineTo(x1, y1);
      }
      graph.closePath();
      graph.stroke();
      graph.draw();
    }
    let that=this;
    wx.canvasToTempFilePath({     //将canvas生成图片
      canvasId: 'simpleGraph',
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      destWidth: 200,     //截取canvas的宽度
      destHeight: 200,   //截取canvas的高度
      success: function (res) {
        let path={url:''};
        path.url=res.tempFilePath;
        that.setDropItem(path);
      }
    })
  }

  public drawFont(value,font) {
    const context = wx.createCanvasContext('canvas');
    const that = this;
    context.font = 'normal 11px '+font;
    context.setFontSize(60);
    context.fillText(value, 0, 50,300);
    fontNum=value.length;
    context.draw(false, ()=> {
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: res=> {
          // 获得图片临时路径
          //setTimeout(function(){that.setDropItem(res.tempFilePath)},1000);
          let path={url:''};
          path.url=res.tempFilePath;
          that.setDropItem(path)
        }
      })
    });
    this.getSystemInfo();
    context.clearRect(0,0,this.state.windowW,this.state.windowH);
    // let imgPath={url:''};
    // imgPath.url="https://636c-cloud1-5gdlx59w87914e75-1311067855.tcb.qcloud.la/img/fontBg/white.png";
    // console.log(imgPath.url)
    // wx.getImageInfo({
    //   src: imgPath.url,
    //   success:()=>{
    //     //context.drawImage(imgPath.url, 0, 0, 150, 100);
    //   }
    // })

  }


  public chooseImg= () =>{
    var that=this;
    wx.chooseImage({
      success: function (res) {
        //that.canvasDraw(ctx,res.tempFilePaths[0]);
        that.setDropItem({url:res.tempFilePaths[0]});
      },
    })
  }

  // 设置图片的信息
  public setDropItem(imgData) {
    let data = {
      width:0,
      height:0,
      image:'',
      initImage:'',
      id:0,
      top:0,
      left:0,
      x:0,
      y:0,
      lx:0,
      ly:0,
      _lx:0,
      _ly:0,
      tx:0,
      ty:0,
      anglePre:0,
      r:0,
      scale:0,
      rotate:0,
      active:false,
      _tx:0,
      _ty:0,
      disPtoO:0,
      angleNext:0,
      new_rotate:0,
      angle:0,
      islock:false,
    }; // 存储图片信息
    // 获取图片信息，网络图片需先配置download域名才能生效
    wx.getImageInfo({
      src: imgData.url,
      success: res => {
        // 初始化数据
        let maxWidth = 150, maxHeight = 150; // 设置最大宽高
        if (res.width > maxWidth || res.height > maxHeight) { // 原图宽或高大于最大值就执行
          if (res.width / res.height > maxWidth / maxHeight) { // 判断比例使用最大值的宽或高作为基数计算
            data.width = maxWidth;
            data.height = Math.round(maxWidth * (res.height / res.width));
          } else {
            data.height = maxHeight;
            data.width = Math.round(maxHeight * (res.width / res.height));
          }
        }
        data.image = imgData.url; // 显示地址
        data.initImage = imgData.url; // 原始地址
        data.id = itemId++; // id
        data.top = 80; // top定位
        data.left = 30; // left定位
        // 圆心坐标
        data.x = data.left + data.width / 2;
        data.y = data.top + data.height / 2;
        data.scale = 1; // scale缩放
        data.rotate = 1; // 旋转角度
        data.active = false; // 选中状态
        items[items.length] = data;  // 每增加一张图片数据增加一条信息
        this.setState({
          itemList: items
        })
      }
    })
    restItem++;
  }

  // 点击图片
  public WraptouchStart=(e)=> {
  // 循环图片数组获取点击的图片信息
  for (let i = 0; i < items.length; i++) {
    items[i].active = false;
    if (e.currentTarget.dataset.id == items[i].id) {
      index = i;
      items[index].active = true;
    }
  }
  this.setState({
    itemList: items
  })

  // 获取点击的坐标值
  items[index].lx = e.touches[0].clientX;
  items[index].ly = e.touches[0].clientY;
  //console.log(items)
}

  // 拖动图片
  public WraptouchMove(e) {
    if(!items[index].islock) {
      items[index]._lx = e.touches[0].clientX;
      items[index]._ly = e.touches[0].clientY;

      items[index].left += items[index]._lx - items[index].lx;
      items[index].top += items[index]._ly - items[index].ly;
      items[index].x += items[index]._lx - items[index].lx;
      items[index].y += items[index]._ly - items[index].ly;

      items[index].lx = e.touches[0].clientX;
      items[index].ly = e.touches[0].clientY;

      this.setState({
        itemList: items
      })
    }
  }

  // 点击伸缩图标
  public oTouchStart(e) {
    //找到点击的那个图片对象，并记录
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        index = i;
        items[index].active = true;
      }
    }
    //获取作为移动前角度的坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    //移动前的角度
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty);
    //获取图片半径
    items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top);
  }

  public oTouchScale=(e)=> {
    if(items[index].islock===false){
      //记录移动后的位置
      items[index]._tx = e.touches[0].clientX;
      items[index]._ty = e.touches[0].clientY;
      //移动的点到圆心的距离
      items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx, items[index]._ty );
      //console.log(items[index].disPtoO,items[index].r);
      items[index].scale = items[index].disPtoO / items[index].r;
      //赋值setData渲染
      this.setState({
        itemList: items
      })
    }
  }

  public oTouchRotate=(e)=> {
    if(items[index].islock===false) {
      //记录移动后的位置
      items[index]._tx = e.touches[0].clientX;
      items[index]._ty = e.touches[0].clientY;
      //移动后位置的角度
      items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
      //角度差
      items[index].new_rotate = items[index].angleNext - items[index].anglePre;

      //叠加的角度差
      items[index].rotate += items[index].new_rotate;
      items[index].angle = items[index].rotate; //赋值
      //console.log(items[index].angle);
      //用过移动后的坐标赋值为移动前坐标
      items[index].tx = e.touches[0].clientX;
      items[index].ty = e.touches[0].clientY;
      items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)

      //赋值setData渲染
      this.setState({
        itemList: items
      })
    }
  }

  // 计算坐标点到圆心的距离
  getDistancs(cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    return Math.sqrt(
      ox * ox + oy * oy
    );
  }
  /*
   *参数cx和cy为图片圆心坐标
   *参数pointer_x和pointer_y为手点击的坐标
   *返回值为手点击的坐标到圆心的角度
   */
  public countDeg=(cx, cy, pointer_x, pointer_y)=> {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    var to = Math.abs(ox / oy);
    var angle = Math.atan(to) / (2 * Math.PI) * 360;
    if (ox < 0 && oy < 0) //相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系
    {
      angle = -angle;
    } else if (ox <= 0 && oy >= 0) //左下角,3象限
    {
      angle = -(180 - angle)
    } else if (ox > 0 && oy < 0) //右上角，1象限
    {
      angle = angle;
    } else if (ox > 0 && oy > 0) //右下角，2象限
    {
      angle = 180 - angle;
    }
    return angle;
  }

  public handleLock(){

    if(items[index].islock===false){
      items[index].islock=true;
    }
    else{
      items[index].islock=false;
    }
    this.setState({itemList:items})
  }

  deleteItem=(e)=> {
    let newList = [{
      width:0,
      height:0,
      image:'',
      initImage:'',
      id:0,
      top:0,
      left:0,
      x:0,
      y:0,
      lx:0,
      ly:0,
      _lx:0,
      _ly:0,
      tx:0,
      ty:0,
      anglePre:0,
      r:0,
      scale:0,
      rotate:0,
      active:false,
      _tx:0,
      _ty:0,
      disPtoO:0,
      angleNext:0,
      new_rotate:0,
      angle:0,
      islock:false,
    }];
    for (let i = 0; i < items.length; i++) {
      if (e.currentTarget.dataset.id != items[i].id) {
        newList.push(items[i])
      }
    }
    if (newList.length > 0) {
      newList[newList.length - 1].active = true; // 剩下图片组最后一个选中
    }
    items = newList;
    restItem--;
    this.setState({
     itemList: items
    })

  }
  // 放开图片
  public WraptouchEnd() {
    this.synthesis(); // 调用合成图方法
  }

  public synthesis() { // 合成图片
    var ctx=wx.createCanvasContext('drawPic');
    ctx.save();
    ctx.beginPath();
    this.getSystemInfo();
    // 画背景色（白色）
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, windowW, windowH);
    items.forEach((currentValue) => {
      console.log(currentValue.width,currentValue.scale)
      ctx.save();
      ctx.translate(0, 0);
      ctx.beginPath();
      ctx.translate(currentValue.x, currentValue.y); // 圆心坐标
      ctx.rotate(currentValue.angle * Math.PI / 180);
      //console.log(currentValue.angle * Math.PI / 180);
      ctx.translate(-(currentValue.width * currentValue.scale/2 ), -2*(currentValue.height * currentValue.scale/2 ))
      ctx.drawImage(currentValue.image, 0, 0, currentValue.width * currentValue.scale, currentValue.height * currentValue.scale);
      ctx.restore();
    })
    // reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制
    ctx.draw(true, () => {
      setTimeout(()=>{
        wx.canvasToTempFilePath({
          canvasId: 'drawPic',
          // x: 0,
          // y: 0,
          // width: 500,
          // height: 600,
          // destWidth: 500,
          // destHeight: 600,
          success: res => {
            this.setState({
              canvasTemImg: res.tempFilePath
            })
            //console.log(res.tempFilePath)
          }
        }, this);
        },1000
      )
    })
  }


  // 保存图片到系统相册
  public saveImg() {
    console.log(this.state.canvasTemImg)
    wx.saveImageToPhotosAlbum({
      filePath: this.state.canvasTemImg,
      success: ()=> {
        wx.showToast({
          title: '保存成功',
          icon: "success"
        })
      },
      fail: () => {
        wx.openSetting({
          success: settingdata => {
            if (settingdata.authSetting['scope.writePhotosAlbum']) {
             console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
            } else {
              console.log('获取权限失败，给出不给权限就无法正常使用的提示')
            }
          },
          fail: error => {
            console.log(error)
          }
        })
        wx.showModal({
          title: '提示',
          content: '保存失败，请确保相册权限已打开',
        })
      }
    })
  }


  //将图片处理成灰色图像
  public handleBlack_WhiteImg=()=>{
    this.getSystemInfo();
    wx.canvasGetImageData({
      canvasId: 'drawline',
      x: 0,
      y: 0,
      width: Number(windowW),
      height: Number(windowH),
      success(result) {
        let data = result.data;
        console.log(data)
        for (let i = 0; i < result.width * result.height;i++){
          //********************只有这里有区别****************************
          let R = data[i * 4 + 0];
          let G = data[i * 4 + 1];
          let B = data[i * 4 + 2];
          let grey = R * 0.3 + G * 0.59 + B * 0.11;
          if (grey > 125){
            grey=255;
          } else {
            grey = 0;
          }
          data[i * 4 + 0] = grey;
          data[i * 4 + 1] = grey;
          data[i * 4 + 2] = grey;
          //********************只有这里有区别****************************
        }
        wx.canvasPutImageData({
          canvasId: 'drawline',
          x: 0,
          y: 0,
          width: Number(windowW),
          height:Number(windowH),
          data:new Uint8ClampedArray(data),
          success(res) {
            console.log(res)
          }
        })
      }
    })

  }

  //获取画布的点击位置
  public getCanvasPosition(e){
    let X=e.touches[0].x;
    let Y=e.touches[0].y;
    let position={
      x:Number(X),
      y:Number(Y),
    }
    return position;
  }

  public uploadImg(){
    let newList = [{
      width:0,
      height:0,
      image:'',
      initImage:'',
      id:0,
      top:0,
      left:0,
      x:0,
      y:0,
      lx:0,
      ly:0,
      _lx:0,
      _ly:0,
      tx:0,
      ty:0,
      anglePre:0,
      r:0,
      scale:0,
      rotate:0,
      active:false,
      _tx:0,
      _ty:0,
      disPtoO:0,
      angleNext:0,
      new_rotate:0,
      angle:0,
      islock:false,
    }];
    let that=this;
    const app = Taro.getApp();//设为全局对象
    for(let i=that.state.itemList.length-restItem;i<that.state.itemList.length;i++){
      newList.push(that.state.itemList[i]);
    }
    //console.log(that.state.itemList);
    if(app.globalData.userInfo){
      if(this.state.itemList.length>1){
        wx.cloud.database().collection('pattern_list').add({
          data:{
            pattern:newList,
            name:that.state.patternName,
            num:Number(restItem),
            coverImg:String(defaultCoverImg),
          },
          success:()=>{
            wx.showToast({
              title:'图案上传成功'
            })
          }
        })
      }
      else{
        wx.showToast({
          title:'请编辑图案'
        })
      }
    }
    else{
      wx.showToast({
        title:'请授权登录'
      })
    }
  }

  public editName(){
    if(countName%2===0){
      this.setState({
        isEditName:true,
      })
    }
    else{
      this.setState({
        isEditName:false,
      })
    }
    countName++;
  }

  public handleNameInput=e=>{
    this.setState({patternName:e.detail.value,})
  }

  public handleNameConfirm(){
    this.setState({
      isEditName:false,
    });
    countName++;
  }


  render () {
    const {tool,lineWidth,font,graphId,itemList,isEditName,patternName}=this.state;
    return (
      <View className='index'>
        <View className={"contentWarp"}>
          {itemList.map((item,id)=>
            <View className={"touchWrap"} key={id}
                  style={{transform:"scale("+item.scale+")",top:item.top+"px",left:item.left+"px",zIndex:(item.active?100:6)}}>
              <View className={`imgWrap ${item.active? 'touchActive' : ''}`}
                    style={{transform:"rotate("+item.angle+"deg)",border:(item.active?2:0)+"px #fff dashed"}}>
                <View  data-id={item.id} style={{width:item.width+"px",height:item.height+"px"}} onTouchStart={this.WraptouchStart} onTouchMove={this.WraptouchMove} onTouchEnd={this.WraptouchEnd}>
                  <Image className={`${item.active? 'img' : 'no-active-img'}`} src={item.image} data-id={item.id} style={{width:item.width+"px",height:item.height+"px"}} mode={"widthFix"}/>
                </View>
                <View className={""}>
                  <Image className={"x"} src={delIcon} style={{transform:"scale("+1/item.scale+")",transformOrigin:'center'}} data-id={item.id} onClick={this.deleteItem}/>
                </View>
                <View className={""} data-id={item.id}  onTouchStart={this.oTouchStart} onTouchMove={this.oTouchScale} onTouchEnd={this.WraptouchEnd}>
                  <Image className={"o"} src={scaleIcon} data-id={item.id} style={{transform:"scale("+1/item.scale+")",transformOrigin:'center'}}/>
                </View>
                <View className={""} data-id={item.id}  onTouchStart={this.oTouchStart} onTouchMove={this.oTouchRotate} onTouchEnd={this.WraptouchEnd}>
                  <Image className={"r"} src={rotateIcon} data-id={item.id} style={{transform:"scale("+1/item.scale+")",transformOrigin:'center'}}/>
                </View>
                <Image className={"l"} src={(item.islock===true?lockIcon:unlockIcon)} data-id={item.id} style={{transform:"scale("+1/item.scale+")",transformOrigin:'center'}} onClick={()=>this.handleLock()}/>

              </View>
            </View>
          )}
        </View>
        <View className={"top-bar"}>
          <View className={"download"} onClick={this.saveImg}>
            <Image className={"download-img"} src={downloadIcon} />
            <View className={"download-font"}>下载</View>
          </View>
          <View className={"upload"} onClick={this.uploadImg}>
            <Image className={"upload-img"} src={uploadIcon} />
            <View className={"upload-font"}>上传</View>
          </View>
          <View className={"edit-name"} onClick={this.editName}>
            <Image className={"edit-name-img"} src={editNameIcon} />
            <View className={"edit-name-font"}>名称</View>
          </View>
        </View>
        {isEditName&&
          <View className={"edit-input"}>
            <View className={"name-input"}>
              <Input className={"edit-name-input"} placeholder={(patternName?patternName:"请输入名称")} onInput={this.handleNameInput}/>
              <View className={"edit-name-btn"} onClick={this.handleNameConfirm}>确认</View>
            </View>
          </View>
        }
        <Canvas canvasId='drawline' className={"panel"}
                 //onTouchStart={this.handleTouchStart}
                 //onTouchMove={this.handleTouchMove}
                // onTouchEnd={this.handleTouchEnd}
        />
        {/*<Button onClick={this.uploadImg}>上传</Button>*/}
        <View style={{position:"fixed",top:"999999999px"}}>
          <Canvas className={"drawFont"} canvasId='canvas' style={fontNum===0?{width:"180px",height:"60px",visibility:"hidden",}:{width:fontNum*60+"px",height:"60px",visibility:"hidden",}}/>
          <Canvas className={"drawGraph"}canvasId='simpleGraph' style={{border:"border: 2px solid #ef6161",width:"200px",height:"200px",visibility:"hidden",}}/>
          <Canvas className={"drawPic"} canvasId='drawPic' style={{border:"border: 2px solid #ef6161",width:"95vw",height:"60vh",visibility:"hidden",}}/>
        </View>
        <ToolsBar curTool={tool} getTool={this.getTool}
                  getLineWidth={this.getLineWidth}
                  r={100} g={100} b={30}
                  width={lineWidth}
                  TakePhoto={this.chooseImg}
                  isPen={this.getPen}
                  isFont={this.getFont}
                  isGraph={this.getGraph}
                  isEdit={this.getEdit}
                  getFont={this.getFontStyle}
                  curFont={font}
                  postInput={this.getFontInput}
                  postGraph={this.getGraphId}
                  graphId={graphId}
                  postEdit={this.getEditValue}
                  X={items[index].left}
                  Y={items[index].top}
                  S={items[index].scale}
                  R={items[index].angle}
        />
        <BottomNavbar curNav={"index"}/>
      </View>
    )
  }
}
