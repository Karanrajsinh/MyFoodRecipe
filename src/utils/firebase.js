import { db } from "../../firebase.config";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";



const usersCollection = collection(db, 'users');
const auth = getAuth();
const recipesCollection = collection(db, 'recipes')


async function createUser(email, password, name) {
    const res = await createUserWithEmailAndPassword(auth, email, password).then((response) => {
        if (response.user) {
            updateProfile(response.user, { displayName: name });
            const userColRef = doc(db, `users/${response.user.uid}`);
            setDoc(userColRef, { id: response.user.uid, name, email, recipes: [], bookmarkedRecipes: [] });
        }
    }).catch((err) => {
        throw err
    });
    return res;
}

async function loginUser(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password).catch((err) => { throw err })
    return res;
}

async function addRecipe(userId, data, name) {
    const userRef = doc(db, `/users/${userId}`);
    const recipe = await addDoc(recipesCollection, { ...data, author: name })
    const recipeRef = doc(db, `recipes/${recipe.id}`);
    updateDoc(recipeRef, { id: recipe.id });
    updateDoc(userRef, { recipes: arrayUnion(recipeRef) })
}


async function updateRecipe(recipeId, data) {
    const recipeRef = doc(db, `recipes/${recipeId}`);
    updateDoc(recipeRef, data);
}


async function deleteRecipe(userId, recipeId) {
    const userCollection = collection(db, 'users');
    let userRef = doc(db, `users/${userId}`);
    const recipeRef = doc(db, `recipes/${recipeId}`);
    deleteDoc(recipeRef);
    updateDoc(userRef, { recipes: arrayRemove(recipeRef) })
    const recipeQuery = query(userCollection, where('bookmarkedRecipes', 'array-contains', recipeRef));
    getDocs(recipeQuery).then((res) => res.docs.forEach((data) => {
        userRef = doc(db, `users/${data.id}`)
        updateDoc(userRef, { bookmarkedRecipes: arrayRemove(recipeRef) });
    }))

}

async function getRecipe(id) {
    const recipeRef = doc(db, `recipes/${id}`);
    const res = await getDoc(recipeRef);
    return res
}

async function addSavedRecipe(userId, recipeId) {
    const userRef = doc(db, `users/${userId}`);
    const recipeRef = doc(db, `recipes/${recipeId}`)
    const res = await updateDoc(userRef, { bookmarkedRecipes: arrayUnion(recipeRef) })
    return res;
}

async function removeSavedRecipe(userId, recipeId) {
    const userRef = doc(db, `users/${userId}`);
    const recipeRef = doc(db, `recipes/${recipeId}`)
    const res = await updateDoc(userRef, { bookmarkedRecipes: arrayRemove(recipeRef) })
    return res;
}

async function checkIsOwner(userId, recipeId) {

    const recipeRef = doc(db, `recipes/${recipeId}`);
    const isOwner = query(
        usersCollection,
        where('id', '==', userId),
        where('recipes', 'array-contains', recipeRef)
    );
    const res = await getDocs(isOwner);
    return res;
}

async function checkSavedRecipe(userId, recipeId) {
    const recipeRef = doc(db, `recipes/${recipeId}`);
    const isRecipeSaved = query(
        usersCollection,
        where('id', '==', userId),
        where('bookmarkedRecipes', 'array-contains', recipeRef)
    );
    const res = await getDocs(isRecipeSaved);
    return res;
}



async function getUserSavedRecipes(uid) {
    try {
        const userRecipesRef = doc(db, `users/${uid}`);
        const userDoc = await getDoc(userRecipesRef);
        const recipes = userDoc.data().bookmarkedRecipes;

        const recipePromises = recipes.map(async (recipe) => {
            const recipeRef = doc(db, `recipes/${recipe.id}`);
            const recipeDoc = await getDoc(recipeRef);
            return recipeDoc.data();
        });


        const fetchedRecipes = await Promise.all(recipePromises);
        return fetchedRecipes;
    } catch (err) {
        return err;
    }

}

async function getUserRecipes(uid) {
    try {
        const userRecipesRef = doc(db, `users/${uid}`);
        const userDoc = await getDoc(userRecipesRef);
        const recipes = userDoc.data().recipes;
        const recipePromises = recipes.map(async (recipe) => {
            const recipeRef = doc(db, `recipes/${recipe.id}`);
            const recipeDoc = await getDoc(recipeRef);
            return recipeDoc.data();
        });
        const fetchedRecipes = await Promise.all(recipePromises);
        return fetchedRecipes;
    } catch (err) {
        return err;
    }

}

export { createUser, loginUser, addRecipe, updateRecipe, deleteRecipe, getRecipe, checkIsOwner, checkSavedRecipe, addSavedRecipe, removeSavedRecipe, getUserRecipes, getUserSavedRecipes }