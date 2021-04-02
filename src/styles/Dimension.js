import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

const WP = (_percent) => {
  return widthPercentageToDP(_percent);
};

const HP = (_percent) => {
  return heightPercentageToDP(_percent);
};

const WIDTH = WP('100%');
const HEIGHT = HP('100%');
const IMAGE_WIDTH = 1440;
const IMAGE_HEIGHT = 2160;

const LEFT_MARGIN = WP('23%');
const TOP_MARGIN = HP('8%');
const FRAME_WIDTH = HP('50%');
const FRAME_HEIGTH = WP('80%');

const SCAN_AREA_X = LEFT_MARGIN / HEIGHT;
const SCAN_AREA_Y = TOP_MARGIN / WIDTH;
const SCAN_AREA_WIDTH = FRAME_WIDTH / HEIGHT;
const SCAN_AREA_HEIGHT = FRAME_HEIGTH / WIDTH;

export {
  WIDTH,
  HEIGHT,
  WP,
  HP,
  FRAME_WIDTH,
  FRAME_HEIGTH,
  SCAN_AREA_X,
  SCAN_AREA_Y,
  SCAN_AREA_WIDTH,
  SCAN_AREA_HEIGHT,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
};
