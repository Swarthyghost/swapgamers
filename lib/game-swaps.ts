import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  platform: 'ps4' | 'ps5' | 'xbox' | 'switch' | 'pc';
  genre: string[];
  releaseYear: number;
  rating: number;
  owner: string; // user ID
  available: boolean;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  location: string;
  createdAt: Timestamp;
  swapRequests?: string[]; // IDs of users who requested swap
}

export interface SwapRequest {
  id: string;
  gameId: string;
  requesterId: string;
  ownerId: string;
  requestedGameId?: string; // for direct swaps
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  meetingLocation?: string;
  meetingTime?: Timestamp;
}

export interface SwapHistory {
  id: string;
  userId: string;
  gameId: string;
  partnerId: string;
  partnerName: string;
  gameTitle: string;
  partnerGameTitle?: string;
  type: 'given' | 'received';
  status: 'completed' | 'cancelled';
  rating?: number;
  review?: string;
  completedAt: Timestamp;
}

// Game Operations
export const createGame = async (gameData: Omit<Game, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'games'), {
      ...gameData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getGames = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'games'),
      where('available', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Game[];
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

export const getUserGames = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'games'),
      where('owner', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Game[];
  } catch (error) {
    console.error('Error fetching user games:', error);
    return [];
  }
};

export const updateGame = async (gameId: string, data: Partial<Game>) => {
  try {
    await updateDoc(doc(db, 'games', gameId), data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteGame = async (gameId: string) => {
  try {
    await deleteDoc(doc(db, 'games', gameId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Swap Request Operations
export const createSwapRequest = async (requestData: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'swapRequests'), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getSwapRequests = async (userId: string, type: 'sent' | 'received' = 'received') => {
  try {
    const q = query(
      collection(db, 'swapRequests'),
      where(type === 'sent' ? 'requesterId' : 'ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SwapRequest[];
  } catch (error) {
    console.error('Error fetching swap requests:', error);
    return [];
  }
};

export const updateSwapRequest = async (requestId: string, data: Partial<SwapRequest>) => {
  try {
    await updateDoc(doc(db, 'swapRequests', requestId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const respondToSwapRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
  return updateSwapRequest(requestId, { status });
};

// Swap History Operations
export const addToSwapHistory = async (historyData: Omit<SwapHistory, 'id' | 'completedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'swapHistory'), {
      ...historyData,
      completedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getSwapHistory = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'swapHistory'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SwapHistory[];
  } catch (error) {
    console.error('Error fetching swap history:', error);
    return [];
  }
};

// Real-time listeners
export const listenToSwapRequests = (userId: string, callback: (requests: SwapRequest[]) => void) => {
  const q = query(
    collection(db, 'swapRequests'),
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SwapRequest[];
    callback(requests);
  });
};

export const listenToUserGames = (userId: string, callback: (games: Game[]) => void) => {
  const q = query(
    collection(db, 'games'),
    where('owner', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Game[];
    callback(games);
  });
};
