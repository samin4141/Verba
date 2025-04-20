// global.d.ts
interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  }
  declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  