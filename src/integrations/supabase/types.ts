export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_comments: {
        Row: {
          category_id: string
          comment: string
          created_at: string
          id: string
          parent_comment_id: string | null
          user_id: string
        }
        Insert: {
          category_id: string
          comment: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          user_id: string
        }
        Update: {
          category_id?: string
          comment?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_comments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "category_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      category_likes: {
        Row: {
          category_id: string
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_likes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_reactions: {
        Row: {
          category_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_reactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_items: {
        Row: {
          created_at: string
          data: Json
          id: string
          type: Database["public"]["Enums"]["feed_item_type"]
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          type: Database["public"]["Enums"]["feed_item_type"]
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          type?: Database["public"]["Enums"]["feed_item_type"]
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          favorite_sports: string[] | null
          full_name: string | null
          id: string
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          favorite_sports?: string[] | null
          full_name?: string | null
          id: string
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          favorite_sports?: string[] | null
          full_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          answer_text: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
        }
        Insert: {
          answer_text: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
        }
        Update: {
          answer_text?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          completed_at: string
          id: string
          quiz_id: string
          score: number
          started_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string
          id?: string
          quiz_id: string
          score: number
          started_at: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string
          id?: string
          quiz_id?: string
          score?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          order: number
          question_text: string
          quiz_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order: number
          question_text: string
          quiz_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          question_text?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          active_date: string
          created_at: string
          id: string
          title: string
          topic: string | null
        }
        Insert: {
          active_date: string
          created_at?: string
          id?: string
          title: string
          topic?: string | null
        }
        Update: {
          active_date?: string
          created_at?: string
          id?: string
          title?: string
          topic?: string | null
        }
        Relationships: []
      }
      ranking_athletes: {
        Row: {
          athlete_id: string
          created_at: string
          id: number
          points: number
          position: number
          ranking_id: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: number
          points: number
          position: number
          ranking_id: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: number
          points?: number
          position?: number
          ranking_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_athletes_ranking_id_fkey"
            columns: ["ranking_id"]
            isOneToOne: false
            referencedRelation: "user_rankings"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          parent_comment_id: string | null
          ranking_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          ranking_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          ranking_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "ranking_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_comments_ranking_id_fkey"
            columns: ["ranking_id"]
            isOneToOne: false
            referencedRelation: "user_rankings"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_reactions: {
        Row: {
          created_at: string
          id: string
          ranking_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ranking_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ranking_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_reactions_ranking_id_fkey"
            columns: ["ranking_id"]
            isOneToOne: false
            referencedRelation: "user_rankings"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_events: {
        Row: {
          action: string
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rankings: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rankings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_role_to_user: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      check_and_award_badges: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      create_new_ranking_feed_item: {
        Args:
          | { p_ranking_id: string; p_athletes: Json }
          | {
              p_ranking_id: string
              p_athletes: Json
              p_ranking_description: string
            }
        Returns: undefined
      }
      create_quiz: {
        Args: {
          p_title: string
          p_topic: string
          p_active_date: string
          p_questions: Json
        }
        Returns: string
      }
      delete_app_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      delete_comment_as_admin: {
        Args: { p_comment_id: string }
        Returns: undefined
      }
      get_all_comments_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          comment_id: string
          comment_text: string
          created_at: string
          user_id: string
          user_full_name: string
          user_avatar_url: string
          user_status: Database["public"]["Enums"]["user_status"]
          category_id: string
          category_name: string
        }[]
      }
      get_all_users_with_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          full_name: string
          avatar_url: string
          roles: Database["public"]["Enums"]["app_role"][]
        }[]
      }
      get_quiz_leaderboard: {
        Args:
          | Record<PropertyKey, never>
          | { p_limit?: number; p_offset?: number }
        Returns: {
          user_id: string
          full_name: string
          avatar_url: string
          total_score: number
          quizzes_completed: number
          highest_badge_id: string
          highest_badge_name: string
          highest_badge_rarity: string
        }[]
      }
      get_user_status: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["user_status"]
      }
      is_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_moderator: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_moderator_or_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      remove_role_from_user: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      set_user_status: {
        Args: {
          p_user_id: string
          p_status: Database["public"]["Enums"]["user_status"]
        }
        Returns: undefined
      }
      set_user_status_moderator: {
        Args: {
          p_user_id: string
          p_status: Database["public"]["Enums"]["user_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
      feed_item_type:
        | "new_user"
        | "new_comment"
        | "accepted_friendship"
        | "new_ranking"
        | "quiz_completed"
        | "badge_earned"
      friendship_status: "pending" | "accepted" | "declined" | "blocked"
      notification_type:
        | "new_comment_reply"
        | "new_category"
        | "new_friend_request"
        | "friend_request_accepted"
        | "ranking_reaction"
        | "category_reaction"
        | "quiz_completed"
        | "badge_earned"
      user_status: "active" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "moderator"],
      feed_item_type: [
        "new_user",
        "new_comment",
        "accepted_friendship",
        "new_ranking",
        "quiz_completed",
        "badge_earned",
      ],
      friendship_status: ["pending", "accepted", "declined", "blocked"],
      notification_type: [
        "new_comment_reply",
        "new_category",
        "new_friend_request",
        "friend_request_accepted",
        "ranking_reaction",
        "category_reaction",
        "quiz_completed",
        "badge_earned",
      ],
      user_status: ["active", "banned"],
    },
  },
} as const
