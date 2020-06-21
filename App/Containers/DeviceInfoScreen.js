// @flow

// An All Components Screen is a great way to dev and quick-test components
import React from 'react'
import { View, ScrollView, Text, Image } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import DeviceInfo from 'react-native-device-info'
import { Metrics, Images, Colors } from '../Themes'
import styles from './Styles/DeviceInfoScreenStyle'

const HARDWARE_DATA = [
    { title: 'Device Manufacturer', info: DeviceInfo.getManufacturer() },
    { title: 'Device Name', info: DeviceInfo.getDeviceName() },
    { title: 'Device Model', info: DeviceInfo.getModel() },
    { title: 'Device Unique ID', info: DeviceInfo.getUniqueId() },
    { title: 'User Agent', info: DeviceInfo.getUserAgent() },
    { title: 'Screen Width', info: Metrics.screenWidth },
    { title: 'Screen Height', info: Metrics.screenHeight }
]

const OS_DATA = [
    { title: 'Device System Name', info: DeviceInfo.getSystemName() },
    { title: 'Device ID', info: DeviceInfo.getDeviceId() },
    { title: 'Device Version', info: DeviceInfo.getSystemVersion() }
]

const APP_DATA = [
    { title: 'Bundle Id', info: DeviceInfo.getBundleId() },
    { title: 'Build Number', info: DeviceInfo.getBuildNumber() },
    { title: 'App Version', info: DeviceInfo.getVersion() },
    { title: 'App Version (Readable)', info: DeviceInfo.getReadableVersion() }
]

export default class DeviceInfoScreen extends React.Component {
    state: {
        isConnected: boolean,
        connectionInfo: Object | null,
        connectionInfoHistory: Array < any >
    }

    constructor(props: Object) {
        super(props)

        this._unsubscribe = null

        this.state = {
            isConnected: false,
            type: null,
            details: []
        }
    }

    componentDidMount() {
        this._unsubscribe = NetInfo.addEventListener(state => {
          this.setState({ isConnected: state.isConnected, type: state.type, details: state.details })
        })

        NetInfo.fetch().then(state => {
          this.setState({ isConnected: state.isConnected, type: state.type, details: state.details })
        })

        // NetInfo.isConnected.addEventListener('connectionChange', this.setConnected)
        // NetInfo.isConnected.fetch().then(this.setConnected)
        // NetInfo.addEventListener('connectionChange', this.setConnectionInfo)
        // NetInfo.getConnectionInfo().then(this.setConnectionInfo)
        // NetInfo.addEventListener('connectionChange', this.updateConnectionInfoHistory)

        // an example of how to display a custom Reactotron message
        // console.tron.display({
        //   name: 'SPECS',
        //   value: {
        //     hardware: fromPairs(map((o) => [o.title, o.info], HARDWARE_DATA)),
        //     os: fromPairs(map((o) => [o.title, o.info], OS_DATA)),
        //     app: fromPairs(map((o) => [o.title, o.info], APP_DATA))
        //   },
        //   preview: 'About this device...'
        // })
    }

    componentWillUnmount() {
        this._unsubscribe && this._unsubscribe()
        // NetInfo.isConnected.removeEventListener('connectionChange', this.setConnected)
        // NetInfo.removeEventListener('connectionChange', this.setConnectionInfo)
        // NetInfo.removeEventListener('connectionChange', this.updateConnectionInfoHistory)
    }

    netInfo() {
        return ([
            { title: 'Connection', info: (this.state.isConnected ? 'Online' : 'Offline') },
            { title: 'Connection Type', info: JSON.stringify(this.state.type) },
            { title: 'Connection Details', info: JSON.stringify(this.state.details) }
        ])
    }

    renderCard(cardTitle: string, rowData: Array<Object> ) {
        return (
          <View style = { styles.cardContainer }>
            <Text style = { styles.cardTitle }>
              { cardTitle.toUpperCase() }
            </Text>
            { this.renderRows(rowData) }
          </View >
        )
    }

    renderRows(rowData: Array<Object> ) {
        return rowData.map((cell) => {
            const { title, info } = cell
            return (
              <View key = { title } style = { styles.rowContainer }>
                <View style = { styles.rowLabelContainer }>
                  <Text style = { styles.rowLabel }>
                    { title }
                  </Text>
                </View>
                <View style = { styles.rowInfoContainer }>
                  <Text style = { styles.rowInfo }>
                    { ( typeof info === 'object' ) ? info['_55'] : info }
                  </Text>
                </View>
              </View>
            )
        })
    }

    render() {
        return (
          <View style = { styles.mainContainer }>
            <Image source = { Images.bg } style = { styles.backgroundImage } resizeMode = 'stretch' />
              <ScrollView style = { styles.container }>
                <View style = { styles.section }>
                  <Text style = {[styles.sectionText, { color: Colors.coal }]}>
                    Dedicated to identifying specifics of the device.
                    All info useful for identifying outlying behaviour
                    specific to a device.
                  </Text>
                </View>
                { this.renderCard('Device Hardware', HARDWARE_DATA) }
                { this.renderCard('Device OS', OS_DATA) }
                { this.renderCard('App Info', APP_DATA) }
                { this.renderCard('Net Info', this.netInfo()) }
              </ScrollView>
            </View >
        )
    }
}