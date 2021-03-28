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
  SCALE,
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

const ImageView = ({route, navigation}) => {
  const {onView, dataBarcode, dataImage} = route.params;
  const [imageUri, setimageUri] = useState(null);
  const [textRecognized, setTextRecognized] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [disableAction, setDisable] = useState(true);
  const crop_config = {
    offset: {
      x: SCAN_AREA_X * dataImage.width - SCALE(30),
      y: SCAN_AREA_Y * dataImage.height + SCALE(120),
    },
    size: {
      width: FRAME_HEIGTH - SCALE(40),
      height: FRAME_WIDTH - SCALE(55),
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
        paddingHorizontal: onView ? 0 : SCALE(20),
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {!onView ? (
        <View style={{flex: 0}}>
          <Text style={{fontSize: SCALE(28), letterSpacing: 1}}>Result</Text>
        </View>
      ) : null}
      <View
        style={{
          flex: !onView ? 0 : 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: !onView ? SCALE(20) : 0,
        }}>
        {isLoading ? (
          <Skeleton>
            <Skeleton.Item
              width={FRAME_HEIGTH + SCALE(26)}
              height={FRAME_WIDTH}
              borderRadius={SCALE(5)}
            />
          </Skeleton>
        ) : (
          <Image
            resizeMode="contain"
            style={{
              borderRadius: !onView ? SCALE(5) : 0,
              width: !onView ? FRAME_HEIGTH + SCALE(26) : '100%',
              height: !onView ? FRAME_WIDTH : '100%',
            }}
            source={{uri: imageUri}}
          />
        )}
      </View>
      {!onView ? (
        <>
          {isLoading ? (
            <View style={{flex: 1}}>
              <Skeleton>
                <Skeleton.Item
                  flex={0}
                  width={WIDTH / 3}
                  height={SCALE(16)}
                  borderRadius={SCALE(2)}
                  marginBottom={SCALE(4)}
                />
                <Skeleton.Item
                  flex={0}
                  width={WIDTH / 1.5}
                  height={SCALE(20)}
                  borderRadius={SCALE(2)}
                  marginBottom={SCALE(4)}
                />
                <Skeleton.Item
                  flex={0}
                  width={WIDTH / 1.5}
                  height={SCALE(20)}
                  borderRadius={SCALE(2)}
                  marginBottom={SCALE(20)}
                />
                <Skeleton.Item
                  flex={0}
                  width={WIDTH / 3}
                  height={SCALE(16)}
                  borderRadius={SCALE(2)}
                  marginBottom={SCALE(4)}
                />
                <Skeleton.Item
                  flex={0}
                  width={WIDTH / 1.5}
                  height={SCALE(20)}
                  borderRadius={SCALE(2)}
                  marginBottom={SCALE(4)}
                />
                <Skeleton.Item
                  flex={0}
                  width={WIDTH / 1.5}
                  height={SCALE(20)}
                  borderRadius={SCALE(2)}
                  marginBottom={SCALE(4)}
                />
              </Skeleton>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: SCALE(16),
                  color: COLORS.grey,
                  letterSpacing: 1,
                }}>
                Barcode details :
              </Text>
              <Text
                style={{
                  fontSize: SCALE(18),
                  color: COLORS.black,
                  letterSpacing: 1,
                }}>
                {dataBarcode.type}
              </Text>
              <Text
                style={{
                  fontSize: SCALE(18),
                  color: COLORS.black,
                  letterSpacing: 1,
                }}>
                {dataBarcode.data}
              </Text>
              <Text
                style={{
                  fontSize: SCALE(16),
                  color: COLORS.grey,
                  letterSpacing: 1,
                  paddingTop: SCALE(20),
                }}>
                Text Recognized :
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontSize: SCALE(18),
                    color: COLORS.black,
                    letterSpacing: 1,
                    paddingBottom: SCALE(20),
                  }}>
                  {textRecognized}
                </Text>
              </ScrollView>
            </View>
          )}
          <TouchableOpacity
            disabled={disableAction}
            activeOpacity={0.5}
            onPress={shareMedia}
            style={{
              position: 'absolute',
              top: SCALE(-8),
              right: SCALE(110),
              padding: SCALE(10),
            }}>
            <Ionicons
              name="ios-share-social-outline"
              size={SCALE(24)}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disableAction}
            activeOpacity={0.5}
            onPress={copyText}
            style={{
              position: 'absolute',
              top: SCALE(-8),
              right: SCALE(60),
              padding: SCALE(10),
            }}>
            <Ionicons
              name="ios-text-outline"
              size={SCALE(24)}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disableAction}
            activeOpacity={0.5}
            onPress={saveImage}
            style={{
              position: 'absolute',
              top: SCALE(-8),
              right: SCALE(10),
              padding: SCALE(10),
            }}>
            <Ionicons
              name="ios-save-outline"
              size={SCALE(24)}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={COLORS.gradient}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            paddingVertical: SCALE(5),
            width: WIDTH,
            height: WIDTH / 2,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: SCALE(30),
              left: SCALE(2),
              padding: SCALE(10),
            }}>
            <Ionicons name="arrow-back" size={SCALE(24)} color={COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={deleteImage}
            style={{
              position: 'absolute',
              top: SCALE(30),
              right: SCALE(2),
              padding: SCALE(10),
            }}>
            <Ionicons
              name="ios-trash-outline"
              size={SCALE(24)}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
};

export default ImageView;
