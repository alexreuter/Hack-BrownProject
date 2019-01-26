import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Magnetometer, Constants, Location, Permissions } from 'expo';

export default class AccelerometerSensor extends React.Component {
  state = {
    location: null,
    errorMessage: null,
    accelerometerData: {},
    MagnetometerData: {},
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    this._unsubscribe();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000); 
    Magnetometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
    Magnetometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
    this._subscription = Magnetometer.addListener((result) => {
      this.setState({MagnetometerData: result});
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;
    let { a, b, c } = this.state.MagnetometerData;

    return (
      <View style={styles.sensor}>
        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      <Text>Magnetometer:</Text>
        <Text>x: {round(a)} y: {round(b)} z: {round(c)}</Text>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});


// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

// export default class Project extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// AppRegistry.registerComponent('Project', () => Project);




// import React from 'react';
// import {
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { WebBrowser } from 'expo';
// import { MonoText } from '../components/StyledText';

// export default class HomeScreen extends React.Component {
//   static navigationOptions = {
//     header: null,
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//           <View style={styles.welcomeContainer}>
//             <Image
//               source={
//                 __DEV__
//                   ? require('../assets/images/robot-dev.png')
//                   : require('../assets/images/robot-prod.png')
//               }
//               style={styles.welcomeImage}
//             />
//           </View>

//           <View style={styles.getStartedContainer}>
//             {this._maybeRenderDevelopmentModeWarning()}

//             <Text style={styles.getStartedText}>Get started by opening</Text>

//             <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
//               <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
//             </View>

//             <Text style={styles.getStartedText}>
//               Change Hi Tyler.
//             </Text>
//           </View>

//           <View style={styles.helpContainer}>
//             <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
//               <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         <View style={styles.tabBarInfoContainer}>
//           <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

//           <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
//             <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   _maybeRenderDevelopmentModeWarning() {
//     if (__DEV__) {
//       const learnMoreButton = (
//         <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
//           Learn more
//         </Text>
//       );

//       return (
//         <Text style={styles.developmentModeText}>
//           Development mode is enabled, your app will be slower but you can use useful development
//           tools. {learnMoreButton}
//         </Text>
//       );
//     } else {
//       return (
//         <Text style={styles.developmentModeText}>
//           You are not in development mode, your app will run at full speed.
//         </Text>
//       );
//     }
//   }

//   _handleLearnMorePress = () => {
//     WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
//   };

//   _handleHelpPress = () => {
//     WebBrowser.openBrowserAsync(
//       'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
//     );
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
