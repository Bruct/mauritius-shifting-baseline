export type UserRole = 'collector' | 'admin';
export type TestimonyStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type MediaType = 'photo' | 'audio';
export type SpeciesPresence = 'abundant' | 'present' | 'rare' | 'absent';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          organization: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          organization?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          organization?: string | null;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          latitude: number;
          longitude: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          latitude?: number;
          longitude?: number;
        };
      };
      testimonies: {
        Row: {
          id: string;
          location_id: string;
          submitted_by: string | null;
          title: string;
          testimony_text: string;
          narrator_name: string | null;
          narrator_age: number | null;
          narrator_profession: string | null;
          year_of_memory: number;
          year_of_memory_end: number | null;
          collection_date: string | null;
          language: string;
          status: TestimonyStatus;
          reviewer_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          submitted_by?: string | null;
          title: string;
          testimony_text: string;
          narrator_name?: string | null;
          narrator_age?: number | null;
          narrator_profession?: string | null;
          year_of_memory: number;
          year_of_memory_end?: number | null;
          collection_date?: string | null;
          language?: string;
          status?: TestimonyStatus;
          reviewer_notes?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          testimony_text?: string;
          narrator_name?: string | null;
          narrator_age?: number | null;
          narrator_profession?: string | null;
          year_of_memory?: number;
          year_of_memory_end?: number | null;
          collection_date?: string | null;
          language?: string;
          status?: TestimonyStatus;
          reviewer_notes?: string | null;
        };
      };
      testimony_media: {
        Row: {
          id: string;
          testimony_id: string;
          media_type: MediaType;
          storage_path: string;
          caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          testimony_id: string;
          media_type: MediaType;
          storage_path: string;
          caption?: string | null;
          created_at?: string;
        };
        Update: {
          caption?: string | null;
        };
      };
      species: {
        Row: {
          id: string;
          common_name_en: string | null;
          common_name_fr: string | null;
          common_name_mfe: string | null;
          scientific_name: string | null;
          species_type: string | null;
          image_url: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          common_name_en?: string | null;
          common_name_fr?: string | null;
          common_name_mfe?: string | null;
          scientific_name?: string | null;
          species_type?: string | null;
          image_url?: string | null;
          description?: string | null;
        };
        Update: {
          common_name_en?: string | null;
          common_name_fr?: string | null;
          common_name_mfe?: string | null;
          scientific_name?: string | null;
          species_type?: string | null;
          image_url?: string | null;
          description?: string | null;
        };
      };
      testimony_species: {
        Row: {
          testimony_id: string;
          species_id: string;
          presence: SpeciesPresence;
          notes: string | null;
        };
        Insert: {
          testimony_id: string;
          species_id: string;
          presence: SpeciesPresence;
          notes?: string | null;
        };
        Update: {
          presence?: SpeciesPresence;
          notes?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      testimony_status: TestimonyStatus;
      media_type: MediaType;
      species_presence: SpeciesPresence;
    };
  };
}

// Convenience types for joined queries
export type Location = Database['public']['Tables']['locations']['Row'];
export type Testimony = Database['public']['Tables']['testimonies']['Row'];
export type TestimonyMedia = Database['public']['Tables']['testimony_media']['Row'];
export type Species = Database['public']['Tables']['species']['Row'];
export type TestimonySpecies = Database['public']['Tables']['testimony_species']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type TestimonyWithLocation = Testimony & {
  locations: Location;
};

export type TestimonyFull = Testimony & {
  locations: Location;
  testimony_media: TestimonyMedia[];
  testimony_species: (TestimonySpecies & { species: Species })[];
  profiles: Profile | null;
};

export type LocationWithCount = Location & {
  testimony_count: number;
};
