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

// const LEFT_MARGIN = SCALE(210);
// const TOP_MARGIN = SCALE(35);
// const FRAME_WIDTH = SCALE(400);
// const FRAME_HEIGTH = SCALE(320);

const LEFT_MARGIN = HP('15%');
const TOP_MARGIN = HP('5%');
const FRAME_WIDTH = HP('50%');
const FRAME_HEIGTH = HP('40%');

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
};
