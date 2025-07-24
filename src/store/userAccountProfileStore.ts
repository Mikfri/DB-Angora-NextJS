// src/store/userAccountProfileStore.ts

/* UserAccountProfileStore er til for at:
-  håndtere global state om brugeren er findable (BreederAccount.IsFindable).
- sørge for at User.[properties] og BreederAccount.[properties] er synkroniseret.
... dvs så displaysiden og sidenav begge viser den samme status.
 Dette skal forhindre brugere i at oprette salgsannoncer ved fx at disable visse UI elementer.
 */

import { create } from 'zustand';
import { User_ProfileDTO, BreederAccount_PrivateProfileDTO } from '@/api/types/AngoraDTOs';

interface UserAccountProfileStoreState {
  user: User_ProfileDTO | null;
  breederAccount: BreederAccount_PrivateProfileDTO | null;
  setUser: (user: User_ProfileDTO | null) => void;
  setBreederAccount: (account: BreederAccount_PrivateProfileDTO | null) => void;
  setIsFindable: (isFindable: boolean) => void;
  reset: () => void;
}

export const useUserAccountProfileStore = create<UserAccountProfileStoreState>((set) => ({
  user: null,
  breederAccount: null,
  setUser: (user) => set({ user, breederAccount: user?.breederAccount ?? null }),
  setBreederAccount: (account) => set({ breederAccount: account }),
  setIsFindable: (isFindable) =>
    set((state) =>
      state.breederAccount
        ? { breederAccount: { ...state.breederAccount, isFindable } }
        : {}
    ),
  reset: () => set({ user: null, breederAccount: null }),
}));