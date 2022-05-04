import Taro from "@tarojs/taro";
import { BUSINESS_SUCCESS_CODE, LOGIN_EXPIRED } from "@utils/const";
import { showToast } from "./toast-helpers";
import isEmpty from "lodash/isEmpty";

export type Response<T = any> = {
  returnCode: string;
  returnMsg: string;
  returnContent: T;
};

export function handleResponse<T>(
  data: Response<T>,
  isNeedShowMsg = false,
  isNeedShowErrMsg = true
): any {
  const { returnCode, returnContent, returnMsg } = data;

  if (returnCode == BUSINESS_SUCCESS_CODE) {
    if (isNeedShowMsg && returnMsg) {
      console.log(returnMsg, "returnMsg");
      showToast(returnMsg, "success");
    }
    return returnContent;
  } else if (LOGIN_EXPIRED == returnCode) {
    Taro.setStorageSync("token", "");
    // Taro.setStorageSync("sessionKey", "");
    const pageList = Taro.getCurrentPages();
    const currentPage = pageList[pageList.length - 1].route;
    const currentPageQuery = pageList[pageList.length - 1].options;
    const keys = Object.keys(currentPageQuery);
    let search = ``;
    if (!isEmpty(keys)) {
      search += "?";
      keys.forEach(
        (key, index) =>
          (search += `${key}=${currentPageQuery[key]}${
            index === keys.length - 1 ? "" : "&"
          }`)
      );
    }
    Taro.redirectTo({ url: `/${currentPage}${search}` });
    return Promise.reject(data);
  } else {
    if (isNeedShowErrMsg) {
      showToast(returnMsg || "网络异常！");
    }
    return Promise.reject(data);
  }
}
