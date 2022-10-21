import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Pressable} from 'react-native';
import {AppColors} from '../ui_lib_configs/colors';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
/**
 * Hides the header.
 */
export const RootStackScreenHideHeader = {
  headerShown: false,
};

export function RootStackScreenHideHeaderTitle(
  onPress: any,
  title?: string,
): NativeStackNavigationOptions {
  return {
    title: title ?? '',
    headerTransparent: true,
    headerLeft: () => <BackButton onPress={onPress} />,
  };
}

export function headerWithDeleteButton(
  onPressBack: any,
  onPressDelete: any,
  title?: string,
): NativeStackNavigationOptions {
  return {
    title: title ?? '',
    headerTransparent: true,
    headerLeft: () => <BackButton onPress={onPressBack} />,
    headerRight: () => <DeleteButton onPress={onPressDelete} />,
  };
}

/**
 * Custom back button.
 */
export const BackButton: React.FC<BackButtonProps> = props => {
  return (
    <Pressable
      onPress={() => {
        props.onPress();
      }}>
      <Icon name="chevron-left" size={30} color={AppColors.green} />
    </Pressable>
  );
};

/**
 * Props expected by custom back button.
 */
interface BackButtonProps {
  onPress: any;
}

/**
 * Custom delete button.
 */
export const DeleteButton: React.FC<BackButtonProps> = props => {
  return (
    <Pressable
      onPress={() => {
        props.onPress();
      }}>
      <Icon
        name="backspace"
        size={24}
        color={AppColors.green}
        // style={styles.number}
      />
    </Pressable>
  );
};
