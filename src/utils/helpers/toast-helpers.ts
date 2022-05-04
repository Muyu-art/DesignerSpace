import Taro from "@tarojs/taro";

export function showToast(title = "", icon = "none", duration = 2000, image?) {
  // @ts-ignore
  Taro.showToast({ title, icon, duration, image });
}

export function hideToast() {
  Taro.hideToast();
}

export function showLoading(title = "加载中...", mask = false) {
  Taro.showLoading({ title, mask });
}

export function hideLoading() {
  Taro.hideLoading();
}
