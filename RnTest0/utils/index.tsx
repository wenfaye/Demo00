import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const scale = screenWidth / 375;

export  {scale}

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10? '0' + minutes : minutes}:${seconds < 10? '0' + seconds : seconds}`;
}

export const pxToDp = (size: number): number => {
  if (typeof size === 'number') {
    return Math.round(size * scale + 0.5);
  }
  return size;
};
