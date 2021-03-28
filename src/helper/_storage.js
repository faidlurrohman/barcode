import AsyncStorage from '@react-native-async-storage/async-storage';
import {RNCamera} from 'react-native-camera';

const TYPES = [
  {
    name: 'QR',
    types: RNCamera.Constants.BarCodeType.qr,
    isActive: true,
  },
  {
    name: 'Aztec',
    types: RNCamera.Constants.BarCodeType.aztec,
    isActive: true,
  },
  {
    name: 'Code 128',
    types: RNCamera.Constants.BarCodeType.code128,
    isActive: false,
  },
  {
    name: 'Code 39',
    types: RNCamera.Constants.BarCodeType.code39,
    isActive: false,
  },
  {
    name: 'Code 39 Mod 43',
    types: RNCamera.Constants.BarCodeType.code39mod43,
    isActive: false,
  },
  {
    name: 'Code 93',
    types: RNCamera.Constants.BarCodeType.code93,
    isActive: false,
  },
  {
    name: 'Data Matrix',
    types: RNCamera.Constants.BarCodeType.datamatrix,
    isActive: true,
  },
  {
    name: 'Ean 13',
    types: RNCamera.Constants.BarCodeType.ean13,
    isActive: false,
  },
  {
    name: 'Ean 8',
    types: RNCamera.Constants.BarCodeType.ean8,
    isActive: false,
  },
  {
    name: 'Inter Leaved 2 of 5',
    types: RNCamera.Constants.BarCodeType.interleaved2of5,
    isActive: false,
  },
  {
    name: 'ITF 4',
    types: RNCamera.Constants.BarCodeType.itf14,
    isActive: false,
  },
  {
    name: 'PDF 417',
    types: RNCamera.Constants.BarCodeType.pdf417,
    isActive: false,
  },
  {
    name: 'UPC E',
    types: RNCamera.Constants.BarCodeType.upc_e,
    isActive: false,
  },
];

const _getTypes = async () => {
  try {
    return await AsyncStorage.getItem('@barcodeTypes');
  } catch (e) {
    console.log('e', e);
  }
};

const _storeTypes = async (_values = null) => {
  try {
    if (!_values) {
      await AsyncStorage.setItem('@barcodeTypes', JSON.stringify(TYPES));
    } else {
      await AsyncStorage.setItem('@barcodeTypes', JSON.stringify(_values));
    }
  } catch (e) {
    console.log('e', e);
  }
};

const _defaultTypes = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (e) {
    console.log('e', e);
  }
};

export {TYPES, _getTypes, _storeTypes, _defaultTypes};
