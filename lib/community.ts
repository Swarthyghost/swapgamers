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
  onSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  gameId?: string;
  swapId?: string;
  createdAt: Timestamp;
  helpful: number; // count of helpful votes
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  likedBy: string[]; // user IDs
  comments: Comment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Timestamp;
  replies?: Comment[];
}

export interface GameReview {
  id: string;
  gameId: string;
  gameTitle: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  pros: string[];
  cons: string[];
  reviewText: string;
  imageUrl?: string;
  helpful: number;
  createdAt: Timestamp;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  type: 'swap_completed' | 'game_added' | 'review_given' | 'post_created' | 'comment_liked';
  description: string;
  metadata?: any;
  createdAt: Timestamp;
}

// Review Operations
export const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
      helpful: 0,
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUserReviews = async (userId: string, type: 'given' | 'received' = 'received') => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where(type === 'given' ? 'reviewerId' : 'revieweeId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getUserRating = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('revieweeId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => doc.data() as Review);
    
    if (reviews.length === 0) return 5.0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10;
  } catch (error) {
    console.error('Error calculating user rating:', error);
    return 5.0;
  }
};

export const markReviewHelpful = async (reviewId: string) => {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), {
      helpful: arrayUnion(1)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Post Operations
export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      comments: [],
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPosts = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      likedBy: arrayUnion(userId),
      likes: arrayUnion(1)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      likedBy: arrayRemove(userId),
      likes: arrayRemove(1)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'likedBy'>) => {
  try {
    const comment = {
      ...commentData,
      id: doc(collection(db, 'comments')).id,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
    };
    
    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayUnion(comment)
    });
    return { success: true, commentId: comment.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Game Review Operations
export const createGameReview = async (reviewData: Omit<GameReview, 'id' | 'createdAt' | 'helpful'>) => {
  try {
    const docRef = await addDoc(collection(db, 'gameReviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
      helpful: 0,
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getGameReviews = async (gameTitle: string) => {
  try {
    const q = query(
      collection(db, 'gameReviews'),
      where('gameTitle', '==', gameTitle),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GameReview[];
  } catch (error) {
    console.error('Error fetching game reviews:', error);
    return [];
  }
};

export const getTopGames = async () => {
  try {
    const q = query(
      collection(db, 'gameReviews'),
      orderBy('rating', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    
    // Aggregate by game title and calculate average rating
    const gameRatings: { [key: string]: { totalRating: number; count: number; reviews: GameReview[] } } = {};
    
    querySnapshot.docs.forEach(doc => {
      const review = doc.data() as GameReview;
      if (!gameRatings[review.gameTitle]) {
        gameRatings[review.gameTitle] = { totalRating: 0, count: 0, reviews: [] };
      }
      gameRatings[review.gameTitle].totalRating += review.rating;
      gameRatings[review.gameTitle].count += 1;
      gameRatings[review.gameTitle].reviews.push(review);
    });
    
    return Object.entries(gameRatings)
      .map(([title, data]) => ({
        title,
        averageRating: Math.round((data.totalRating / data.count) * 10) / 10,
        reviewCount: data.count,
        latestReview: data.reviews[0]
      }))
      .sort((a, b) => b.averageRating - a.averageRating);
  } catch (error) {
    console.error('Error fetching top games:', error);
    return [];
  }
};

// User Activity Operations
export const logActivity = async (activityData: Omit<UserActivity, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'userActivity'), {
      ...activityData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUserActivity = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'userActivity'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserActivity[];
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }
};

export const getCommunityActivity = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'userActivity'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserActivity[];
  } catch (error) {
    console.error('Error fetching community activity:', error);
    return [];
  }
};

// Real-time listeners
export const listenToPosts = (callback: (posts: Post[]) => void) => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    callback(posts);
  });
};

export const listenToUserActivity = (userId: string, callback: (activities: UserActivity[]) => void) => {
  const q = query(
    collection(db, 'userActivity'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const activities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserActivity[];
    callback(activities);
  });
};
