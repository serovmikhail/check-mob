import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { login } from '../services';
import { useStore } from '../store/store';



export default LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const setUser = useStore((state) => state.setUser);
  register = () => {
    if (email == '' || password == '') {
      Alert.alert('Ошибка', 'Заполните все поля')
      return
    }
    login(email, password)
      .then((res) => {
        setUser(res)
        navigation.navigate('Tab')
      })
      .catch((err) => {
        Alert.alert('Ошибка', err.message)
        console.log(err);
      });
  }

  return (
    <View style={styles.cantainer}>
      <Text style={styles.headerTxt}>Добро пожаловать</Text>
      <View style={styles.subView}>
        <Text style={styles.subTxt}>Регистрация</Text>
        <TextInput style={styles.nameInput} placeholder="Почта" onChangeText={(email => { setEmail({ email }) })} />
        <TextInput style={styles.nameInput} placeholder="Имя" onChangeText={(name => { setName({ name }) })} />
        <TextInput secureTextEntry style={styles.nameInput} placeholder="Пароль" onChangeText={(password => { setPassword({ password }) })} />
        <TouchableOpacity style={styles.btn} onPress={register}>
          <Text style={styles.btnTxt}>Регистрация</Text>
        </TouchableOpacity>
        <View style={styles.endView}>
          <Text style={styles.endTxt}>Есть аккаунт?</Text>
          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.loginTxt}>Войти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  cantainer: {
    backgroundColor: '#42bcd1',
    height: '100%',
  },
  subView: {
    backgroundColor: 'white',
    height: 430,
    marginTop: "100%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  headerTxt: {
    fontSize: 40,
    marginLeft: 40,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    marginTop: '40%',
  },
  subTxt: {
    color: 'black',
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  nameInput: {
    height: 40,
    width: 270,
    marginLeft: 40,
    borderBottomWidth: 1,
    marginTop: 30,
  },
  btn: {
    height: 60,
    width: 200,
    backgroundColor: '#42bcd1',
    borderRadius: 20,
    marginLeft: 70,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  endView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  endTxt: {
    fontSize: 15,
    marginTop: 30,
    marginLeft: 60,
    fontWeight: 'bold',
  },
  endBtn: {
    marginRight: 80,
  },
  loginTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
  },
});