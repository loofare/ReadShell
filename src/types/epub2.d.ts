declare module 'epub2' {
  export class EPub {
    constructor(epubPath: string, imagewebroot?: string, chapterwebroot?: string);
    
    metadata: {
      title?: string;
      creator?: string; // author
      creatorFileAs?: string;
      publisher?: string;
      description?: string;
    };
    
    flow: Array<{
      id: string;
      href: string;
      title?: string;
      order?: number;
    }>;

    parse(): void;
    
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    
    getChapter(chapterId: string, callback: (err: Error | null, text: string) => void): void;
    // Alternative method:
    getChapterRaw(chapterId: string, callback: (err: Error | null, text: string) => void): void;
  }
}
