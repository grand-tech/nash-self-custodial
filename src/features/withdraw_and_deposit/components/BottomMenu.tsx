import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button} from 'react-native-ui-lib';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {TransactionType} from '../sagas/nash_escrow_types';

const BottomMenu: React.FC<Props> = (props: Props) => {
  return (
    <View style={style.container}>
      <Button
        style={style.button}
        outline={true}
        outlineColor={AppColors.yellow}
        label={'Withdraw'}
        warning
        labelStyle={{
          ...FONTS.h4,
        }}
        onPress={() => {
          if (props.ui_status !== 'loading') {
            props.navigation.navigate('EnterAmountScreen', {
              transactionType: TransactionType.WITHDRAWAL,
            });
          }
        }}
      />
      <Button
        style={style.button}
        outline={true}
        outlineColor={AppColors.light_green}
        label={'Deposit'}
        secondary
        labelStyle={{
          ...FONTS.h4,
        }}
        onPress={() => {
          if (props.ui_status !== 'loading') {
            props.navigation.navigate('EnterAmountScreen', {
              transactionType: TransactionType.DEPOSIT,
            });
          }
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
    paddingTop: hp('0.5%'),
  },
});

const mapStateToProps = (_state: RootState) => ({
  ui_status: _state.ui_state.status,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {
  navigation: any;
}

export default connector(BottomMenu);
