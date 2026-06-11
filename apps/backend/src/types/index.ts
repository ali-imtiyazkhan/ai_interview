export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  starCount: number;
  language: string | null;
  topics: string[];
  readme: string | null;
}

export interface LinkedInProfile {
  name: string;
  headline: string | null;
  experience: LinkedInExperience[];
  education: LinkedInEducation[];
  skills: string[];
}

export interface LinkedInExperience {
  title: string;
  company: string;
  duration: string;
  description: string | null;
}

export interface LinkedInEducation {
  school: string;
  degree: string | null;
  field: string | null;
  duration: string;
}
