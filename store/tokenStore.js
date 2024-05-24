import AsyncStorage from '@react-native-async-storage/async-storage';

// Сохранение токена
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', JSON.stringify(token));
  } catch (e) {
    // saving error
    console.error('Failed to save the token to the storage', e);
  }
}

// Получение токена
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token !== null ? JSON.parse(token) : null;
  } catch (e) {
    // read error
    console.error('Failed to fetch the token from storage', e);
  }
}

// Удаление токена
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (e) {
    // remove error
    console.error('Failed to remove the token from storage', e);
  }
}
