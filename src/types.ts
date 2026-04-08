export type SectionId = 
  | 'profile' 
  | 'name-title' 
  | 'company' 
  | 'contact' 
  | 'social' 
  | 'trustpilot' 
  | 'custom-text';

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'linkedin' | 'whatsapp' | 'instagram';
  url: string;
  enabled: boolean;
}

export interface SignatureData {
  sections: SectionId[];
  enabledSections: Record<SectionId, boolean>;
  expandedSections: Record<SectionId, boolean>;
  
  // Profile
  profileImage: string; // base64
  profileSize: number;
  profileRadius: number;
  profileAlign: 'left' | 'center' | 'right';

  // Name & Title
  fullName: string;
  jobTitle: string;
  nameColor: string;
  titleColor: string;
  nameSize: number;
  titleSize: number;

  // Company
  companyName: string;
  companyLogo: string; // base64
  logoSize: number;
  logoRadius: number;
  companyColor: string;

  // Contact
  phones: string[];
  emails: string[];
  websites: string[];
  contactColor: string;

  // Social
  socialLinks: SocialLink[];
  socialIconSize: number;
  socialIconColor: string;
  socialAlign: 'left' | 'center' | 'right';

  // Trustpilot
  trustpilotUrl: string;
  trustpilotBadge: string; // base64
  trustpilotSize: number;

  // Custom Text
  customText: string;
  customTextColor: string;
  customTextSize: number;

  // Global Design
  fontFamily: string;
  globalSpacing: number;
  globalAlign: 'left' | 'center' | 'right';
}

export const INITIAL_DATA: SignatureData = {
  sections: ['profile', 'name-title', 'company', 'contact', 'social', 'trustpilot', 'custom-text'],
  enabledSections: {
    profile: true,
    'name-title': true,
    company: true,
    contact: true,
    social: true,
    trustpilot: false,
    'custom-text': false,
  },
  expandedSections: {
    profile: false,
    'name-title': false,
    company: false,
    contact: false,
    social: false,
    trustpilot: false,
    'custom-text': false,
  },
  
  profileImage: '',
  profileSize: 80,
  profileRadius: 50,
  profileAlign: 'left',

  fullName: '',
  jobTitle: '',
  nameColor: '#1a1a1a',
  titleColor: '#666666',
  nameSize: 18,
  titleSize: 14,

  companyName: 'Ignite Tech Solutions',
  companyLogo: '',
  logoSize: 100,
  logoRadius: 4,
  companyColor: '#1a1a1a',
  phones: [''],
  emails: [''],
  websites: [''],
  contactColor: '#444444',

  socialLinks: [
    { id: 'fb', platform: 'facebook', url: '', enabled: true },
    { id: 'li', platform: 'linkedin', url: '', enabled: true },
    { id: 'wa', platform: 'whatsapp', url: '', enabled: false },
    { id: 'ig', platform: 'instagram', url: '', enabled: true },
  ],
  socialIconSize: 24,
  socialIconColor: '#000000',
  socialAlign: 'left',

  trustpilotUrl: '',
  trustpilotBadge: '',
  trustpilotSize: 120,

  customText: '',
  customTextColor: '#666666',
  customTextSize: 12,

  fontFamily: 'Arial, sans-serif',
  globalSpacing: 12,
  globalAlign: 'left',
};
