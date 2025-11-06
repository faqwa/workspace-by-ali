/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    session: import('@supabase/supabase-js').Session | null;
    user: import('@supabase/supabase-js').User | null;
    userRole: 'owner' | 'reader' | null;
    workspaceOwnerId: string | null;
    allowReaders: boolean;
    isExpert?: boolean;
  }
}
