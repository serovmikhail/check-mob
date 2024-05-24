import $api from "../config";

export async function getCars() {
  const cars = await $api.get('/car/getcars')
  return cars.data
}

export async function getCar(id) {
  const car = await $api.post(`/car/getcar`, { id })
  return car.data
}

export async function addCar(car) {
  const newCar = await $api.post(`/car/createcar`, car)
  return newCar
}

export async function editCar(car) {
  const newCar = await $api.post(`/car/editcar`, car)
  return newCar
}

export async function deleteCar(id) {
  const car = await $api.post(`/car/deletecar`, { id })
  return car
}