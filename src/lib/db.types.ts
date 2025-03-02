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
            artist_links: {
                Row: {
                    artist_id: string | null
                    created_at: string | null
                    id: string
                    platform: string | null
                    url: string
                }
                Insert: {
                    artist_id?: string | null
                    created_at?: string | null
                    id?: string
                    platform?: string | null
                    url: string
                }
                Update: {
                    artist_id?: string | null
                    created_at?: string | null
                    id?: string
                    platform?: string | null
                    url?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "artist_links_artist_id_fkey"
                        columns: ["artist_id"]
                        isOneToOne: false
                        referencedRelation: "artists"
                        referencedColumns: ["id"]
                    },
                ]
            }
            artist_managers: {
                Row: {
                    artist_id: string | null
                    created_at: string | null
                    id: string
                    user_id: string | null
                }
                Insert: {
                    artist_id?: string | null
                    created_at?: string | null
                    id?: string
                    user_id?: string | null
                }
                Update: {
                    artist_id?: string | null
                    created_at?: string | null
                    id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "artist_managers_artist_id_fkey"
                        columns: ["artist_id"]
                        isOneToOne: false
                        referencedRelation: "artists"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "artist_managers_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            artists: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    id: string
                    name: string
                    profile_picture: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    name: string
                    profile_picture?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    name?: string
                    profile_picture?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "artists_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            songs: {
                Row: {
                    album: string | null
                    artist_id: string | null
                    cover_image: string | null
                    created_at: string | null
                    created_by: string | null
                    id: string
                    release_date: string | null
                    title: string
                }
                Insert: {
                    album?: string | null
                    artist_id?: string | null
                    cover_image?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    release_date?: string | null
                    title: string
                }
                Update: {
                    album?: string | null
                    artist_id?: string | null
                    cover_image?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    release_date?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "songs_artist_id_fkey"
                        columns: ["artist_id"]
                        isOneToOne: false
                        referencedRelation: "artists"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "songs_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            streaming_links: {
                Row: {
                    created_at: string | null
                    id: string
                    platform_name: string | null
                    song_id: string | null
                    url: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    platform_name?: string | null
                    song_id?: string | null
                    url: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    platform_name?: string | null
                    song_id?: string | null
                    url?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "streaming_links_song_id_fkey"
                        columns: ["song_id"]
                        isOneToOne: false
                        referencedRelation: "songs"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    created_at: string | null
                    email: string
                    id: string
                    role: string
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    id?: string
                    role: string
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    id?: string
                    role?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
            | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    PublicTableNameOrOptions extends
            | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
            | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    PublicEnumNameOrOptions extends
            | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
            | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
        ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never
