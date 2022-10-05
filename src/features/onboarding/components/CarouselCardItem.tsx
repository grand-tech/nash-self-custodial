import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/lib/typescript/types';
import Lottie, {AnimationObject} from 'lottie-react-native';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FONTS} from '../../../ui_lib_configs/fonts';

const cardWidth: number = wp('70%');
const animationHeight: number = hp('30%');

/**
 * Screen component properties.
 * @typedef {Object} ScreenComponentProps properties expected by the screen component.
 * @property { React.ReactNode } childComponents the components to be rendered on the constructed screen.
 * @property { any } statusBarColor
 * @property { {} } style the additional stylings of the screen.
 */
export interface CarouselItem {
  title: string;
  body: string;
  lottieAnimation: AnimationObject;
}

/**
 * Card  component properties.
 * @typedef {Object} CarouselCardItemProps properties expected by the screen component.
 * @property { CarouselItem } item the carousel item type..
 * @property { number } statusBarColor
 * @property { {} } index the index of the displayed item in the array of items.
 */
export interface CarouselCardItemProps {
  item: CarouselItem;
  index: number;
}

export const carouselData: Array<CarouselItem> = [
  {
    title: 'Easy',
    body: 'Wakala makes it easy for you to top up your cUSD wallet. Both Add or withdraw cUSD',
    lottieAnimation: require('../../../../assets/lottie_animations/easy.json'),
  },
  {
    title: 'Speed',
    body: 'Post a request, will get answered SUPER FAST, by community a member of the community.',
    lottieAnimation: require('../../../../assets/lottie_animations/speed.json'),
  },
  {
    title: 'Earn',
    body: 'Want to be a community yourself? Fullfill requests and earn a profit. the faster you fulfill, the more you earn.',
    lottieAnimation: require('../../../../assets/lottie_animations/earn_money.json'),
  },
];

const CarouselCardItem = (props: CarouselRenderItemInfo<CarouselItem>) => {
  return (
    <View style={styles.container} key={props.index}>
      <Lottie
        source={props.item.lottieAnimation}
        style={styles.lottieAnimation}
        autoPlay={true}
        loop={true}
      />
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
    ...FONTS.body4,
    fontWeight: 'bold',
    color: AppColors.light_green,
  },
  body: {
    color: AppColors.black,
    ...FONTS.body2,
    textAlign: 'center',
  },
});

export default CarouselCardItem;
