import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Button} from 'react-native-ui-lib';
import {connect, ConnectedProps} from 'react-redux';
import {AppColors} from '../../../ui_lib_configs/colors';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {useNavigation} from '@react-navigation/native';
import ComingSoonModalComponent from '../../../app_components/ComingSoonModalComponent';

const BottomMenu: React.FC<Props> = () => {
  const navigation = useNavigation();

  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);

  return (
    <View style={style.container}>
      <Button
        style={style.button}
        outline={true}
        outlineColor={AppColors.yellow}
        label={'Send'}
        warning
        labelStyle={{
          ...FONTS.h4,
        }}
        onPress={() => {
          navigation.navigate('EnterAddressScreen');
        }}
      />
      <Button
        style={style.button}
        outline={true}
        outlineColor={AppColors.light_green}
        label={'Request'}
        secondary
        labelStyle={{
          ...FONTS.h4,
        }}
        onPress={() => {
          setComingSoonModalVisible(true);
        }}
      />

      <ComingSoonModalComponent
        visible={comingSoonModalVisible}
        onCloseModal={() => {
          setComingSoonModalVisible(false);
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    width: wp('45%'),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

// state: RootState
const mapStateToProps = () => ({});

const mapDispatchToProps = {
  // dispatchActionSetNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {}

export default connector(BottomMenu);
