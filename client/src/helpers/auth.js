import { store, firebaseAuth } from "../constants";

export async function auth({ email, password }) {
  const user = await firebaseAuth().createUserWithEmailAndPassword(
    email,
    password
  );
  return saveUser(user);
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login({ email, password }) {
  return firebaseAuth().signInWithEmailAndPassword(email, password);
}

export function resetPassword({ email }) {
  return firebaseAuth().sendPasswordResetEmail(email);
}

export async function saveUser(user) {
  console.log(user);
  let useruid = user.user.uid;
  return store
    .collection("users")
    .doc(useruid)
    .set({
      email: user.user.email,
      uid: user.user.uid,
    })
    .then(() => user);
}
