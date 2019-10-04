import React from 'react';
import { Text, View, Button, StyleSheet, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';


export default class CameraExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      pictureBase64: 'https://pngdrive.com/wp-content/uploads/edd/2019/07/pngdrive-1000X1000-PIZZA-17.jpg',
      loading: false
    }
  }
  

  snap = async () => {
    /* this.setState({ loading: true }); */
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({ base64: true })
      this.setState({ pictureBase64: 'data:image/jpg;base64,' + photo.base64, loading: false });
    }
  }

  flip = () => {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    });
  }

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera 
        style={styles.camera} 
        type={this.state.type}
        ratio="8:9"
        ref={ref => {
          this.camera = ref
        }}
      >
        <View
          style={styles.topBar}>
          <Button
            style={styles.button}
            onPress={this.flip}
            title="Flip">
          </Button>
          <Button 
            onPress={this.snap}
            style={styles.button}
            title="Snap"/>
        </View>
      </Camera>
    </View>
  )

  renderPicture = () => (
    <View style={{ flex: 1 }}>
      <Image style={{flex:1}} source={{ uri: this.state.pictureBase64 }}></Image>
    </View>
  )

  

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          {this.state.loading ? <Text style={{ marginTop: 20, color: 'white' }}>Carregando...</Text> : null }
          {this.renderPicture()}
          {this.renderCamera()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    flex: 0.3,  
    justifyContent: 'center',
    alignItems: 'center',
  }
})