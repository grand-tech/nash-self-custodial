import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../../app_components/Screen';
import SeedPhraseInstructionsCarouselCardItem from '../components/SeedPhraseInstructionsCarouselCardItem';
import {seedPhraseInstructions} from '../data';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {Button} from 'react-native-ui-lib';
import {NashCache} from '../../../utils/cache';
import {getStoredMnemonic} from '../sagas/auth.utils';

/**
 * Contains the onboarding UI.
 */
const SetUpSeedPhraseInstructions = () => {
  const isCarousel = React.useRef<ICarouselInstance>(null);
  const maxIndex = seedPhraseInstructions.length - 1;
  const navigation = useNavigation();
  const [buttonText, setButtonText] = useState('Next');

  const onPressNextBtnEventHandler = async () => {
    let x: number = isCarousel.current?.getCurrentIndex() ?? 0;
    if (x === maxIndex) {
      //navigate to next screen.

      let pin: string | null = NashCache.getPinCache();
      if (pin === null) {
        let mnemonic = await getStoredMnemonic(pin);
        navigation.navigate('WriteDownRecoveryPhraseScreen', {
          mnemonic: mnemonic,
        });
      } else {
        navigation.navigate('EnterPinScreen', {
          nextRoute: 'WriteDownRecoveryPhraseScreen',
          target: 'mnemonic',
        });
      }
    } else {
      //move to the next item in carousel list.
      isCarousel.current?.next();

      if (x === maxIndex - 1) {
        setButtonText('I understand');
      }
    }
  };

  return (
    <Screen style={style.rootScreen}>
      <View style={style.container}>
        <Carousel
          vertical={false}
          width={wp('70.0%')}
          height={hp('25.0%')}
          autoPlay={false}
          ref={isCarousel}
          data={seedPhraseInstructions}
          renderItem={SeedPhraseInstructionsCarouselCardItem}
          style={style.carousel}
        />
        <Button
          style={style.button}
          outline={true}
          outlineColor={AppColors.yellow}
          label={buttonText}
          warning
          labelStyle={{
            ...FONTS.h4,
          }}
          onPress={() => onPressNextBtnEventHandler()}
        />
      </View>
    </Screen>
  );
};

const mapStateToProps = (state: RootState) => ({
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetUpSeedPhraseInstructions);

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: AppColors.gray,
  },
  carousel: {alignSelf: 'center'},
  button: {
    // backgroundColor: AppColors.light_green,
  },
  rootScreen: {
    justifyContent: 'center',
    flex: 1,
  },
});
