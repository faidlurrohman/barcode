import React, {useEffect, useState} from 'react';
import ImageEditor from '@react-native-community/image-editor';
import {
  Image,
  Text,
  View,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {
  HP,
  WP,
  FRAME_WIDTH,
  FRAME_HEIGTH,
  SCAN_AREA_X,
  SCAN_AREA_Y,
  WIDTH,
} from '../styles/Dimension';
import {COLORS} from '../styles/Colors';
import Skeleton from 'react-native-skeleton-placeholder';
import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNMlKit from 'react-native-firebase-mlkit';
import base64 from 'react-native-base64';

const ImageView = ({route, navigation}) => {
  const {onView, dataBarcode, dataImage} = route.params;
  const [imageUri, setimageUri] = useState(null);
  const [textRecognized, setTextRecognized] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [disableAction, setDisable] = useState(true);
  const [matchBarcode, setMatch] = useState(false);

  const crop_config = {
    offset: {
      x: SCAN_AREA_X,
      y: SCAN_AREA_Y * dataImage.height,
    },
    size: {
      width: FRAME_WIDTH * dataImage.width,
      height: FRAME_HEIGTH * dataImage.height,
    },
  };

  useEffect(() => {
    setLoading(true);
    if (!onView) {
      cropImage();
    } else {
      navigation.setOptions({
        headerShown: false,
      });
      setimageUri(dataImage);
      setLoading(false);
    }
    return () => {};
  }, [navigation]);

  const cropImage = async () => {
    try {
      const cropImageProcess = await ImageEditor.cropImage(
        dataImage.uri,
        crop_config,
      );
      const deviceTextRecognition = await RNMlKit.deviceTextRecognition(
        cropImageProcess,
      );
      setimageUri(cropImageProcess);
      setLoading(false);
      setDisable(false);
      setTextRecognized(deviceTextRecognition[0].resultText);
      if (
        base64.encode(dataBarcode.data) === deviceTextRecognition[0].resultText
      ) {
        setMatch(true);
      }
    } catch (e) {
      setTextRecognized('None');
      setLoading(false);
    }
  };

  const getPermissions = async () => {
    const writePermission =
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(writePermission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(writePermission);
    return status === 'granted';
  };

  const copyText = () => {
    Clipboard.setString(
      `Types : ${dataBarcode.type}.\nData : ${dataBarcode.data}.\nText : ${textRecognized}`,
    );
    ToastAndroid.showWithGravity(
      'Text copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  const saveImage = () => {
    if (Platform.OS === 'android' && !getPermissions()) {
      return;
    }
    CameraRoll.save(imageUri, {album: 'Barcodes'}).then(() => {
      ToastAndroid.showWithGravity(
        'Image saved',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    });
  };

  const shareMedia = async () => {
    try {
      await Share.share({
        message: `Types : ${dataBarcode.type}.\nData : ${dataBarcode.data}.\nText : ${textRecognized}`,
      });
    } catch (e) {
      console.log('e', e);
    }
  };

  const deleteImage = () => {
    CameraRoll.deletePhotos([imageUri]).then(() => {
      ToastAndroid.showWithGravity(
        'Image Deleted',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('Gallery', {
        onDelete: true,
      });
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: onView ? 0 : WP('5%'),
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {!onView ? (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text style={{fontSize: HP('3%'), letterSpacing: 1}}>Result</Text>
          </View>
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              disabled={disableAction}
              activeOpacity={0.5}
              onPress={shareMedia}
              style={{paddingHorizontal: HP('0.5%')}}>
              <Ionicons
                name="ios-share-social-outline"
                size={HP('3%')}
                color={COLORS.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disableAction}
              activeOpacity={0.5}
              onPress={copyText}
              style={{paddingHorizontal: HP('0.5%')}}>
              <Ionicons
                name="ios-text-outline"
                size={HP('3%')}
                color={COLORS.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disableAction}
              activeOpacity={0.5}
              onPress={saveImage}
              style={{paddingHorizontal: HP('0.5%')}}>
              <Ionicons
                name="ios-save-outline"
                size={HP('3%')}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {!onView ? (
        <>
          {isLoading ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Skeleton>
                <View
                  style={{
                    flex: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: HP('3%'),
                  }}>
                  <Skeleton.Item
                    width={FRAME_HEIGTH}
                    height={FRAME_WIDTH}
                    borderRadius={HP('0.5%')}
                  />
                </View>
                <Skeleton.Item
                  flex={0}
                  width={WP('40%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('0.5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('90%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('0.5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('90%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('40%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('0.5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('90%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('40%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('0.5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('90%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('0.5%')}
                />
                <Skeleton.Item
                  flex={0}
                  width={WP('90%')}
                  height={HP('3%')}
                  borderRadius={HP('0.5%')}
                  marginBottom={HP('0.5%')}
                />
              </Skeleton>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: HP('3%'),
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    borderRadius: HP('0.5%'),
                    width: FRAME_HEIGTH,
                    height: FRAME_WIDTH,
                  }}
                  source={{uri: imageUri}}
                />
              </View>
              <Text
                style={{
                  fontSize: HP('2%'),
                  color: COLORS.grey,
                  letterSpacing: 1,
                }}>
                Barcode details :
              </Text>
              <Text
                style={{
                  fontSize: HP('2.5%'),
                  color: COLORS.black,
                  letterSpacing: 1,
                }}>
                {dataBarcode.type}
              </Text>
              <Text
                style={{
                  fontSize: HP('2.5%'),
                  color: COLORS.black,
                  letterSpacing: 1,
                }}>
                {dataBarcode.data}
              </Text>
              <Text
                style={{
                  fontSize: HP('2%'),
                  color: COLORS.grey,
                  letterSpacing: 1,
                  paddingTop: HP('3%'),
                }}>
                Data Matches :
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons
                  name={matchBarcode ? 'checkmark-sharp' : 'close'}
                  size={HP('2.5%')}
                  color={matchBarcode ? COLORS.green : COLORS.red}
                />
                <Text
                  style={{
                    fontSize: HP('2.5%'),
                    color: matchBarcode ? COLORS.green : COLORS.red,
                    letterSpacing: 1,
                  }}>
                  {matchBarcode ? `Passed` : `Failed`}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: HP('2%'),
                  color: COLORS.grey,
                  letterSpacing: 1,
                  paddingTop: HP('3%'),
                }}>
                Text Recognized :
              </Text>
              <Text
                style={{
                  fontSize: HP('2.5%'),
                  color: COLORS.black,
                  letterSpacing: 1,
                  paddingBottom: HP('3%'),
                }}>
                {textRecognized}
              </Text>
            </ScrollView>
          )}
        </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{
                width: WP('100%'),
                height: HP('100%'),
              }}
              source={{uri: imageUri}}
            />
          </View>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={COLORS.gradient}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              paddingVertical: HP('0.5%'),
              width: WIDTH,
              height: WIDTH / 2,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: HP('7%'),
                left: HP('1.3%'),
                padding: HP('0.5%'),
              }}>
              <Ionicons
                name="arrow-back"
                size={HP('3.2%')}
                color={COLORS.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={deleteImage}
              style={{
                position: 'absolute',
                top: HP('7%'),
                right: HP('1.3%'),
                padding: HP('0.5%'),
              }}>
              <Ionicons
                name="ios-trash-outline"
                size={HP('3%')}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </LinearGradient>
        </>
      )}
    </View>
  );
};

export default ImageView;
