import React from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Switch, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import MapActions from '../Redux/MapRedux'
import { Colors, Images, Metrics } from '../Themes'
import { CheckBox, Card, Button, List, ListItem, ButtonGroup } from 'react-native-elements'
import SettingsList from 'react-native-settings-list'

import Icon from 'react-native-vector-icons/FontAwesome'

// Styles
import styles from './Styles/SettingsScreenStyle'

class MapSelectScreen extends React.Component {

  render () {
    const { mapBrand, setMapBrand, mapTile, mapTileUrl, toggleMapTile, mapTileName, setMapTile } = this.props

    return (
      <View style={styles.mainContainer}>
        <Image source={Images.bg} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
            <SettingsList.Header headerText='Provider' headerStyle={{color:'#68676d', marginTop:50}}/>
            {['Google Maps', 'Apple Maps'].map((mapName, index) =>
              <SettingsList.Item
                title={mapName}
                key={index}
                onPress={() => setMapBrand(mapName)}
                arrowIcon={ ( <Icon name="check" size={14} style={{ paddingRight: 20, paddingTop: 20 }} color={(mapBrand === mapName) ? Colors.skyBlueLight : "rgba(255,255,255,0)"} /> ) }
              />
            )}
            <SettingsList.Header headerText='Tiles' headerStyle={{color:'#68676d', marginTop:50}}/>
            <SettingsList.Item
              hasNavArrow={false}
              switchState={mapTile}
              switchOnValueChange={toggleMapTile}
              hasSwitch={true}
              title='Map tiles'
            />
            {mapTile ? ['Toner', 'Terrain', 'Watercolor'].map((tileName, index) =>
              <SettingsList.Item
                title={tileName}
                key={index}
                onPress={() => setMapTile(tileName)}
                arrowIcon={ ( <Icon name="check" size={14} style={{ paddingRight: 20, paddingTop: 20 }} color={(mapTileName === tileName) ? Colors.skyBlueLight : "rgba(255,255,255,0)"} /> ) }
              />
            ) : undefined}
          </SettingsList>
        </ScrollView>
      </View>
    )
  }
}

MapSelectScreen.propTypes = {
  mapBrand: PropTypes.string,
  setMapBrand: PropTypes.func,
  mapTile: PropTypes.bool,
  toggleMapTile: PropTypes.func,
  setMapTile: PropTypes.func
}

const mapStateToProps = state => {
  return {
    mapBrand: state.map.mapBrand,
    mapTile: state.map.mapTile,
    mapTileName: state.map.mapTileName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMapBrand: mapName => dispatch(MapActions.setMapBrand(mapName)),
    toggleMapTile: () => dispatch(MapActions.toggleMapTile()),
    setMapTile: mapTileName => dispatch(MapActions.setMapTile(mapTileName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapSelectScreen)
