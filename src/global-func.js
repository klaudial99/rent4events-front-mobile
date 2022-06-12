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
  mapOrderStatusName(status) {
    if (status === "PENDING") return "Oczekujące";
    else if (status === "ACCEPTED") return "Zaakceptowane";
    else if (status === "REJECTED") return "Odrzucone";
    else if (status === "CANCELLED") return "Anulowane";
    else if (status === "EDITED") return "Edytowane";
    else if (status === "IN_NEGOTIATIONS") return "W trakcie negocjacji";
    else if (status === "FOR_REALISATION") return "Do realizacji";
    else if (status === "IN_REALISATION") return "W trakcie realizacji";
  },
  mapResultForm(counter) {
    if (counter === 1) return "wynik";
    else if (counter === 12 || counter === 13 || counter === 14)
      return "wyników";
    else if ([2, 3, 4].includes(parseInt(String(counter).slice(-1)))) {
      return "wyniki";
    } else return "wyników";
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
  datepickerRangeFormat(date) {
    const dayStart = date[0].getDate();
    let monthStart = date[0].getMonth() + 1;
    if (monthStart < 10) monthStart = 0 + monthStart.toString();
    const yearStart = date[0].getFullYear();

    const dayEnd = date[1].getDate();
    let monthEnd = date[1].getMonth() + 1;
    if (monthEnd < 10) monthEnd = 0 + monthEnd.toString();
    const yearEnd = date[1].getFullYear();

    return `${dayStart}/${monthStart}/${yearStart} - ${dayEnd}/${monthEnd}/${yearEnd}`;
  },
  formatFilters(filters) {
    let filtersFormatted = [];
    for (const key in filters) {
      if (filters[key] !== "") {
        if (key === "name")
          filtersFormatted.push(key + "=*" + filters[key] + "/i");
        else filtersFormatted.push(key + "=" + filters[key]);
      }
    }
    return filtersFormatted.join();
  },
  getPhotoSource(imageName) {
    return "https://rent-4-events.s3.eu-central-1.amazonaws.com/" + imageName;
  },
  formatPrice(price) {
    return price.toFixed(2);
  },
};
