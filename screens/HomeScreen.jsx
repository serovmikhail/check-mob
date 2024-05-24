import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { FlatList } from 'react-native';
import AutoCard from '../components/AutoCard';
import { Dimensions } from 'react-native';
import { getCars, refresh } from '../services';
import { getBasket } from '../services';

const getCategoriesFromData = (data) => {
  let temp = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].type] == undefined) {
      temp[data[i].type] = 1;
    } else {
      temp[data[i].type]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('Все');
  return categories;
};

const getAutoList = (category, data) => {
  if (category == 'Все') return data;
  return data.filter((item) => item.type == category);
};

const HomeScreen = ({ navigation }) => {
  const AutoList = useStore((state) => state.AutoList);
  const LatestCarsList = useStore((state) => state.LatestCarsList);
  const addToCart = useStore((state) => state.addToCart);
  const calculateCartPrice = useStore((state) => state.calculateCartPrice);
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const setAutoList = useStore((state) => state.setAutoList);
  const setCartList = useStore((state) => state.setCartList);
  const setCart = useStore((state) => state.setCart);
  const cart = useStore((state) => state.Cart);
  useEffect(() => {
    if (user == null) navigation.push('Login');
  }, [user])

  useEffect(() => {
    refresh()
      .then((res) => {
        if (!res) {
          navigation.push('Login');
        }
        setUser(res);
      })
      .catch((err) => {
        navigation.push('Login');
      })
    getCars().then((res) => {
      if (res) {
        setAutoList(res);
      }
    })
    getBasket().then((data) => {
      console.log('data1', data)
      setCartList(data.cars)
      setCart(data)
    }).catch((err) => {
      console.log(err)
      Alert.alert('Произошла ошибка при загрузке корзины', 'Повторите позже')
    })
  }, [])

  const [categories, setCategories] = useState(
    getCategoriesFromData(AutoList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCars, setSortedCars] = useState(
    getAutoList(categoryIndex.category, AutoList),
  );

  const ListRef = useRef();
  const tabBarHeight = useBottomTabBarHeight();

  const searchAuto = (search) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({ index: 0, category: categories[0] });
      setSortedCars([
        ...AutoList.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
    if (search.length == 0) {
      resetSearchAuto();
    }
  };

  const resetSearchAuto = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({ index: 0, category: categories[0] });
    setSortedCars([...AutoList]);
    setSearchText('');
  };

  const carCardAddToCart = (car) => {
    // console.log(cart, 'before')
    addToCart(car);
    // console.log(cart, 'after')
    calculateCartPrice();
    let m = `${car.name} добавлен в корзину`;
    "ios" === Platform.OS ?
      Toast.show(m, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER, // Например, 200 пикселей от верха экрана
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      })
      : ToastAndroid.show(m, ToastAndroid.SHORT);
    if (Platform.OS == 'android') {
      ToastAndroid.showWithGravity(
        `${car.name} добавлен в корзину`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <HeaderBar title="Главная" navigation={navigation} />

        <Text style={styles.ScreenTitle}>
          Здесь вы найдете {'\n'}свой автомобиль мечты
        </Text>

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              searchAuto(searchText);
            }}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Поиск товара..."
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchAuto(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearchAuto();
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}>
          {categories.map((data, index) => (
            <View
              key={index.toString()}
              style={styles.CategoryScrollViewContainer}>
              <TouchableOpacity
                style={styles.CategoryScrollViewItem}
                onPress={() => {
                  ListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                  setCategoryIndex({ index: index, category: categories[index] });
                  setSortedCars([
                    ...getAutoList(categories[index], AutoList),
                  ]);
                }}>
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index == index
                      ? { color: COLORS.primaryOrangeHex }
                      : {},
                  ]}>
                  {data}
                </Text>
                {categoryIndex.index == index ? (
                  <View style={styles.ActiveCategory} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <FlatList
          ref={ListRef}
          horizontal
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.CategoryText}>Нет доступных товаров</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={sortedCars}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    index: item._id,
                    id: item._id,
                    type: item.type,
                  });
                }}>
                <AutoCard
                  item={item}
                  buttonPressHandler={carCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />
        <Text style={styles.NewItemsTitle}>Новые модели</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={LatestCarsList}
          contentContainerStyle={[
            styles.FlatListContainer,
            { marginBottom: tabBarHeight },
          ]}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    index: item._id,
                    id: item._id,
                    type: item.type,
                  });
                }}>
                <AutoCard
                  item={item}
                  buttonPressHandler={carCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    paddingTop: 20
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    padding: 10
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  NewItemsTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});

export default HomeScreen;
