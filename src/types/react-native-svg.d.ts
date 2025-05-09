declare module 'react-native-svg' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
  }

  export interface PathProps extends ViewProps {
    d?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    transform?: string;
  }

  export class Svg extends Component<SvgProps> {}
  export class Path extends Component<PathProps> {}
} 