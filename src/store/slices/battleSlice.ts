import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Battle {
  id: string;
  title: string;
  amount: number;
  commission: number;
  winnerAmount: number;
  inviteCode?: string;
  createdBy: string;
  joinedBy?: string;
  status: string;
}

interface BattleState {
  battles: Battle[];
  currentBattle: Battle | null;
  loading: boolean;
}

const initialState: BattleState = {
  battles: [],
  currentBattle: null,
  loading: false,
};

export const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setBattles: (state, action: PayloadAction<Battle[]>) => {
      state.battles = action.payload;
    },
    setCurrentBattle: (state, action: PayloadAction<Battle | null>) => {
      state.currentBattle = action.payload;
    },
    updateBattleStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const index = state.battles.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.battles[index].status = action.payload.status;
      }
      if (state.currentBattle && state.currentBattle.id === action.payload.id) {
        state.currentBattle.status = action.payload.status;
      }
    },
  },
});

export const { setBattles, setCurrentBattle, updateBattleStatus } = battleSlice.actions;
export default battleSlice.reducer;
