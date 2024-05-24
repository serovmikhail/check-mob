import $api from "../config";

export async function getOrders() {
  const response = await $api.get('/order/getorders')
  console.log(response.data, 'response.data')
  return response.data
}

export async function addOrder(order) {
  console.log(order, 'order')
  console.log({
    cars: order.CartList,
    price: order.CartListPrice,
  }, 'CartList')
  const response = await $api.post('/order/createorder', {
    cars: order.CartList,
    price: order.CartListPrice,
  })

  return response.data
}