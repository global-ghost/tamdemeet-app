// 'use server';

// import { auth, signOut } from 'auth';
// import { removeSession } from 'data/session';

// export const logout = async () => {
//   const session = await auth();
//   await removeSession(session!.user!.sessionId!, session!.user!.id!);

//   await signOut({ redirectTo: '/auth/sign-in' });
// };
