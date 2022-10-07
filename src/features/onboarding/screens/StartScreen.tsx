import React from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import CarouselCardItem, {carouselData} from '../components/CarouselCardItem';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppButtonProps} from '../../../app_components/DefaultButton';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../../app_components/Screen';

/**
 * Contains the onboarding UI.
 */
export const StartScreen = () => {
  const isCarousel = React.useRef<ICarouselInstance>(null);
  const maxIndex = carouselData.length - 1;
  const navigation = useNavigation();

  return (
    <Screen>
      <View style={style.container}>
        <Carousel
          vertical={false}
          width={wp('70.0%')}
          height={hp('60.0%')}
          autoPlay={false}
          ref={isCarousel}
          data={carouselData}
          renderItem={CarouselCardItem}
          style={style.carousel}
        />
        <AppButtonProps
          title="Next"
          onPress={() => {
            let x: number = isCarousel.current?.getCurrentIndex() ?? 0;
            if (x == maxIndex) {
              //navigate to next screen.
              navigation.navigate('SelectGenerateOrRestoreAccount');
            } else {
              //move to the next item in carousel list.
              isCarousel.current?.next();
            }
          }}
        />
      </View>
    </Screen>
  );
};

const mapStateToProps = (state: RootState) => ({
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: AppColors.gray,
  },
  carousel: {alignSelf: 'center'},
  button: {
    backgroundColor: AppColors.light_green,
  },
});
