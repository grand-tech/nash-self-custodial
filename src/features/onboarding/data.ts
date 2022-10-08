import {CarouselItem} from './components/Interfaces';

export const seedPhraseInstructions: Array<CarouselItem> = [
  {
    title: 'Your Recovery Phrase is a special kind of password',
    body: 'Your Recovery Phrase is the one and only way to access your account',
  },
  {
    title: 'Without your Recovery Phrase, you can lose access forever',
    body: 'If you lose your phone, you must have your Recovery Phrase to get your account back. Nobody, not even Kukuza, will be able to recover your funds without it',
  },
  {
    title: 'Write it down',
    body: 'Write down your Recovery Phrase and store it in a safe place. Do not save it in your phone.',
  },
  {
    title: 'Keep your phrase private',
    body: 'Anyone with your Phrase wil have access to your account and all its funds. Don’t share it with others.',
  },
];

export const startScreenData: Array<CarouselItem> = [
  {
    title: 'Easy',
    body: 'Nash makes it easy for you to top up your cUSD wallet. Both Add or withdraw cUSD',
    lottieAnimation: require('../../../assets/lottie_animations/easy.json'),
  },
  {
    title: 'Speed',
    body: 'Post a request, will get answered SUPER FAST, by community a member of the community.',
    lottieAnimation: require('../../../assets/lottie_animations/speed.json'),
  },
  {
    title: 'Earn',
    body: 'Want to be a community yourself? Fullfill requests and earn a profit. the faster you fulfill, the more you earn.',
    lottieAnimation: require('../../../assets/lottie_animations/earn_money.json'),
  },
];
