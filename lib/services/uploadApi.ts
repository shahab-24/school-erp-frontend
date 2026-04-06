import { apiSlice } from "./apiSlice";

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string; publicId: string }, FormData>({
      query: (body) => ({
        url: "/upload/image",
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
