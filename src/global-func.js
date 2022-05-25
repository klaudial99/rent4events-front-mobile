// import axios from "axios";
import moment from "moment";

export const global_func = {
  getErrorCode(message) {
    return message.split(":")[0];
  },
  mapVehicleTypeName(type) {
    if (type === "BUS") return "Bus";
    else if (type === "TRUCK") return "Samochód ciężarowy";
  },
  mapVehicleStatusName(status) {
    if (status === "WORKING") return "Sprawny";
    else if (status === "AT_WORKSHOP") return "W naprawie";
    else if (status === "NOT_WORKING") return "Niesprawny";
  },
  formatDate(date) {
    if (date) {
      return moment(String(date)).format("DD/MM/YYYY");
    }
  },
  datepickerFormat(date) {
    const day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) month = 0 + month.toString();
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  },
};
