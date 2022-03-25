import React from "react";
import { Button } from "react-native";

import { auth, database } from '../../config/firebase';

// Google auth
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Store new users data
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();


const LoginWithGoogle = () => {

    const onHandleLogin = () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            if(user) {
                setDoc(doc(database, "users", user.uid), {
                    location: 'Chennai',
                    name: user.email,
                    phone_number: '9876543210',
                    role: 'help-seeker',
                    user_id: user.email
                  })
            }
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      };

    return(
        <Button onPress={onHandleLogin} color='#f51000' title='Login with Google' />
    )
}

export default LoginWithGoogle;