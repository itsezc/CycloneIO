import React from 'react'
import { 
	StatusBar, 
	StyleSheet, 
	View, 
	Dimensions, 
	WebView 
} from 'react-native'
import { ScreenOrientation } from 'expo'

export default class App extends React.Component {

	componentDidMount() {
		ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE)
 	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />

				<WebView 
					scalesPageToFit={true}
					bounces={false}
					scrollEnabled={false}
					source={{ uri: 'http://192.168.0.17:8080/inroom' }} 
					originWhitelist={['*']}
					style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#68E5FF'
    }
})
