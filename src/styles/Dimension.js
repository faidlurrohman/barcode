import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const scale = (_number) => {
  return parseInt(_number + HEIGHT / WIDTH);
};

export {WIDTH, HEIGHT, scale};
