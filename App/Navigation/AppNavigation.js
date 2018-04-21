import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'

import LoginScreen from '../Containers/LoginScreen'
import DeviceInfoScreen from '../Containers/DeviceInfoScreen'
import TravContainer from '../Containers/TravContainer'
import SettingsScreen from '../Containers/SettingsScreen'
import MapSelectScreen from '../Containers/MapSelectScreen'
import MapStyleScreen from '../Containers/MapStyleScreen'
import MaxDurationScreen from '../Containers/MaxDurationScreen'
import MeasurementScreen from '../Containers/MeasurementScreen'
import TransportModeScreen from '../Containers/TransportModeScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  TravContainer: { screen: TravContainer },
  DeviceInfo: {
    screen: DeviceInfoScreen,
    navigationOptions: () => ({
      title: 'Device Info',
    }),
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  MapSelect: {
    screen: MapSelectScreen,
    navigationOptions: () => ({
      title: 'Map Type',
    }),
  },
  MapStyle: {
    screen: MapStyleScreen,
    navigationOptions: () => ({
      title: 'Map Style',
    }),
  },
  MaxDuration: {
    screen: MaxDurationScreen,
    navigationOptions: () => ({
      title: 'Max Duration',
    }),
  },
  Measurement: {
    screen: MeasurementScreen,
    navigationOptions: () => ({
      title: 'Unit of Measurement',
    }),
  },
  TransportMode: {
    screen: TransportModeScreen,
    navigationOptions: () => ({
      title: 'Transport Mode',
    }),
  },
  LaunchScreen: { screen: LaunchScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'TravContainer',
  navigationOptions: {
    headerStyle: styles.header, 
  }
})

export default PrimaryNav
