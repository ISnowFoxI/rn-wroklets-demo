
import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  runAsync,
} from 'react-native-vision-camera';
import { useRunOnJS } from 'react-native-worklets-core';
function App() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [counter, setCounter] = React.useState(0);


  const test = useRunOnJS(async () => {
    setCounter(prev => prev + 1);
  }, [setCounter]);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';

      runAsync(frame, () => {
        'worklet';
        test();
      });
    },
    [test],
  );

  useEffect(() => {
    if (hasPermission === false) {
      requestPermission().then((res) => {
        console.log(res);
      });
    }
  }, [hasPermission, requestPermission]);

  if (device == null) { return <Text>lsdjkjasd</Text>; }
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <View style={{ backgroundColor: 'white', padding: 10, zIndex: 1 }}>
        <Text style={{ color: 'black', fontSize: 16, zIndex: 1 }}>
          {counter}
        </Text>
      </View>
    </View>
  );
}


export default App;
