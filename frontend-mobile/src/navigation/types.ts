export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  PostDetail: { postId: string };
  PostForm: { postId?: string };
  UserList: undefined;
  UserForm: { userId?: string };
};
