import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {RNCamera} from 'react-native-camera';
import {
  HP,
  WIDTH,
  HEIGHT,
  FRAME_WIDTH,
  FRAME_HEIGTH,
  SCAN_AREA_X,
  SCAN_AREA_Y,
  SCAN_AREA_HEIGHT,
  SCAN_AREA_WIDTH,
} from '../styles/Dimension';
import {useIsFocused} from '@react-navigation/core';
import {COLORS} from '../styles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {_getTypes, _storeTypes} from '../helper/_storage';

const Home = ({navigation}) => {
  const isFocused = useIsFocused();
  const [camera, setCamera] = useState(null);
  const [flash, setFlash] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [barcodeTypes, setTypes] = useState([]);

  const barcodeRecognized = async (_barcodes) => {
    if (_barcodes.type !== 'UNKNOWN_FORMAT') {
      setLoading(true);
      if (camera) {
        try {
          const optionsImage = {base64: true};
          const captureImage = await camera.takePictureAsync(optionsImage);
          navigation.navigate('ImageView', {
            onView: false,
            dataBarcode: _barcodes,
            dataImage: captureImage,
          });
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      }
    }
  };

  const getSettings = useCallback(() => {
    _getTypes()
      .then((el) => {
        if (!el) {
          _storeTypes();
        } else {
          const elTypes = JSON.parse(el);
          setTypes([]);
          elTypes.filter((e) => {
            if (e.isActive) {
              setTypes((prev) => [...prev, e.types]);
            }
          });
        }
      })
      .catch((e) => console.log(`e`, e));
  }, []);

  useEffect(() => {
    if (isFocused) {
      getSettings();
    }
  }, [isFocused]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <StatusBar translucent backgroundColor="transparent" />
      <RNCamera
        ref={(ref) => {
          setCamera(ref);
        }}
        autoFocus="on"
        rectOfInterest={{
          x: SCAN_AREA_X,
          y: SCAN_AREA_Y,
          width: SCAN_AREA_WIDTH,
          height: SCAN_AREA_HEIGHT,
        }}
        style={{flex: 1}}
        cameraViewDimensions={{
          width: WIDTH,
          height: HEIGHT,
        }}
        barCodeTypes={barcodeTypes}
        flashMode={flash ? 'torch' : 'off'}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={isFocused && !isLoading ? barcodeRecognized : null}>
        {isLoading ? (
          <>
            <BarcodeMask
              width={0}
              height={0}
              showAnimatedLine={false}
              edgeBorderWidth={0}
            />
            <ActivityIndicator
              style={{flex: 1, justifyContent: 'center'}}
              animating={true}
              size={HP('7%')}
              color={COLORS.white}
            />
          </>
        ) : (
          <>
            <BarcodeMask
              width={FRAME_HEIGTH}
              height={FRAME_WIDTH}
              showAnimatedLine={false}
              outerMaskOpacity={0.5}
              edgeColor={COLORS.white}
              edgeBorderWidth={HP('0.3%')}
            />
            <Text
              style={{
                position: 'absolute',
                color: COLORS.white,
                bottom: HP('25%'),
                left: HP('13%'),
                letterSpacing: 1,
                fontSize: HP('2%'),
              }}>
              Place the code inside the frame
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('Gallery')}
              style={{
                borderRadius: HP('100%'),
                position: 'absolute',
                bottom: HP('5%'),
                left: HP('21.5%'),
                padding: HP('2%'),
              }}>
              <Ionicons
                name="ios-images-outline"
                size={HP('3.5%')}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setFlash((prev) => !prev)}
              style={{
                borderRadius: HP('100%'),
                position: 'absolute',
                top: HP('10%'),
                left: HP('3%'),
                padding: HP('2%'),
              }}>
              <Ionicons
                name={flash ? 'ios-flash' : 'ios-flash-off'}
                size={HP('3.5%')}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('Options')}
              style={{
                borderRadius: HP('100%'),
                position: 'absolute',
                top: HP('10%'),
                right: HP('3%'),
                padding: HP('2%'),
              }}>
              <Ionicons
                name="ios-settings-outline"
                size={HP('3.5%')}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </>
        )}
      </RNCamera>
    </View>
  );
};
export default Home;
