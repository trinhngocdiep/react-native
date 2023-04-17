/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import auth from './auth/auth';

function App(): JSX.Element {
  useEffect(() => {
    auth.getMethods().then(e => {
      setMethod(JSON.stringify(e));
    });
  }, []);
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');

  function handleSetup() {
    setStatus('loading...');
    auth.setupKeys().then(e => {
      setStatus(JSON.stringify(e));
    });
  }

  function handleAuth() {
    setStatus('loading...');
    auth.sendAuth('Identify yourself').then(e => {
      setStatus(JSON.stringify(e));
    });
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View>
            <Text>Supported authentication methods: {method}</Text>
          </View>
          <View>
            <Button title="Setup biometrics" onPress={handleSetup}></Button>
          </View>
          <View>
            <Button title="Authenticate" onPress={handleAuth}></Button>
          </View>
          <View>
            <Text>{status}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
