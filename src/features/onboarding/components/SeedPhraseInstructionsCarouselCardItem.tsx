import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/lib/typescript/types';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {CarouselItem} from './Interfaces';

const cardWidth: number = wp('70%');
const animationHeight: number = hp('30%');

const SeedPhraseInstructionsCarouselCardItem = (
  props: CarouselRenderItemInfo<CarouselItem>,
) => {
  return (
    <View style={styles.container} key={props.index}>
      <Text style={styles.header}>{props.item.title}</Text>
      <Text style={styles.body}>{props.item.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    width: cardWidth,
    paddingBottom: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  lottieAnimation: {
    height: animationHeight,
  },
  header: {
    paddingLeft: 20,
    textAlign: 'center',
    ...FONTS.h4,
    fontWeight: 'bold',
    color: AppColors.light_green,
  },
  body: {
    color: AppColors.black,
    ...FONTS.body2,
    textAlign: 'center',
  },
});

export default SeedPhraseInstructionsCarouselCardItem;
