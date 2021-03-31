import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const SCALE = (_number) => {
  return parseInt(_number + HEIGHT / WIDTH);
};

// const LEFT_MARGIN = SCALE(210);
// const TOP_MARGIN = SCALE(35);
// const FRAME_WIDTH = SCALE(400);
// const FRAME_HEIGTH = SCALE(320);

const LEFT_MARGIN = 100;
const TOP_MARGIN = 50;
const FRAME_WIDTH = 400;
const FRAME_HEIGTH = 320;

const SCAN_AREA_X = LEFT_MARGIN / HEIGHT;
const SCAN_AREA_Y = TOP_MARGIN / WIDTH;
const SCAN_AREA_WIDTH = FRAME_WIDTH / HEIGHT;
const SCAN_AREA_HEIGHT = FRAME_HEIGTH / WIDTH;

export {
  WIDTH,
  HEIGHT,
  SCALE,
  FRAME_WIDTH,
  FRAME_HEIGTH,
  SCAN_AREA_X,
  SCAN_AREA_Y,
  SCAN_AREA_WIDTH,
  SCAN_AREA_HEIGHT,
};
