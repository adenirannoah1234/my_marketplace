import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../../config/fireBaseConfig';

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
}

interface Category {
  id?: string;
  name: string;
}

export const categoryApiSlice = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Products', 'Categories'],
  endpoints: (builder) => ({
   
    getCategories: builder.query<Category[], void>({
      async queryFn() {
        try {
          const categoriesRef = collection(db, 'categories');
          const querySnapshot = await getDocs(categoriesRef);
          const categories: Category[] = [];
          querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() } as Category);
          });
          return { data: categories };
        } catch (error: any) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      providesTags: ['Categories'],
    }),
    addCategory: builder.mutation<string, Omit<Category, 'id'>>({
      async queryFn(category) {
        try {
          const docRef = await addDoc(collection(db, 'categories'), category);
          return { data: docRef.id };
        } catch (error: any) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<void, Category>({
      async queryFn(category) {
        try {
          const { id, ...updateData } = category;
          await updateDoc(doc(db, 'categories', id!), updateData);
          return { data: undefined };
        } catch (error: any) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'categories', id));
          return { data: undefined };
        } catch (error: any) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
 
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;