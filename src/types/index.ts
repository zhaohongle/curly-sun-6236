// Work — single perfume work item
export interface Work {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  year: number;
}

// ProcessStep — one step in the bespoke perfume creation process
export interface ProcessStep {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  description: string;
  duration: string;
}

// Site config
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
}
