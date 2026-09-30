import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import TelaListaPontos from './src/screens/TelaListaPontos';
import TelaDetalhePonto from './src/screens/TelaDetalhePonto';
import TelaFormularioDoacao from './src/screens/TelaFormularioDoacao';
import {theme} from './src/theme/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light"/>
        <Stack.Navigator
            initialRouteName="TelaListaPontos"
            screenOptions={{
              headerStyle: {backgroundColor: theme.colors.background},
              headerTintColor: theme.colors.primary,
              headerTitleStyle: {fontWeight: 'bold'},
              contentStyle: {backgroundColor: theme.colors.background},
            }}
        >
          <Stack.Screen
              name="TelaListaPontos"
              component={TelaListaPontos}
              options={{headerShown: false}}
          />
          <Stack.Screen
              name="TelaDetalhePonto"
              component={TelaDetalhePonto}
              options={{title: 'Detalhes do Ponto'}}
          />
          <Stack.Screen
              name="TelaFormularioDoacao"
              component={TelaFormularioDoacao}
              options={{title: 'Registrar Doação'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}