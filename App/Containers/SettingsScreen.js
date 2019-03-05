// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Switch, Picker, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import MapActions from '../Redux/MapRedux'
import { Colors, Images, Metrics } from '../Themes'
import { CheckBox, Card, Button, List, ListItem, ButtonGroup } from 'react-native-elements'
import SettingsList from 'react-native-settings-list';

// external libs
// import PushNotification from 'react-native-push-notification'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import I18n from 'react-native-i18n'

// Styles
import styles from './Styles/SettingsScreenStyle'

class SettingsScreen extends React.Component {

  capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render () {
    const { capitalizeFirstLetter, mapBrand, mapStyle, traffic, toggleTraffic, duration, unitOfMeasurement, transportMode, travelTime, travelTimeName, toggleTravelTime, toggleTutorialHasRun } = this.props

    return (
      <View style={styles.mainContainer}>
        <Image source={Images.bg} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>

          <View style={{flex:1}}>
            <View style={{flex:1}}>
              <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
        	      <SettingsList.Header headerText='Map' headerStyle={{color:'#68676d'}}/>
                <SettingsList.Item
                  itemWidth={50}
                  title='Map type'
                  titleInfo={mapBrand}
                  titleInfoStyle={{color: '#828186'}}
                  onPress={() => this.props.navigation.navigate('MapSelect')}
                />
                <SettingsList.Item title='Map style' titleInfo={mapStyle} titleInfoStyle={{color: '#828186'}} onPress={() => this.props.navigation.navigate('MapStyle')} />
                <SettingsList.Item title='Unit of measurement' titleInfo={unitOfMeasurement} titleInfoStyle={{color: '#828186'}} onPress={() => this.props.navigation.navigate('Measurement')} />
                <SettingsList.Item
                  hasNavArrow={ false }
                  switchState={ traffic }
                  switchOnValueChange={ toggleTraffic }
                  hasSwitch={ true }
                  title='Traffic'
                />
                <SettingsList.Header headerText='Isochrones' headerStyle={{color:'#68676d', marginTop:50}}/>
                <SettingsList.Item title='Max duration' titleInfo={duration.toString() + 'min'} titleInfoStyle={{color: '#828186'}} onPress={() => this.props.navigation.navigate('MaxDuration')} />
                <SettingsList.Item
                  hasNavArrow={false}
                  switchState={ travelTime }
                  switchOnValueChange={ toggleTravelTime }
                  hasSwitch={ true }
                  title={ 'Travel time ' + travelTimeName }
                />
                <SettingsList.Header headerStyle={{marginTop:50}}/>
                <SettingsList.Item hasNavArrow={ false }
                  title='Run Tutorial'
                  titleStyle={ { color: Colors.skyBlueLight} }
                  onPress={ () => {
                     toggleTutorialHasRun()
                     alert('Tutorial will run when you leave settings')
                   } }
                />
                <SettingsList.Item title='About' onPress={ () => this.props.navigation.navigate('DeviceInfo') } />
              </SettingsList>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

SettingsScreen.propTypes = {
  mapBrand: PropTypes.string,
  duration: PropTypes.number,
  traffic: PropTypes.bool,
  unitOfMeasurement: PropTypes.string,
  mapStyle: PropTypes.string,
  toggleTraffic: PropTypes.func,
  transportMode: PropTypes.string,
  travelTime: PropTypes.bool,
  travelTimeName: PropTypes.string,
  toggleTravelTime: PropTypes.func,
  toggleTutorialHasRun: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    mapBrand: state.map.mapBrand,
    duration: state.map.duration,
    traffic: state.map.traffic,
    unitOfMeasurement: state.map.unitOfMeasurement,
    mapStyle: state.map.mapStyle,
    mapTileName: state.map.mapTileName,
    transportMode: state.map.transportMode,
    travelTime: state.map.travelTime,
    travelTimeName: state.map.travelTimeName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleTraffic: () => dispatch(MapActions.toggleTraffic()),
    toggleTravelTime: () => dispatch(MapActions.toggleTravelTime()),
    toggleTutorialHasRun: () => dispatch(MapActions.toggleTutorialHasRun()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
