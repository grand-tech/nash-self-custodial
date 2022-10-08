import {AnimationObject} from 'lottie-react-native';

/**
 * Screen component properties.
 * @typedef {Object} ScreenComponentProps properties expected by the screen component.
 * @property { React.ReactNode } childComponents the components to be rendered on the constructed screen.
 * @property { any } statusBarColor
 * @property { {} } style the additional stylings of the screen.
 */
export interface CarouselItem {
  title: string;
  body: string;
  lottieAnimation?: AnimationObject;
}

/**
 * Card  component properties.
 * @typedef {Object} CarouselCardItemProps properties expected by the screen component.
 * @property { CarouselItem } item the carousel item type..
 * @property { number } statusBarColor
 * @property { {} } index the index of the displayed item in the array of items.
 */
export interface CarouselCardItemProps {
  item: CarouselItem;
  index: number;
}
