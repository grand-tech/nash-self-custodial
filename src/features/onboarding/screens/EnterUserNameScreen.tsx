import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Text, TextField} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';
import Screen from '../../../app_components/Screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../../../hooks/index';
import {setUserName} from '../redux_store/action.generators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';

/**
 * Contains the screen to enter user name.
 */
const EnterUserNameScreen = (props: Props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(props.userName ?? '');

  const submitName = () => {
    dispatch(setUserName(name));
    props.navigation.navigate('CreatePin');
  };

  useFocusEffect(() => {
    props.navigation.setOptions({
      title: 'User Name',
      headerShown: true,
      headerTransparent: true,
    });
    return () => {
      props.navigation.setOptions({
        title: '',
      });
    };
  });

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.container}>
            {/* Tittle section */}

            {/* Body text group section. */}
            <View style={style.textGroup}>
              <TextField
                body4
                color={AppColors.black}
                containerStyle={{marginBottom: hp('1.00%')}}
                floatingPlaceholder
                placeholder="Enter Your Name"
                maxLength={200}
                editable={true}
                disabledColor={AppColors.brown}
                style={style.textInput}
                migrate
                onChangeText={(text: string) => {
                  setName(text);
                }}
                value={name}
              />
            </View>

            <Button
              style={style.button}
              outline={true}
              outlineColor={AppColors.light_green}
              label={'Continue'}
              size={'small'}
              labelStyle={{
                ...FONTS.body1,
              }}
              disabled={name.length < 2}
              onPress={() => {
                submitName();
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
};

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  userName: state.onboarding.user_name,
});

type NavigationProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'EnterUserName'
>;

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & NavigationProps;

export default connector(EnterUserNameScreen);

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    maxHeight: hp('60%'),
    paddingVertical: hp('0%'),
  },
  button: {
    width: wp('60.0%'),
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-between',
  },
  textGroup: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 10,
  },
  textInput: {
    width: wp('70%'),
  },
});
