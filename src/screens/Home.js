import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {RNCamera} from 'react-native-camera';
import {
  SCALE,
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
              size={SCALE(40)}
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
              edgeBorderWidth={SCALE(2)}
            />
            <Text
              style={{
                position: 'absolute',
                color: COLORS.white,
                bottom: SCALE(170),
                left: SCALE(105),
                letterSpacing: 1,
              }}>
              Place the code inside the frame
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Gallery')}
              style={{
                position: 'absolute',
                bottom: SCALE(30),
                left: SCALE(170),
                padding: SCALE(10),
              }}>
              <Ionicons
                name="ios-images-outline"
                size={SCALE(24)}
                color={COLORS.white}
              />
            </Pressable>
            <Pressable
              onPress={() => setFlash((prev) => !prev)}
              style={{
                position: 'absolute',
                top: SCALE(70),
                left: SCALE(20),
                padding: SCALE(10),
              }}>
              <Ionicons
                name={flash ? 'ios-flash' : 'ios-flash-off'}
                size={SCALE(20)}
                color={COLORS.white}
              />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Options')}
              style={{
                position: 'absolute',
                top: SCALE(70),
                right: SCALE(20),
                padding: SCALE(10),
              }}>
              <Ionicons
                name="ios-settings-outline"
                size={SCALE(20)}
                color={COLORS.white}
              />
            </Pressable>
          </>
        )}
      </RNCamera>
    </View>
  );
};
export default Home;
