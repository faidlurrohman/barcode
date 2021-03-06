import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  crop,
  Pressable,
  Dimensions,
  NativeEventEmitter,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import ImageEditor from '@react-native-community/image-editor';
import {scale, WIDTH, HEIGHT} from '../styles/Dimension';

const leftMargin = scale(210);
const topMargin = scale(35);
const frameWidth = scale(400);
const frameHeight = scale(320);

const scanAreaX = leftMargin / HEIGHT;
const scanAreaY = topMargin / WIDTH;
const scanAreaWidth = frameWidth / HEIGHT;
const scanAreaHeight = frameHeight / WIDTH;

const Home = ({navigation}) => {
  const [camera, setCamera] = useState(null);
  const [barcodes, setBarcodes] = useState([]);
  const [scanBarcode, setScanBarcode] = useState(false);

  const barcodeRecognized = (_barcodes) => {
    // console.log('_barcodes', _barcodes);
    setBarcodes(_barcodes);
    console.log('barcodes', barcodes);
    if (barcodes.type !== 'UNKNOWN_FORMAT') {
      setScanBarcode(true);
      if (camera) {
        const optionsImage = {base64: true};
        camera.takePictureAsync(optionsImage).then((dataImage) => {
          const cropData = {
            offset: {
              x: scanAreaX * dataImage.width - scale(10),
              y: scanAreaY * dataImage.height - scale(10),
            },
            size: {
              width: scanAreaWidth * dataImage.width - scale(10),
              height: scanAreaHeight * dataImage.height - scale(10),
            },
          };
          console.log('dataImage', dataImage);
          ImageEditor.cropImage(dataImage.uri, cropData)
            .then((dataCrop) => {
              navigation.navigate('ImageView', {
                uri: dataCrop,
                width: frameHeight,
                height: frameWidth,
              });
            })
            .catch((e) => console.log('e', e));
        });
      }
    }
  };

  const btnAction = () => {
    setScanBarcode((prev) => !prev);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <RNCamera
        ref={(ref) => {
          setCamera(ref);
        }}
        autoFocus="on"
        rectOfInterest={{
          x: scanAreaX,
          y: scanAreaY,
          width: scanAreaWidth,
          height: scanAreaHeight,
        }}
        style={{flex: 1}}
        cameraViewDimensions={{
          width: WIDTH,
          height: HEIGHT,
        }}
        type={RNCamera.Constants.Type.back}
        onFaceDetected={!navigation.isFocused() && null}
        onBarCodeRead={!scanBarcode ? barcodeRecognized : null}
        // androidCameraPermissionOptions={{
        //   title: 'Permission to use camera',
        //   message: 'We need your permission to use your camera',
        //   buttonPositive: 'Ok',
        //   buttonNegative: 'Cancel',
        // }}
        // androidRecordAudioPermissionOptions={{
        //   title: 'Permission to use audio recording',
        //   message: 'We need your permission to use your audio',
        //   buttonPositive: 'Ok',
        //   buttonNegative: 'Cancel',
        // }}
      >
        <BarcodeMask
          width={frameHeight}
          height={frameWidth}
          showAnimatedLine={false}
          outerMaskOpacity={0.5}
          edgeColor="#F48024"
        />
      </RNCamera>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          width: WIDTH,
          bottom: WIDTH / 10,
        }}>
        <Pressable
          onPress={btnAction}
          style={{
            padding: WIDTH / 30,
            borderRadius: WIDTH,
            backgroundColor: !scanBarcode ? `#F48024` : `#0077CC`,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: WIDTH / 20}}>
            {!scanBarcode ? `Lagi Ngescan` : `Scan Lagi Dong`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
