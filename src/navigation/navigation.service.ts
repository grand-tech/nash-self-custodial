import {createNavigationContainerRef} from '@react-navigation/native';
import {OnboardingNavigationStackParamsList} from '../features/onboarding/navigation/navigation.params.type';

/**
 * References an instance of the apps navigation container to allow us
 * to trigger navigation inside redux saga or any other redux middle ware.
 */
export const navigationRef = createNavigationContainerRef();

/**
 * Navigates from one screen to another.
 * @param args arguments expected for routing.
 */
export function navigate<RouteName extends keyof RouteParamsList>(
  ...args: undefined extends RouteParamsList[RouteName]
    ? [RouteName] | [RouteName, RouteParamsList[RouteName]]
    : [RouteName, RouteParamsList[RouteName]]
) {
  const [routeName, params] = args;
  if (navigationRef.isReady()) {
    navigationRef.navigate(routeName, params);
  }
}

/**
 * Consolidate all typed route params into one type.
 */
export type RouteParamsList = OnboardingNavigationStackParamsList;
