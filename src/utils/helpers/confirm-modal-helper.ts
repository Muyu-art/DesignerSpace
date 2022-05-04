import Taro from "@tarojs/taro";

export class ConfirmModalHelper {
  public static showModal(title, content) {
    return new Promise((resolve, reject) => {
      Taro.showModal({
        title,
        content,
      })
        .then((res) => {
          const { confirm } = res;
          return confirm ? resolve() : reject();
        })
        .catch(() => reject());
    });
  }
}
