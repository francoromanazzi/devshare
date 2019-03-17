// Sign up a new user with a GitHub popup
export const signUp = ({ firebase, firestore }) => dispatch => {
  const provider = new firebase.auth.GithubAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result =>
      firestore
        .collection('users')
        .doc(result.user.uid)
        .set({
          username: result.additionalUserInfo.username
        })
    )
    .then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' });
    })
    .catch(err => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
};
