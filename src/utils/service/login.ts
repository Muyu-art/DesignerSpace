import { post } from "@utils/request";
import { handleResponse } from "@utils/helpers/request-helpers";

/**
 * 用户登录
 * @param params
 */
export function login(params) {
  return post("/custom/free/ysl/login", params, "POST", false, false).then(
    handleResponse
  );
}
