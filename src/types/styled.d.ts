import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      error: string;
      success: string;
      warning: string;
    };
    spacing: {
      small: number;
      medium: number;
      large: number;
    };
    borderRadius: number;
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
  }
} 