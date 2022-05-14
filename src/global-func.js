// import axios from "axios";

export const global_func = {
  getErrorCode(message) {
    return message.split(":")[0];
  },
};
