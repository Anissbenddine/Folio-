import { IonImg, IonIcon, IonAvatar } from '@ionic/react';
import React, { Component } from 'react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { aperture, closeCircleOutline } from 'ionicons/icons';
import firebase from "firebase";
import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

const INITIAL_STATE = {
  photo: '',
  needsLoading: true,
  canDelete: false,
};


export class TakePicture extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    defineCustomElements(window);
  }

  takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        targetHeight: 200,
        targetWidth: 200,
      });

      this.setState({
        photo: image.webPath,
        needsLoading: false,
        canDelete: false,
      });

      this.uploadToStorage();
    } catch (error) {
      // User cancelled operation.
    }
  }

  removePicture = async () => {
    const fileName = "profilPictures/" + firebase.auth().currentUser.uid;
    try {
      localStorage.removeItem("profile-picture-cache");
      firebase.storage().ref(fileName).delete();
      firebase.database().ref("profiles/" + firebase.auth().currentUser.uid).update({
        "profilPicture": '',
      });
      this.setState({
        photo: '',
        needsLoading: false,
        canDelete: false,
      });
    } catch (error) {
    }
  }


  uploadToStorage = () => {
    const fileName = "profilPictures/" + firebase.auth().currentUser.uid;
    var getFileBlob = function (url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.addEventListener('load', function () {
        cb(xhr.response);
      });
      xhr.send();
    };
    getFileBlob(this.state.photo, blob => {
      firebase.storage().ref(fileName).put(blob).then((snapshot) => {
        this.setState({
          ...this.state,
          needsLoading: false,
          canDelete: true,
        });
        firebase.database().ref("profiles/" + firebase.auth().currentUser.uid).update({
          "profilPicture": fileName
        }).catch(() => { });
      }).catch((err) => {
        this.setState({
          photo: '',
          needsLoading: false,
          canDelete: false,
        });
      });
    })
  }

  // Download image from firebase storage and set photo state
  async downloadImage() {
    // Si l'URL est connu.
    const cachedURL = localStorage.getItem("profile-picture-cache");
    if (cachedURL) {
      this.setState({ photo: cachedURL, needsLoading: false, canDelete: true });
      return;
    }

    // Fetch image from storage or provider profile
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child("profilPictures/" + firebase.auth().currentUser.uid);
    let photoUrl = '';

    let canDelete = false;
    try {
      photoUrl = await imageRef.getDownloadURL();
      canDelete = true;
    } catch (err) {
      // Si aucune photo custom, on utilise la photo de Fb/Google
      if (!photoUrl && firebase.auth().currentUser?.photoURL) {
        photoUrl = firebase.auth().currentUser.photoURL;
      }
    }

    localStorage.setItem("profile-picture-cache", photoUrl);
    this.setState({ photo: photoUrl, needsLoading: false, canDelete });
  }

  componentDidMount() {
    let { photo, needsLoading } = this.state;
    if (!photo && needsLoading) {
      this.downloadImage();
    }
  }

  render() {
    return (
      <div>
        <button className="sideBarButtonCamera" onClick={this.takePicture} color="danger">
          <IonIcon icon={aperture} />
        </button>
        { this.state.canDelete &&
          <button className="sideBarButtonDelete" onClick={this.removePicture} color="danger">
            <IonIcon icon={closeCircleOutline} />
          </button>
        }
        <IonAvatar className='avatarProfil'>
          {this.state.photo && <IonImg style={{ 'border': '1px solid black', 'minHeight': '100px' }} src={this.state.photo} data-testid="profile-picture" ></IonImg>}
        </IonAvatar>
      </div>
    );
  }
}
export default TakePicture;
