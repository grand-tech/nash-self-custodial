import {Colors, Typography, Spacings} from 'react-native-ui-lib';
import {AppColors} from './colors';
import {FONTS} from './fonts';

export const initTheme = () => {
  Colors.loadColors({
    primary: AppColors.green,
    secondary: AppColors.light_green,
    textColor: AppColors.black,
    error: AppColors.red,
    success: AppColors.dark_blue,
    warning: AppColors.yellow,
    background: AppColors.gray,
  });

  Typography.loadTypographies(FONTS);

  Spacings.loadSpacings({
    page: 20,
    card: 12,
    gridGutter: 16,
  });
};
