import React from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Switch, Picker, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import MapActions from '../Redux/MapRedux'
import { Colors, Images, Metrics } from '../Themes'
import { CheckBox, Card, Button, List, ListItem, ButtonGroup } from 'react-native-elements'
import SettingsList from 'react-native-settings-list';

import Icon from 'react-native-vector-icons/FontAwesome'

// Styles
import styles from './Styles/SettingsScreenStyle'

class MapStyleScreen extends React.Component {

  render () {
    const { mapStyle, setMapStyle } = this.props

    return (
      <View style={styles.mainContainer}>
        <Image source={Images.bg} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
            <SettingsList.Header />
              {['Standard', 'Satellite', 'Hybrid'].map((mapStyleName, index) =>
                <SettingsList.Item
                  title={mapStyleName}
                  key={index}
                  onPress={() => setMapStyle(mapStyleName)}
                  arrowIcon={ ( <Icon name="check" size={14} style={{ paddingRight: 20, paddingTop: 20 }} color={(mapStyle === mapStyleName) ? Colors.skyBlueLight : "rgba(255,255,255,0)"} /> ) }
                />
              )}
          </SettingsList>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mapStyle: state.map.mapStyle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setMapStyle: (mapStyleName) => dispatch(MapActions.setMapStyle(mapStyleName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapStyleScreen)
