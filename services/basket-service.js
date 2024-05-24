import $api from "../config";


export async function editBasket(item) {
  const response = await $api.post("/basket/editbasket", {
    cars: item
  })
  return response.data
}

export async function getBasket() {
  const response = await $api.get("/basket/getbasket")
  return response.data
}