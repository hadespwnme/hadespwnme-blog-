declare module 'aos' {
  export interface AOSOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    disable?: boolean | 'phone' | 'tablet' | 'mobile' | (() => boolean);
  }

  const AOS: {
    init(options?: Partial<AOSOptions>): void;
    refresh(): void;
    refreshHard(): void;
  };

  export default AOS;
}

