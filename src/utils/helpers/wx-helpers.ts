import Taro from "@tarojs/taro";
import { hideLoading, showLoading} from "./toast-helpers";
// import fs from "fs"

export default class WxHelpers {
  public static getAppId() {
    const appId = Taro.getStorageSync("appId");
    if (appId) {
      return appId;
    } else {
      const account = Taro.getAccountInfoSync();
      const { miniProgram } = account;
      Taro.setStorageSync("appId", miniProgram.appId);
      return miniProgram.appId;
    }
  }


  public static checkVersionAndUpdate() {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        Taro.showModal({
          title: "提示",
          content: "检测到新版本，是否更新？",
          confirmText: "确定",
          confirmColor: "#446429",
          cancelText: "取消",
          cancelColor: "#999999",
          showCancel: true,
        }).then(() => {
          showLoading();
          updateManager.onUpdateReady(() => {
            updateManager.applyUpdate();
            hideLoading();
          });
        });
      }
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        Taro.showModal({
          title: "提示",
          content: "下载新版本失败，是否重试？",
          confirmText: "重试",
          confirmColor: "#446429",
          cancelText: "取消",
          cancelColor: "#999999",
          showCancel: true,
        }).then(() => {
          showLoading();
          updateManager.onUpdateReady(() => {
            updateManager.applyUpdate();
            hideLoading();
          });
        });
      });
    });
  }
}
