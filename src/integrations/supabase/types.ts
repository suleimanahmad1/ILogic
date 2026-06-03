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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string | null
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_pinned: boolean
          published: boolean
          slug: string
          sort_order: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_pinned?: boolean
          published?: boolean
          slug: string
          sort_order?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_pinned?: boolean
          published?: boolean
          slug?: string
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          organization: string
          sort_order: number | null
          updated_at: string
          url: string | null
          year: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization: string
          sort_order?: number | null
          updated_at?: string
          url?: string | null
          year: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization?: string
          sort_order?: number | null
          updated_at?: string
          url?: string | null
          year?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          form_started_at: string | null
          id: string
          message: string
          name: string
          submit_nonce: string | null
        }
        Insert: {
          created_at?: string
          email: string
          form_started_at?: string | null
          id?: string
          message: string
          name: string
          submit_nonce?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          form_started_at?: string | null
          id?: string
          message?: string
          name?: string
          submit_nonce?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          degree: string
          id: string
          institute: string
          end_date: string | null
          start_date: string | null
          sort_order: number | null
          updated_at: string
          year: string
        }
        Insert: {
          degree: string
          id?: string
          institute: string
          end_date?: string | null
          start_date?: string | null
          sort_order?: number | null
          updated_at?: string
          year: string
        }
        Update: {
          degree?: string
          id?: string
          institute?: string
          end_date?: string | null
          start_date?: string | null
          sort_order?: number | null
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      portfolio_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          is_pinned: boolean
          live_url: string | null
          project_name: string | null
          sort_order: number | null
          tech_stack: string[] | null
          technology: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          live_url?: string | null
          project_name?: string | null
          sort_order?: number | null
          tech_stack?: string[] | null
          technology?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          live_url?: string | null
          project_name?: string | null
          sort_order?: number | null
          tech_stack?: string[] | null
          technology?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      skills_categories: {
        Row: {
          id: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      skills_items: {
        Row: {
          category_id: string
          id: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_id: string
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skills_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          code: string
          course_name: string
          created_at: string
          description: string
          id: string
          image_url: string
          is_pinned: boolean
          sort_order: number | null
          updated_at: string
          url: string
        }
        Insert: {
          code: string
          course_name: string
          created_at?: string
          description: string
          id?: string
          image_url: string
          is_pinned?: boolean
          sort_order?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          code?: string
          course_name?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_pinned?: boolean
          sort_order?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      success_events: {
        Row: {
          description: string
          id: string
          images: string[]
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          description: string
          id?: string
          images?: string[]
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          images?: string[]
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          items: string[]
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: string
          items?: string[]
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          items?: string[]
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          name: string
          quote: string
          role: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name: string
          quote: string
          role?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name?: string
          quote?: string
          role?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
