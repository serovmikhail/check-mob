import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import ProfilePic from './ProfilePic';


const HeaderBar = ({ title, navigation }) => {
  return (
    <View style={styles.HeaderContainer}>
      <Ionicons
        name="menu"
        color={COLORS.primaryLightGreyHex}
        size={36}
      />
      <Text style={styles.HeaderText}>{title}</Text>
      <ProfilePic navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
});

export default HeaderBar;
