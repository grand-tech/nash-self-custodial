import React from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import CarouselCardItem from '../components/CarouselCardItem';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Screen from '../../../app_components/Screen';
import {startScreenData} from '../data';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {Button} from 'react-native-ui-lib';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';

/**
 * Contains the onboarding UI.
 */
const StartScreen = (props: Props) => {
  const isCarousel = React.useRef<ICarouselInstance>(null);
  const maxIndex = startScreenData.length - 1;

  return (
    <Screen>
      <View style={style.container}>
        <Carousel
          vertical={false}
          width={wp('70.0%')}
          height={hp('60.0%')}
          autoPlay={false}
          ref={isCarousel}
          data={startScreenData}
          renderItem={CarouselCardItem}
          style={style.carousel}
        />
        <Button
          outline={true}
          outlineColor={AppColors.light_green}
          size={'small'}
          label={'Next'}
          secondary
          labelStyle={{
            ...FONTS.body1,
          }}
          onPress={() => {
            let x: number = isCarousel.current?.getCurrentIndex() ?? 0;
            if (x === maxIndex) {
              //navigate to next screen.
              props.navigation.navigate('SelectCreateOrRestoreAccount');
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

type StackProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'Start'
>;

const mapStateToProps = (state: RootState) => ({
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & StackProps;

export default connector(StartScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: AppColors.gray,
  },
  carousel: {alignSelf: 'center'},
});
