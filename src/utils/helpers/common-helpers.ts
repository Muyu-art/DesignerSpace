import Taro from "@tarojs/taro";
import { ConfirmModalHelper } from "./confirm-modal-helper";
import WxHelpers from "./wx-helpers";
import dayjs from "dayjs";
import {
  buriedPointSave,
  behaviorRecord,
  behaviorDefinitions,
} from "../service/login";

export default class CommonHelpers {
  /**
   * 保存图片到相册
   * @param imageTempPath
   * @param success
   */
  public static saveImageLogic(imageTempPath: string, success?: Function) {
    const params: any = {
      scope: "scope.writePhotosAlbum",
      fail: () => CommonHelpers.openSetting("保存图片,需要获取您的权限"),
    };
    Taro.getSetting({}).then((res) => {
      if (res.authSetting["scope.writePhotosAlbum"]) {
        CommonHelpers.saveImage(imageTempPath, success);
      } else {
        Taro.authorize(params).then(() => {
          CommonHelpers.saveImage(imageTempPath, success);
        });
      }
    });
  }

  public static getArr = (obj) => {
    const arr = [];
    if (obj) {
      for (let key in obj) {
        arr.push({ attrName: key, attrValue: obj[key] || "" });
      }
    }
    return arr;
  };

  public static shareParams = (pageTitle?, pageId?) => {
    return {
      pageTitle: pageTitle || "依视路页面分享",
      pageId, // 当前页面ID
      elementId: "10077229", // 事件ID
      toPage: "", // 点击前往的页面标题
      toPageId: "", // 要前往页面的ID
    };
  };

  public static getUrlSearch = (params) => {
    let urlSearch = "";
    if (params) {
      for (let key in params) {
        urlSearch = urlSearch + `&${key}=${params[key]}`;
      }
    }
    return urlSearch.slice(1);
  };

  public static buriedPointSave(params) {
    buriedPointSave(params).then((res) => {
      console.log("成功");
    });
  }

  public static srSdk(type, name, more?, params?) {
    const pagesList = Taro.getCurrentPages();
    const currentPage = pagesList[pagesList.length - 1];
    const customerId = Taro.getStorageSync("customerId");
    const openId = Taro.getStorageSync("openId");
    console.log("currentPage:", currentPage);
    const obj = {
      openId, // 小程序用户openid
      customerId, // 会员ID
      attrs: more ? this.getArr(more) : [],
      pageUrl: currentPage.route, // 页面url
      pageParams: this.getUrlSearch(currentPage.options), // 页面参数
    };
    if (params) {
      this.buriedPointSave({ ...obj, ...params });
    }
    // buriedPointSave({...obj, ...params}).then(res => {
    //   console.log('成功')
    // })
    Taro.srSdk.track(type, {
      type: "tap",
      index: 1,
      name,
      page: currentPage.route,
      customerId: customerId || "",
      ...more,
    });
  }

  public static behaviorDefinitions(behaviorCode, pageTitle, obj?) {
    const pagesList = Taro.getCurrentPages();
    const scene = Taro.getStorageSync("scene");
    const currentPage = pagesList[pagesList.length - 1].route;
    console.log("currentPage:", currentPage);
    behaviorDefinitions({}).then((res) => {
      console.log("res：", res);
      const loginItem =
        res &&
        res.length > 0 &&
        res.filter((item) => item.behaviorCode === behaviorCode)[0];
      let params = {
        appName: scene || "依视路",
        behaviorPageUrl: currentPage,
        behaviorPageTitle: pageTitle,
        appId: WxHelpers.getAppId(),
        openId: Taro.getStorageSync("openId"),
        wxOpenId: Taro.getStorageSync("openId"),
        customerId: Taro.getStorageSync("customerId"),
        behaviorId: loginItem && loginItem.behaviorId,
        subjectType: "customer",
        behaviorStartTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      if (obj) {
        params = { ...params, ...obj };
      }
      behaviorRecord(params).then((res) => {
        console.log("行为记录结果:", res);
        Taro.setStorageSync("currentPage", currentPage);
      });
    });
  }

  private static saveImage(imageTempPath: string, success?: Function) {
    Taro.saveImageToPhotosAlbum({ filePath: imageTempPath }).then((res) => {
      if (res.errMsg === "saveImageToPhotosAlbum:ok") {
        //showToast("保存成功");
        success && success();
      }
    });
  }

  public static openSetting(content) {
    ConfirmModalHelper.showModal("提示", content).then(() =>
      Taro.openSetting()
    );
  }

  /**
   * 获取rpx大小
   * @param px
   */
  public static getRpx(px: number) {
    return (px * Taro.getSystemInfoSync().windowWidth) / 375;
  }

  /**
   * 16进制颜色转化为rgba
   * @param str
   * @param opacity
   */
  public static colorRgb(str, opacity) {
    if (!str) return undefined;
    let sColor: string = str.toLowerCase();
    if (sColor) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange: number[] = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
    } else {
      return sColor;
    }
  }

  /**
   * 模糊手机号
   * @param phone
   */
  public static mockPhone = (phone: string) => {
    if (phone && phone.length > 7) {
      let mock = "";
      for (let i = 0; i < phone.length; i++) {
        if (i >= 3 && i <= 6) {
          mock += "*";
        } else {
          mock += phone[i];
        }
      }
      return mock;
    }
    return phone;
  };

  /**
   * 获取头部导航栏高度
   * 用于自定义头部导航时获取高度
   */
  public static getNavBarHeight = () => {
    const systemInfo = Taro.getSystemInfoSync();
    const { statusBarHeight, system } = systemInfo;
    const isIos = system.indexOf("iOS") > -1;
    const vavHeight = isIos ? 44 : 48;
    return statusBarHeight + vavHeight;
  };
  /**
   * 获取oss图片
   */
  public static getOssImg = (params) => {
    const URL = "https://essilor-miniapp.oss-cn-shanghai.aliyuncs.com/img/";
    return URL + params + ".png";
  };
}
