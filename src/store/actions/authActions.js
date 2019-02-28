// Sign up a new user with a GitHub popup
export const signUp = () => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();

  var provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('repo');

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
