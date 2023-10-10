export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      friendships: {
        Row: {
          receiver_id: string;
          requester_id: string;
          status: Database['public']['Enums']['friendship_status'];
        };
        Insert: {
          receiver_id: string;
          requester_id: string;
          status?: Database['public']['Enums']['friendship_status'];
        };
        Update: {
          receiver_id?: string;
          requester_id?: string;
          status?: Database['public']['Enums']['friendship_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'friendships_receiver_id_fkey';
            columns: ['receiver_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friendships_requester_id_fkey';
            columns: ['requester_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      game_players: {
        Row: {
          game_id: string;
          invitation_status:
            | Database['public']['Enums']['game_invitation_status']
            | null;
          marks: number | null;
          result_position: number | null;
          status: Database['public']['Enums']['player_status'] | null;
          user_id: string;
        };
        Insert: {
          game_id: string;
          invitation_status?:
            | Database['public']['Enums']['game_invitation_status']
            | null;
          marks?: number | null;
          result_position?: number | null;
          status?: Database['public']['Enums']['player_status'] | null;
          user_id: string;
        };
        Update: {
          game_id?: string;
          invitation_status?:
            | Database['public']['Enums']['game_invitation_status']
            | null;
          marks?: number | null;
          result_position?: number | null;
          status?: Database['public']['Enums']['player_status'] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_players_game_id_fkey';
            columns: ['game_id'];
            referencedRelation: 'games';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_players_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      game_rounds: {
        Row: {
          created_at: string | null;
          current_player_id: string | null;
          game_id: string | null;
          id: string;
          last_moved_user_id: string | null;
          round_number: number;
          status: Database['public']['Enums']['game_status'];
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          current_player_id?: string | null;
          game_id?: string | null;
          id?: string;
          last_moved_user_id?: string | null;
          round_number: number;
          status?: Database['public']['Enums']['game_status'];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          current_player_id?: string | null;
          game_id?: string | null;
          id?: string;
          last_moved_user_id?: string | null;
          round_number?: number;
          status?: Database['public']['Enums']['game_status'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'game_rounds_current_player_id_fkey';
            columns: ['current_player_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_rounds_game_id_fkey';
            columns: ['game_id'];
            referencedRelation: 'games';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_rounds_last_moved_user_id_fkey';
            columns: ['last_moved_user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      games: {
        Row: {
          created_at: string | null;
          creator_id: string | null;
          id: string;
          max_number_of_marks: number;
          name: string;
          status: Database['public']['Enums']['game_status'];
          updated_at: string | null;
          winner_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          creator_id?: string | null;
          id?: string;
          max_number_of_marks?: number;
          name: string;
          status?: Database['public']['Enums']['game_status'];
          updated_at?: string | null;
          winner_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          creator_id?: string | null;
          id?: string;
          max_number_of_marks?: number;
          name?: string;
          status?: Database['public']['Enums']['game_status'];
          updated_at?: string | null;
          winner_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'games_creator_id_fkey';
            columns: ['creator_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'games_winner_id_fkey';
            columns: ['winner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          id: string;
          message: string | null;
          reference_id: string | null;
          seen: boolean | null;
          type: Database['public']['Enums']['notification_type'];
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message?: string | null;
          reference_id?: string | null;
          seen?: boolean | null;
          type: Database['public']['Enums']['notification_type'];
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string | null;
          reference_id?: string | null;
          seen?: boolean | null;
          type?: Database['public']['Enums']['notification_type'];
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      round_moves: {
        Row: {
          created_at: string | null;
          game_round_id: string | null;
          id: string;
          letter: string | null;
          type: Database['public']['Enums']['move_type'];
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          game_round_id?: string | null;
          id?: string;
          letter?: string | null;
          type: Database['public']['Enums']['move_type'];
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          game_round_id?: string | null;
          id?: string;
          letter?: string | null;
          type?: Database['public']['Enums']['move_type'];
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'round_moves_game_round_id_fkey';
            columns: ['game_round_id'];
            referencedRelation: 'game_rounds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'round_moves_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      round_player_order: {
        Row: {
          order_of_play: number | null;
          player_id: string;
          round_id: string;
        };
        Insert: {
          order_of_play?: number | null;
          player_id: string;
          round_id: string;
        };
        Update: {
          order_of_play?: number | null;
          player_id?: string;
          round_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'round_player_order_player_id_fkey';
            columns: ['player_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'round_player_order_round_id_fkey';
            columns: ['round_id'];
            referencedRelation: 'game_rounds';
            referencedColumns: ['id'];
          },
        ];
      };
      user_stats: {
        Row: {
          avg_place: number | null;
          games_played: number | null;
          games_won: number | null;
          most_started_letter: string | null;
          user_id: string;
        };
        Insert: {
          avg_place?: number | null;
          games_played?: number | null;
          games_won?: number | null;
          most_started_letter?: string | null;
          user_id: string;
        };
        Update: {
          avg_place?: number | null;
          games_played?: number | null;
          games_won?: number | null;
          most_started_letter?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_stats_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_game_invitation: {
        Args: {
          p_game_id: string;
          p_user_id: string;
        };
        Returns: Database['public']['Enums']['game_status'];
      };
      create_new_game: {
        Args: {
          p_game_name: string;
          p_player_ids: string[];
          p_creator_id: string;
          p_max_number_of_marks: number;
        };
        Returns: string;
      };
      decline_game_invitation: {
        Args: {
          p_game_id: string;
          p_user_id: string;
        };
        Returns: Database['public']['Enums']['game_status'];
      };
      get_active_game_by_id: {
        Args: {
          p_game_id: string;
        };
        Returns: {
          id: string;
          name: string;
          updatedAt: string;
          currentTurnProfileId: string;
          currentTurnUsername: string;
          lettersSoFar: string[];
          previousMoveType: Database['public']['Enums']['move_type'];
          previousPlayerId: string;
          previousPlayerUsername: string;
          maxNumberOfMarks: number;
          currentRoundNumber: number;
        }[];
      };
      get_user_friends: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          friendId: string;
          username: string;
          status: Database['public']['Enums']['friendship_status'];
        }[];
      };
      get_user_games: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          id: string;
          name: string;
          status: Database['public']['Enums']['game_status'];
          createdAt: string;
          updatedAt: string;
          creatorProfileId: string;
          creatorUsername: string;
          currentTurnProfileId: string;
          currentTurnUsername: string;
          winnerProfileId: string;
          winnerUsername: string;
          waitingForUsers: string[];
        }[];
      };
      submit_letter: {
        Args: {
          p_game_id: string;
          p_user_id: string;
          letter?: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      friendship_status: 'ignored' | 'accepted' | 'pending';
      game_invitation_status: 'pending' | 'accepted' | 'declined';
      game_status: 'active' | 'finished' | 'abandoned' | 'pending';
      move_type: 'add_letter' | 'call_bluff' | 'call_finished_word' | 'give_up';
      notification_type: 'game_invite' | 'friend_request' | 'game_move_turn';
      player_status: 'active' | 'out';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'buckets_owner_fkey';
            columns: ['owner'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
