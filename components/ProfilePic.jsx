import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../theme';

const ProfilePic = ({ navigation }) => {
  return (
    <View style={styles.ImageContainer}>
      <TouchableOpacity onPress={() => {
        navigation.navigate('Profile');
      }}>
        <Image
          source={require('../assets/user.png')}
          style={styles.Image}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: 40,
    width: 40,
    borderRadius: SPACING.space_12,
    borderWidth: 2,
    borderColor: COLORS.secondaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  Image: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
});

export default ProfilePic;
