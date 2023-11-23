import { USERS_URL, AUTH_URL } from '../constants';
import { apiSlice } from './apiSlice';

// Extend the base apiSlice with additional endpoints related to users
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation for user local login
    localLogin: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login/local`,
        method: 'POST',
        body: data,
      }),
    }),
    // Mutation for user logout
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
    }),
    // Mutation for user registration
    localRegister: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/local`,
        method: 'POST',
        body: data,
      }),
    }),
    // Mutation for updating user profile
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Query to get all users with optional pagination
    getAllUsers: builder.query({
      query: ({ pageNumber }) => ({
        url: `${USERS_URL}`,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    // Query to get a single user by ID
    getOneUser: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    // Query to get current user
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/current`,
        method: 'GET',
      }),
    }),
    // Mutation to delete a user by ID
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    // Mutation to update a user's information
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLocalLoginMutation,
  useLogoutMutation,
  useLocalRegisterMutation,
  useProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetOneUserQuery,
  useUpdateUserMutation,
  useGetCurrentUserQuery,
} = usersApiSlice;
