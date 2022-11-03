import React, {FC, ReactElement, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface Props {
  label: string;
  data: Array<{label: string; value: string}>;
  onSelect: (item: {label: string; value: string}) => void;
  defaultValue?: string;
}

const DropDown: FC<Props> = ({label, data, onSelect, defaultValue}) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  useEffect(() => {
    if (!selected && defaultValue) {
      data.forEach((item: {label: string; value: string}) => {
        if (item.value === defaultValue) {
          setSelected(item);
        }
      });
    }
  });

  const openDropdown = (): void => {
    DropdownButton?.current?.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        h: number,
        _px: number,
        py: number,
      ) => {
        setDropdownTop(py + h);
      },
    );
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({item}: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setVisible(false)}>
            <View style={[styles.dropdown, {top: dropdownTop}]}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}>
      {renderDropdown()}
      <Text style={styles.buttonText}>
        {(!!selected && selected?.label) || label}
      </Text>
      <Icon style={styles.icon} name="chevron-down" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('3%'),
    width: wp('20%'),
    borderRadius: wp('1%'),
    borderColor: AppColors.light_green,
    borderWidth: 1,
    paddingHorizontal: wp('1%'),
    backgroundColor: '#fff',
  },
  modalContainer: {
    justifyContent: 'center',
  },

  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
  icon: {
    marginRight: 10,
    color: AppColors.light_green,
  },
  dropdown: {
    backgroundColor: '#fff',
    width: wp('30%'),
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
    borderRadius: wp('2%'),
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: {
    ...FONTS.body6,
    color: AppColors.black,
  },
});

export default DropDown;
