import { atom } from "recoil";

export const orderState = atom({
  key: "orderState",
  default: [],
});

export const couriersState = atom({
  key: "couriersState",
  default: [],
});
