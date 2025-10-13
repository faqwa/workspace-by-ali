export type MediaType = "image" | "video";

export interface MediaItem {
  type: MediaType;
  src: string;           // public URL after upload
  alt?: string;
  caption?: string;
  embed?: boolean;       // true if iframe/embed (e.g. YouTube)
}

export type Status = "draft" | "published" | "archived";
export type SafetyLevel = "open" | "restricted" | "controlled";
export type Visibility = "public" | "private";
export type RepoTarget = "personal" | "arcup";

export interface VerificationInfo {
  verified: boolean;
  verifier?: string;
  notes?: string;
}

export interface AccessKey {
  label: string;
  token: string;        // UUIDv4 or signed JWT
}

export interface UpdateFrontmatter {
  id: string;                   // UUID
  title: string;
  slug: string;
  category: string;
  tags: string[];
  status: Status;
  safety_level: SafetyLevel;
  author: string;
  created_at: string;           // ISO
  updated_at: string;           // ISO
  summary: string;
  media: MediaItem[];
  visibility: Visibility;
  repo_target: RepoTarget;
  verification: VerificationInfo;
  access_keys?: AccessKey[];
}
