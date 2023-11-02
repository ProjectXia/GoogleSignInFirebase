import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client';
import { GoogleSignin ,GoogleSigninButton} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

GoogleSignin.configure({
  webClientId: '1040100927005-o5qjb9n4f81i213td4bai81kjlav2iur.apps.googleusercontent.com',
});

export default function App() {
  const [init, setInit] = useState(true);
  const [user, setUser] = useState();

  //handle the user state change
  function onAuthStateChanged(user){
    setUser(user)
    if(init) setInit(false);
  }

  useEffect(()=>{
const unsub = auth().onAuthStateChanged(onAuthStateChanged);
return unsub;

  },[])

  const signIN =async ()=> {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the user ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // Link the user with the credential
  // const firebaseUserCredential = await auth().currentUser.linkWithCredential(googleCredential);
  // You can store in your app that the account was linked.
    const user_signin = auth().signInWithCredential(googleCredential).then((user)=>{console.log(user)}).catch((error)=>{console.log(error)})
    return Promise.reject();
  }
const signOut = async () =>{
  try{
    await GoogleSignin.revokeAccess();
    await auth().signOut();
  }catch(error){console.log(error)}
}
if(init) return null;
  return (
    <View style={styles.container}>
      <Text style={{fontWeight:"bold",fontSize:28,marginBottom:50}}>Google Sigin with Firebase</Text>
      <GoogleSigninButton onPress={signIN}/>
      {user && <Image source={{uri:user.photoURL}} style={{width:100,height:100}}/>}
      {user && <Text>{user.displayName}</Text>}
      <StatusBar style="auto" />
      <Button title='Sign Out' onPress={signOut}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 