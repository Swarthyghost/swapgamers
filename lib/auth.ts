import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  fullName?: string;
  phone?: string;
  momoNumber?: string;
  momoProvider?: "mtn" | "telecel";
  createdAt: any;
  lastLoginAt?: any;
  profileImage?: string;
  bio?: string;
  location?: string;
  preferredGames?: string[];
  swapHistory?: string[];
  rating?: number;
  totalSwaps?: number;
}

export const signUp = async (
  email: string,
  password: string,
  userData: Partial<UserData>,
) => {
  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Update profile with display name
    if (userData.fullName) {
      await updateProfile(user, {
        displayName: userData.fullName,
      });
    }

    // Create user document in Firestore
    const fullUserData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName: userData.fullName || userData.displayName,
      fullName: userData.fullName,
      phone: userData.phone,
      momoNumber: userData.momoNumber,
      momoProvider: userData.momoProvider,
      createdAt: serverTimestamp(),
      rating: 5.0,
      totalSwaps: 0,
      preferredGames: [],
      swapHistory: [],
    };

    await setDoc(doc(db, "users", user.uid), fullUserData);

    return { success: true, user };
  } catch (error: any) {
    let errorMessage = "An error occurred during sign up";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already registered";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return { success: false, error: errorMessage };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let errorMessage = "An error occurred during sign in";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return { success: false, error: errorMessage };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let errorMessage = "An error occurred sending reset email";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return { success: false, error: errorMessage };
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getSwapHistory = async (userId: string) => {
  try {
    const q = query(
      collection(db, "swapHistory"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(50),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching swap history:", error);
    return [];
  }
};
