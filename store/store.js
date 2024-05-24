import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoData from '../data/AutoData';
import LatestAutoData from '../data/LatestAutoData';
import { addOrder, editBasket } from '../services';


export const validateImageLinks = (item) => {
  if (typeof item.imagelink_square !== 'string') {
    item.imagelink_square = String(item.imagelink_square);
  }
  if (typeof item.imagelink_portrait !== 'string') {
    item.imagelink_portrait = String(item.imagelink_portrait);
  }
  return item;
};

export const useStore = create(
  persist(
    (set, get) => {
      return {
        user: null,
        // LatestCarsList: LatestAutoData,
        LatestCarsList: [],
        CartPrice: 0,
        FavoritesList: [],
        CartList: [],
        Cart: {},
        OrderHistoryList: [],
        // AutoList: AutoData.map(validateImageLinks),
        AutoList: [],
        resetAutoList: () =>
          set(
            produce(state => {
              state.AutoList = AutoData;
            }),
          ),
        setOrderHistoryList: (OrderHistoryList) => {
          set(
            produce(state => {
              state.OrderHistoryList = OrderHistoryList;
            }),
          )
        },
        setAutoList: (AutoList) =>
          set(
            produce(state => {
              state.AutoList = AutoList;
              state.LatestCarsList = AutoList.filter(car => car?.isNew === true);
            })
          ),
        setUser: (user) => set({ user }),
        setCartList: (cartList) => set(
          produce(state => {
            state.CartList = cartList;
          }
          )),
        setCart: (cart) => set(
          produce(state => {
            state.Cart = cart;
          }
          )),

        addToCart: async (cartItem) => {
          set(
            produce(state => {
              let found = false;
              const isHereIndex = state.CartList.findIndex(item => item._id == cartItem._id);
              if (isHereIndex >= 0) {
                found = true;
                const cartItemIndexed = state.CartList[isHereIndex]
                const isSize = cartItemIndexed.prices.findIndex(price => price.size == cartItem.prices[0].size)
                if (isSize >= 0) cartItemIndexed.prices[isSize].quantity++;
                else cartItemIndexed.prices.push(cartItem.prices[0]);
                cartItemIndexed.prices.sort((a, b) => {
                  if (a.size > b.size) {
                    return -1;
                  }
                  if (a.size < b.size) {
                    return 1;
                  }
                  return 0;
                });
                state.CartList[isHereIndex] = cartItemIndexed
              }
              if (found == false) {
                state.CartList.push(cartItem);
              }
              // console.log("after: ", state.CartList, state.CartList[0].prices);
            }),
          )
          await editBasket(get().CartList);
        },
        calculateCartPrice: async () => {
          set(
            produce(state => {
              let totalprice = 0;
              for (let i = 0; i < state.CartList.length; i++) {
                let tempprice = 0;
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  tempprice =
                    tempprice +
                    parseFloat(state.CartList[i].prices[j].price) *
                    state.CartList[i].prices[j].quantity;
                }
                state.CartList[i].ItemPrice = tempprice.toFixed(2).toString();
                totalprice = totalprice + tempprice;
              }
              state.CartPrice = totalprice.toFixed(2).toString();
            }),
          )
          await editBasket(get().CartList);
        },
        addToFavoriteList: (id) =>
          set(
            produce(state => {
              state.AutoList.map(item => {
                if (item._id == id) {
                  item.favourite = true;
                  state.FavoritesList.unshift(item);
                }
              })
            }),
          ),
        deleteFromFavoriteList: (id) =>
          set(
            produce(state => {
              state.AutoList.map(item => {
                if (item._id == id) {
                  item.favourite = false;
                }
              })
              let spliceIndex = -1;
              for (let i = 0; i < state.FavoritesList.length; i++) {
                if (state.FavoritesList[i]._id == id) {
                  spliceIndex = i;
                  break;
                }
              }
              state.FavoritesList.splice(spliceIndex, 1);
            }),
          ),
        incrementCartItemQuantity: async (id, size) => {
          set(
            produce(state => {
              console.log("CartList before increment: ", state.CartList, id, size);
              const index = state.CartList.findIndex(item => item._id == id);
              console.log("CartList index: ", index);
              if (index >= 0) {
                console.log("CartList index: ", index);
                const cartItemIndexed = state.CartList[index].prices.findIndex(price => price.size == size);
                if (cartItemIndexed >= 0) {
                  console.log("cartItemIndexed: ", cartItemIndexed);
                  state.CartList[index].prices[cartItemIndexed].quantity++;
                }
              }
            }),
          )
          console.log("CartList after increment: ", get().CartList);
          await editBasket(get().CartList);
        },
        decrementCartItemQuantity: async (id, size) => {
          set(
            produce(state => {
              for (let i = 0; i < state.CartList.length; i++) {
                if (state.CartList[i]._id == id) {
                  for (let j = 0; j < state.CartList[i].prices.length; j++) {
                    if (state.CartList[i].prices[j].size == size) {
                      if (state.CartList[i].prices.length > 1) {
                        if (state.CartList[i].prices[j].quantity > 1) {
                          state.CartList[i].prices[j].quantity--;
                        } else {
                          state.CartList[i].prices.splice(j, 1);
                        }
                      } else {
                        if (state.CartList[i].prices[j].quantity > 1) {
                          state.CartList[i].prices[j].quantity--;
                        } else {
                          state.CartList.splice(i, 1);
                        }
                      }
                      break;
                    }
                  }
                }
              }
            }),
          )
          await editBasket(get().CartList);
        },
        addToOrderHistoryListFromCart: async () => {
          set(
            produce(state => {
              let temp = state.CartList.reduce(
                (accumulator, currentValue) =>
                  accumulator + parseFloat(currentValue.ItemPrice),
                0,
              );
              const item = {
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                CartList: state.CartList,
                CartListPrice: temp.toFixed(2).toString(),
              }
              if (state.OrderHistoryList.length > 0) {
                state.OrderHistoryList.unshift(item);
              } else {
                state.OrderHistoryList.push(item);
              }
              state.CartList = [];
            }),
          )
          await editBasket(get().CartList);
          const orderitem = get().OrderHistoryList[0]
          console.log('orderitem', orderitem)
          await addOrder(orderitem)
        },
      }
    },
    {
      name: 'automobile',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // console.log('Rehydrated state:');
      },
      version: 1,
      migrate: (persistedState, version) => {
        // console.log('Migrating state...');
        return persistedState;
      },
    },
  ),
);
