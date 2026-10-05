import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import TelaListaPontos from './src/screens/TelaListaPontos';
import TelaDetalhePonto from './src/screens/TelaDetalhePonto';
import TelaFormularioDoacao from './src/screens/TelaFormularioDoacao';
import TelaDetalheDoacao from './src/screens/TelaDetalheDoacao';
import {theme} from './src/theme/theme';
import {RootStackParamList} from './src/types/types';
import TelaDoacoes from "./src/screens/TelaDoacoes";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <Stack.Screen
              name="TelaDoacoes"
              component={TelaDoacoes}
              options={{title: 'Minhas Doações'}}
          />
          <Stack.Screen
              name="TelaDetalheDoacao"
              component={TelaDetalheDoacao}
              options={{title: 'Detalhes da Doação'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}