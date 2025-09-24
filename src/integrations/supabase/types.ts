export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      arbitrage_opportunities: {
        Row: {
          away_team: string
          best_away_bookmaker: string
          best_away_price: number
          best_away_stake: number
          best_draw_bookmaker: string | null
          best_draw_price: number | null
          best_draw_stake: number | null
          best_home_bookmaker: string
          best_home_price: number
          best_home_stake: number
          commence_time: string
          created_at: string | null
          event_id: string
          expires_at: string
          home_team: string
          id: string
          is_active: boolean | null
          profit_margin: number
          sport_key: string
          total_stake: number
          updated_at: string | null
        }
        Insert: {
          away_team: string
          best_away_bookmaker: string
          best_away_price: number
          best_away_stake: number
          best_draw_bookmaker?: string | null
          best_draw_price?: number | null
          best_draw_stake?: number | null
          best_home_bookmaker: string
          best_home_price: number
          best_home_stake: number
          commence_time: string
          created_at?: string | null
          event_id: string
          expires_at: string
          home_team: string
          id?: string
          is_active?: boolean | null
          profit_margin: number
          sport_key: string
          total_stake: number
          updated_at?: string | null
        }
        Update: {
          away_team?: string
          best_away_bookmaker?: string
          best_away_price?: number
          best_away_stake?: number
          best_draw_bookmaker?: string | null
          best_draw_price?: number | null
          best_draw_stake?: number | null
          best_home_bookmaker?: string
          best_home_price?: number
          best_home_stake?: number
          commence_time?: string
          created_at?: string | null
          event_id?: string
          expires_at?: string
          home_team?: string
          id?: string
          is_active?: boolean | null
          profit_margin?: number
          sport_key?: string
          total_stake?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arbitrage_opportunities_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmakers: {
        Row: {
          created_at: string | null
          id: string
          key: string
          last_update: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          key: string
          last_update?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          last_update?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          away_team: string
          bookmaker_count: number | null
          commence_time: string
          created_at: string | null
          home_team: string
          id: string
          last_update: string | null
          sport_key: string
          sport_title: string
          updated_at: string | null
        }
        Insert: {
          away_team: string
          bookmaker_count?: number | null
          commence_time: string
          created_at?: string | null
          home_team: string
          id: string
          last_update?: string | null
          sport_key: string
          sport_title: string
          updated_at?: string | null
        }
        Update: {
          away_team?: string
          bookmaker_count?: number | null
          commence_time?: string
          created_at?: string | null
          home_team?: string
          id?: string
          last_update?: string | null
          sport_key?: string
          sport_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      odds: {
        Row: {
          away_price: number | null
          bookmaker_key: string
          bookmaker_title: string
          created_at: string | null
          draw_price: number | null
          event_id: string
          home_price: number | null
          id: string
          last_update: string | null
          market_key: string
          updated_at: string | null
        }
        Insert: {
          away_price?: number | null
          bookmaker_key: string
          bookmaker_title: string
          created_at?: string | null
          draw_price?: number | null
          event_id: string
          home_price?: number | null
          id?: string
          last_update?: string | null
          market_key?: string
          updated_at?: string | null
        }
        Update: {
          away_price?: number | null
          bookmaker_key?: string
          bookmaker_title?: string
          created_at?: string | null
          draw_price?: number | null
          event_id?: string
          home_price?: number | null
          id?: string
          last_update?: string | null
          market_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "odds_bookmaker_key_fkey"
            columns: ["bookmaker_key"]
            isOneToOne: false
            referencedRelation: "bookmakers"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "odds_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          created_at: string | null
          description: string | null
          has_outrights: boolean | null
          id: string
          key: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          has_outrights?: boolean | null
          id: string
          key: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          has_outrights?: boolean | null
          id?: string
          key?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
