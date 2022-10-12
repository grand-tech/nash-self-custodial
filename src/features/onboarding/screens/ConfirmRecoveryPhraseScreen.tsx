import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Button,
  ChipsInputChipProps,
  Incubator,
  Text,
} from 'react-native-ui-lib';
import Screen from '../../../app_components/Screen';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {useNavigation} from '@react-navigation/native';

/**
 * Contains the onboarding UI.
 */
export const ConfirmRecoveryPhraseScreen = () => {
  const navigation = useNavigation();
  const [seedPhrase, setSeedPhrase] = useState(
    'Horse  giraffe  dog money  book  fire  drink cup  phone  car  jacket computer  wire  charger curtain  router  window  plate  floor  key  wine glass  oak  watch',
  );
  const initInputSeedPhrase: ChipsInputChipProps[] = [];
  const [inputSeedPhrase, setInputSeedPhrase] = useState(initInputSeedPhrase);
  const [writtenDownSeedPhrase, setWrittenDownSeedPhrase] = useState(false);

  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        {/* Tittle section */}
        <View>
          <Text color={AppColors.light_green} displayBold>
            Recovery Phrase
          </Text>
        </View>
        {/* Body text group section. */}
        <View style={style.textGroup}>
          <Text color={AppColors.yellow} style={style.counter} body1>
            Word {inputSeedPhrase.length} of 24
          </Text>
          <Incubator.ChipsInput
            placeholder="Next word..."
            chips={inputSeedPhrase}
            defaultChipProps={{
              labelStyle: {...FONTS.body2},
            }}
            onChange={newChips => {
              const chips: Array<{label: string}> = [];
              newChips.forEach((chip: {label: string}) => {
                let label: string = chip.label;
                label = label.toLowerCase().trim();
                chips.push({label: label});
              });

              setInputSeedPhrase(chips);
            }}
            maxChips={24}
          />
        </View>

        {/* Button group section. */}
        <View style={style.buttonGroup}>
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.light_green}
            label={'Continue'}
            secondary
            labelStyle={{
              ...FONTS.h4,
            }}
            onPress={() => {
              navigation.navigate('EnterUserName');
            }}
            disabled={!writtenDownSeedPhrase}
          />
        </View>
      </View>
    </Screen>
  );
};

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmRecoveryPhraseScreen);

const style = StyleSheet.create({
  container: {
    backgroundColor: AppColors.gray,
    maxHeight: hp('90.0%'),
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp('2%'),
    marginBottom: hp('4%'),
    paddingTop: hp('2%'),
  },
  button: {
    width: wp('80.0%'),
  },
  rootComponent: {
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-around',
  },
  textGroup: {
    justifyContent: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#ffff',
    borderRadius: wp('5%'),
    minWidth: wp('80%'),
  },
  switchLabel: {...FONTS.body5, marginLeft: wp('4%')},
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  counter: {
    textAlign: 'center',
  },
});
