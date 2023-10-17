/**
 * Expected return data after logged in user made his move and got redirected
 * Procedure name: get_game_stats_by_id
 * Parameters: p_game_id UUID, p_user_id UUID
 */
export interface GameStats {
  currentPlayerTurn: string;
  moveType: string;
  letter?: string; // Basically from the lastest move, the letter the player just placed if move_type was 'add_letter'
  word?: string; // Basically from the lastest move, the complete word if move_type was 'reveal_bluff' or 'claim_finished_word'
  standings: {
    playerId: string;
    username: string;
    marks: number; // accumulated number of marks for a player for all rounds in this game
  }[];
  rounds: {
    // should be ordered so the highest/latest roundNumber comes first
    roundNumber: number;
    moves: {
      playerId: string;
      username: string;
      moveType: string;
      createdAt: string; // Should be order be latest first
      letter?: string;
      word?: string;
    }[];
  }[];
}

/**
 * Expected return data for clicking on a active game where's it's not the
 * logged in user's turn.
 * Procedure name: get_active_game_stats_by_id
 * Parameters: p_game_id UUID, p_user_id UUID
 */
export interface ActiveGameStats {
  currentPlayerTurn: string;
  standings: {
    playerId: string;
    username: string;
    marks: number;
  }[];
  rounds: {
    roundNumber: number;
    moves: {
      playerId: string;
      username: string;
      moveType: string;
      createdAt: string;
      letter?: string;
      word?: string;
    }[];
  }[];
}

/**
 * Expected return data for clicking on a pending game.
 * Procedure name: get_pending_game_stats_by_id
 * Parameters: p_game_id UUID
 */
export interface PendingGameStats {
  gameName: string;
  gameStatus: string;
  createdAt: string;
  players: {
    playerId: string;
    usernames: string;
    inviteStatus: string;
  }[];
}

/**
 * Expected return data for clicking on a finished game.
 * Procedure name: get_finished_game_stats_by_id
 * Parameters: p_game_id UUID
 */
export interface FinishedGameStats {
  gameName: string;
  updatedAt: string;
  playerResult: {
    playerId: string;
    username: string;
    marks: number;
    place: number;
  }[];
  rounds: {
    roundNumber: number;
    moves: {
      playerId: string;
      username: string;
      moveType: string;
      letter?: string;
      word?: string;
      createdAt: string;
    }[];
  }[];
}
