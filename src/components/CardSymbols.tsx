import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SymbolProps {
  color: string;
  size?: number;
}

export const HeartSymbol: React.FC<SymbolProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </Svg>
);

export const DiamondSymbol: React.FC<SymbolProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2L2 12l10 10 10-10L12 2z"
      fill={color}
    />
  </Svg>
);

export const ClubSymbol: React.FC<SymbolProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2c-2.76 0-5 2.24-5 5 0 1.82.98 3.41 2.42 4.27C7.5 12.5 5 15.5 5 19c0 2.76 2.24 5 5 5s5-2.24 5-5c0-3.5-2.5-6.5-6.42-7.73C16.02 10.41 17 8.82 17 7c0-2.76-2.24-5-5-5z"
      fill={color}
    />
  </Svg>
);

export const SpadeSymbol: React.FC<SymbolProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2L2 12l10 10 10-10L12 2z"
      fill={color}
      transform="rotate(45 12 12)"
    />
  </Svg>
);

export const DiyaIcon: React.FC<SymbolProps> = ({ color, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
      fill={color}
    />
  </Svg>
); 