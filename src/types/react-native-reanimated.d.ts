declare module 'react-native-reanimated' {
  import { ComponentType } from 'react';
  import { ViewProps, TextProps, ImageProps, FlatListProps, ViewStyle } from 'react-native';

  export type AnimatableStringValue = string;
  export type AnimatableNumericValue = number;

  export interface AnimatedProps<T> extends T {
    animatedStyle?: ViewStyle;
  }

  export interface AnimatedComponent<T> extends ComponentType<AnimatedProps<T>> {}

  export function useSharedValue<T>(initialValue: T): { value: T };
  export function useAnimatedStyle(updater: () => ViewStyle): ViewStyle;
  export function withSpring(value: number | string, config?: any): number;
  export function withTiming(value: number | string, config?: any): number;
  export function withSequence(...values: any[]): number;

  // Export components directly
  export const View: ComponentType<AnimatedProps<ViewProps>>;
  export const Text: ComponentType<AnimatedProps<TextProps>>;
  export const Image: ComponentType<AnimatedProps<ImageProps>>;
  export const FlatList: <T = any>(props: AnimatedProps<FlatListProps<T>>) => JSX.Element;
} 