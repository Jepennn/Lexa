import { useEffect, useState } from "react";

type UseSpeechSynthesisOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
};

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voicesReady, setVoicesReady] = useState(false);

  const { rate = 0.8, pitch = 1, volume = 1 } = options;

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log("Voices loaded:", voices.length);
        setVoicesReady(true);
      }
    };

    // Try immediately
    loadVoices();

    // Also listen for voice change event
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const speak = (text: string, lang: string) => {
    if (!text || isSpeaking) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Get and set voice
    const voices = window.speechSynthesis.getVoices();
    console.log(voices);

    //Find a matching voice for the language
    let selectedVoice: SpeechSynthesisVoice | undefined;
    if (lang === "en") {
      const macthingVoices = voices.filter((v) => v.lang.startsWith(lang));
      selectedVoice = macthingVoices.find((v) => v.name === "Google UK English Male");
      console.log(selectedVoice);
    }

    if (lang === "es") {
      const macthingVoices = voices.filter((v) => v.lang.startsWith(lang));
      selectedVoice = macthingVoices.find((v) => v.name === "Google español");
      console.log(selectedVoice);
    }

    if (lang === "fr") {
      const macthingVoices = voices.filter((v) => v.lang.startsWith(lang));
      selectedVoice = macthingVoices.find((v) => v.name === "Google français");
      console.log(selectedVoice);
    }

    if (lang === "ja") {
      const macthingVoices = voices.filter((v) => v.lang.startsWith(lang));
      selectedVoice = macthingVoices.find((v) => v.name === "Google 日本語");
      console.log(selectedVoice);
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using voice:", selectedVoice.name);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setError(event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Rest of your code...
  const cancel = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  //   return { speak, cancel, isSpeaking, error };
  return { speak, cancel, isSpeaking, error, voicesReady };
}
