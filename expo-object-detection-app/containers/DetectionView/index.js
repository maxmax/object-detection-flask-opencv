import { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
  TextInput
} from 'react-native';

function DetectionView(props) {

  const [ stateSource, onChangeStateSource] = useState('');

  const {
    state,
    source,
    sourceForm,
    getData,
    getVideo,
    stopVideo,
    swithSourceForm,
    sendSource,
  } = props.detectionStore;

  return (
    <View style={styles.container}>
      {sourceForm && (
        <>
          <TextInput
            style={styles.input}
            onChangeText={onChangeStateSource}
            value={stateSource}
          />
          <br />
          <Button
            title="Save source"
            onPress={() => sendSource(stateSource)}
            color="#f194ff"
          />
        </>
      )}
      {state === 'stop' && (
        <>
          <Button
            title="Start"
            onPress={() => getVideo()}
          />
          <br />
          <Button
            title="Change source"
            onPress={() => swithSourceForm()}
            color="#f194ff"
          />
        </>
      )}
      {state === 'pending' && (
        <ActivityIndicator size="large" />
      )}
      {state === 'done' && (
        <>
          <Image
            style={styles.videoDetection}
            source={{uri: source}}
          />
          <br />
          <Button
            title="Stop"
            onPress={() => stopVideo()}
          />
          <StatusBar style="auto" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoDetection: {
    width: 600,
    height: 400,
    maxWidth: '100%',
    border: '1px solid #000000',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default inject("detectionStore")(observer(DetectionView));
