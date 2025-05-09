import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import { GameProvider } from './contexts/GameContext';
import GameBoard from './components/GameBoard';
import { View, Text, StyleSheet } from 'react-native';

const theme = {
  colors: {
    primary: '#2C3E50',
    secondary: '#E74C3C',
    background: '#ECF0F1',
    text: '#2C3E50',
    card: '#FFFFFF',
    border: '#BDC3C7',
    error: '#dc3545',
    success: '#28a745',
    warning: '#ffc107'
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: 8,
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
};

const App: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <GameProvider>
          <GameBoard />
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#dc3545'
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d'
  }
});

export default App; 