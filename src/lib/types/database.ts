/**
 * Database Types
 *
 * TypeScript types for Supabase database tables
 * These will be auto-generated once you run: npx supabase gen types typescript
 * For now, we define them manually based on our schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          bio: string | null
          avatar_url: string | null
          role: 'user' | 'reviewer' | 'admin'
          created_at: string
          last_signin: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'reviewer' | 'admin'
          created_at?: string
          last_signin?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'reviewer' | 'admin'
          created_at?: string
          last_signin?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          owner: string
          name: string
          description: string | null
          category: string | null
          visibility: 'public' | 'private'
          created_at: string
        }
        Insert: {
          id?: string
          owner: string
          name: string
          description?: string | null
          category?: string | null
          visibility?: 'public' | 'private'
          created_at?: string
        }
        Update: {
          id?: string
          owner?: string
          name?: string
          description?: string | null
          category?: string | null
          visibility?: 'public' | 'private'
          created_at?: string
        }
      }
      subprojects: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          schema_url: string | null
          safety_version: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          schema_url?: string | null
          safety_version?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          schema_url?: string | null
          safety_version?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          project_id: string
          subproject_id: string | null
          user_id: string
          title: string
          description: string | null
          data_url: string | null
          artifact_url: string | null
          safety_version: string | null
          status: 'draft' | 'pending' | 'verified' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          subproject_id?: string | null
          user_id: string
          title: string
          description?: string | null
          data_url?: string | null
          artifact_url?: string | null
          safety_version?: string | null
          status?: 'draft' | 'pending' | 'verified' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          subproject_id?: string | null
          user_id?: string
          title?: string
          description?: string | null
          data_url?: string | null
          artifact_url?: string | null
          safety_version?: string | null
          status?: 'draft' | 'pending' | 'verified' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      safety_logs: {
        Row: {
          id: string
          user_id: string
          subproject_id: string | null
          protocol_version: string | null
          signed_at: string
          acknowledgment: boolean
        }
        Insert: {
          id?: string
          user_id: string
          subproject_id?: string | null
          protocol_version?: string | null
          signed_at?: string
          acknowledgment?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          subproject_id?: string | null
          protocol_version?: string | null
          signed_at?: string
          acknowledgment?: boolean
        }
      }
      visualizations: {
        Row: {
          id: string
          submission_id: string
          chart_type: string | null
          format: string | null
          url: string | null
          checksum: string | null
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          chart_type?: string | null
          format?: string | null
          url?: string | null
          checksum?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          chart_type?: string | null
          format?: string | null
          url?: string | null
          checksum?: string | null
          created_at?: string
        }
      }
      workspace_settings: {
        Row: {
          id: string
          owner_id: string
          workspace_name: string
          repo_visibility: 'public' | 'private'
          reader_signup_enabled: boolean
          readers_can_suggest: boolean
          setup_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          workspace_name: string
          repo_visibility?: 'public' | 'private'
          reader_signup_enabled?: boolean
          readers_can_suggest?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          workspace_name?: string
          repo_visibility?: 'public' | 'private'
          reader_signup_enabled?: boolean
          readers_can_suggest?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          workspace_owner_id: string
          role: 'owner' | 'reader'
          is_expert: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_owner_id: string
          role?: 'owner' | 'reader'
          is_expert?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_owner_id?: string
          role?: 'owner' | 'reader'
          is_expert?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reader_acknowledgments: {
        Row: {
          id: string
          reader_id: string
          subproject_id: string
          protocol_version: string
          acknowledged_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          reader_id: string
          subproject_id: string
          protocol_version: string
          acknowledged_at?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          reader_id?: string
          subproject_id?: string
          protocol_version?: string
          acknowledged_at?: string
          ip_address?: string | null
        }
      }
      reader_suggestions: {
        Row: {
          id: string
          reader_id: string
          subproject_id: string
          suggestion_text: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          reader_id: string
          subproject_id: string
          suggestion_text: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          reader_id?: string
          subproject_id?: string
          suggestion_text?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      user_repos: {
        Row: {
          id: string
          user_id: string
          repo_url: string
          repo_owner: string
          repo_name: string
          github_token_encrypted: string | null
          default_branch: string
          is_template_forked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          repo_url: string
          repo_owner: string
          repo_name: string
          github_token_encrypted?: string | null
          default_branch?: string
          is_template_forked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          repo_url?: string
          repo_owner?: string
          repo_name?: string
          github_token_encrypted?: string | null
          default_branch?: string
          is_template_forked?: boolean
          created_at?: string
          updated_at?: string
        }
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
  }
}
