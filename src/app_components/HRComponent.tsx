import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {AppColors} from '../ui_lib_configs/colors';

interface Props {
  additionalContainerStyling?: ViewStyle;
  hrColor?: string;
  weight?: number;
}

export const HR = ({
  additionalContainerStyling,
  weight = 1,
  hrColor = AppColors.black,
}: Props) => {
  return (
    <View style={[style.hrContainer, additionalContainerStyling]}>
      {Array(weight)
        .fill(1)
        .map(el => (
          <View style={[style.hr, {backgroundColor: hrColor}]} />
        ))}
    </View>
  );
};

const style = StyleSheet.create({
  hr: {flex: 1, height: 0.5},
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
