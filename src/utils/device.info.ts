import DeviceInfo from 'react-native-device-info';

export let DEVICE_NAME: string;

export const setDeviceName = async () => {
  DEVICE_NAME = await DeviceInfo.getDeviceName();
};
