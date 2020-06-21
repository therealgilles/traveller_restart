import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LaunchScreen from '../Containers/LaunchScreen'
import DeviceInfoScreen from '../Containers/DeviceInfoScreen'
import TravContainer from '../Containers/TravContainer'
import SettingsScreen from '../Containers/SettingsScreen'
import MapSelectScreen from '../Containers/MapSelectScreen'
import MapStyleScreen from '../Containers/MapStyleScreen'
import MaxDurationScreen from '../Containers/MaxDurationScreen'
import MeasurementScreen from '../Containers/MeasurementScreen'
import TransportModeScreen from '../Containers/TransportModeScreen'
import { Colors } from '../Themes/'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
    TravContainer: {
        screen: TravContainer,
        navigationOptions: {
            title: 'Map',
            headerShown: false,
        },
    },
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
    initialRouteName: 'TravContainer',
    navigationOptions: {
        headerStyle: {
            backgroundColor: Colors.background,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
    // headerMode: 'float',
    // headerTransitionPreset: 'uikit',
    // headerTransparent: 'true',
})

export default createAppContainer(PrimaryNav)