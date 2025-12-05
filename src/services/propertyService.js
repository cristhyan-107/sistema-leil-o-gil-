// src/services/propertyService.js
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

const COLLECTION_NAME = "properties";

// Helper to get user's subcollection reference
const getUserPropertiesRef = (userId) => {
    return collection(db, "users", userId, COLLECTION_NAME);
};

export const createProperty = async (userId, propertyData) => {
    try {
        const docRef = await addDoc(getUserPropertiesRef(userId), {
            ...propertyData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding property: ", error);
        throw error;
    }
};

export const getUserProperties = async (userId) => {
    try {
        const q = query(getUserPropertiesRef(userId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching properties: ", error);
        throw error;
    }
};

export const updateProperty = async (userId, propertyId, propertyData) => {
    try {
        const propertyRef = doc(db, "users", userId, COLLECTION_NAME, propertyId);
        await updateDoc(propertyRef, {
            ...propertyData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating property: ", error);
        throw error;
    }
};

export const deleteProperty = async (userId, propertyId) => {
    try {
        const propertyRef = doc(db, "users", userId, COLLECTION_NAME, propertyId);
        await deleteDoc(propertyRef);
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw error;
    }
};
