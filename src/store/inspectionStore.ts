import { create } from 'zustand';
import { RoboflowService } from '../services/roboflow';
import { ImageSimilarity } from '../utils/imageSimilarity';
import type { DamageDetectionResult, RoboflowPrediction } from '../types/roboflow';

export type AppState = 'upload' | 'analyzing' | 'results';

export interface UploadFile {
  file: File;
  url: string;
}

export interface AnalysisResult {
  pickupDamage: DamageDetectionResult;
  returnDamage: DamageDetectionResult;
  newDamage: RoboflowPrediction[];
}

const DEMO_RESULT: AnalysisResult = {
  pickupDamage: {
    predictions: [
      { x: 182, y: 125, width: 145, height: 110, confidence: 0.94, class: 'Scratch', class_id: 0 },
      { x: 455, y: 225, width: 130, height: 100, confidence: 0.88, class: 'Dent',    class_id: 1 },
      { x: 628, y: 358, width: 175, height: 115, confidence: 0.79, class: 'Crack',   class_id: 2 },
    ],
    imageWidth: 800,
    imageHeight: 500,
    processingTime: 0.1,
  },
  returnDamage: {
    predictions: [
      { x: 182, y: 125, width: 145, height: 110, confidence: 0.94, class: 'Scratch', class_id: 0 },
      { x: 455, y: 225, width: 130, height: 100, confidence: 0.88, class: 'Dent',    class_id: 1 },
      { x: 628, y: 358, width: 175, height: 115, confidence: 0.79, class: 'Crack',   class_id: 2 },
      { x: 318, y: 368, width: 165, height: 125, confidence: 0.91, class: 'Dent',    class_id: 1, detection_id: 'new-1' },
      { x: 683, y: 215, width: 135, height: 90,  confidence: 0.83, class: 'Scratch', class_id: 0, detection_id: 'new-2' },
    ],
    imageWidth: 800,
    imageHeight: 500,
    processingTime: 0.1,
  },
  newDamage: [
    { x: 318, y: 368, width: 165, height: 125, confidence: 0.91, class: 'Dent',    class_id: 1, detection_id: 'new-1' },
    { x: 683, y: 215, width: 135, height: 90,  confidence: 0.83, class: 'Scratch', class_id: 0, detection_id: 'new-2' },
  ],
};

export function isNewDamage(pred: RoboflowPrediction, newDamage: RoboflowPrediction[]): boolean {
  return newDamage.some(nd =>
    nd.detection_id && pred.detection_id
      ? nd.detection_id === pred.detection_id
      : Math.abs(nd.x - pred.x) < 1 && Math.abs(nd.y - pred.y) < 1,
  );
}

interface InspectionState {
  appState: AppState;
  pickup: UploadFile | null;
  returnFile: UploadFile | null;
  result: AnalysisResult | null;
  error: string | null;
  similarityWarning: string | null;
  similarityLevel: 'low' | null;

  setPickup: (file: File) => void;
  removePickup: () => void;
  setReturnFile: (file: File) => void;
  removeReturnFile: () => void;
  analyze: (demo?: boolean) => Promise<void>;
  reset: () => void;
  dismissWarning: () => void;
}

export const useInspectionStore = create<InspectionState>((set, get) => ({
  appState: 'upload',
  pickup: null,
  returnFile: null,
  result: null,
  error: null,
  similarityWarning: null,
  similarityLevel: null,

  setPickup: (file) => {
    const { pickup } = get();
    if (pickup) URL.revokeObjectURL(pickup.url);
    set({ pickup: { file, url: URL.createObjectURL(file) } });
  },

  removePickup: () => {
    const { pickup } = get();
    if (pickup) URL.revokeObjectURL(pickup.url);
    set({ pickup: null });
  },

  setReturnFile: (file) => {
    const { returnFile } = get();
    if (returnFile) URL.revokeObjectURL(returnFile.url);
    set({ returnFile: { file, url: URL.createObjectURL(file) } });
  },

  removeReturnFile: () => {
    const { returnFile } = get();
    if (returnFile) URL.revokeObjectURL(returnFile.url);
    set({ returnFile: null });
  },

  analyze: async (demo = false) => {
    set({ error: null, similarityWarning: null, similarityLevel: null, appState: 'analyzing' });

    const timerPromise = new Promise<void>(r => setTimeout(r, 2900));

    if (demo) {
      try {
        const [beforeRes, afterRes] = await Promise.all([
          fetch('/demo-car-before.jpg'),
          fetch('/demo-car-after.jpg'),
        ]);
        const [beforeBlob, afterBlob] = await Promise.all([beforeRes.blob(), afterRes.blob()]);
        const pickupFile = new File([beforeBlob], 'demo-car-before.jpg', { type: 'image/jpeg' });
        const returnFileObj = new File([afterBlob], 'demo-car-after.jpg', { type: 'image/jpeg' });
        set({
          pickup: { file: pickupFile, url: URL.createObjectURL(pickupFile) },
          returnFile: { file: returnFileObj, url: URL.createObjectURL(returnFileObj) },
        });
      } catch {
        await timerPromise;
        set({ result: DEMO_RESULT, appState: 'results' });
        return;
      }
    }

    const { pickup, returnFile } = get();
    if (!pickup || !returnFile) return;

    let apiError: string | null = null;

    const [similarityScore, analysis] = await Promise.all([
      ImageSimilarity.compareSimilarity(pickup.file, returnFile.file).catch((): number => 1),
      RoboflowService.compareDamage(pickup.file, returnFile.file).catch(err => {
        apiError = err instanceof Error ? err.message : 'Analysis failed';
        return null;
      }),
      timerPromise,
    ]);

    if (apiError || !analysis) {
      if (demo) {
        set({ result: DEMO_RESULT, appState: 'results' });
        return;
      }
      set({ error: apiError ?? 'Analysis failed', appState: 'upload' });
      return;
    }

    const level = ImageSimilarity.getSimilarityLevel(similarityScore);
    const warning = level === 'low' ? ImageSimilarity.getSimilarityMessage(similarityScore) : null;

    set({
      result: analysis,
      appState: 'results',
      similarityWarning: warning,
      similarityLevel: level === 'low' ? 'low' : null,
    });
  },

  reset: () => {
    const { pickup, returnFile } = get();
    if (pickup) URL.revokeObjectURL(pickup.url);
    if (returnFile) URL.revokeObjectURL(returnFile.url);
    set({
      pickup: null,
      returnFile: null,
      result: null,
      error: null,
      similarityWarning: null,
      similarityLevel: null,
      appState: 'upload',
    });
  },

  dismissWarning: () => set({ similarityWarning: null, similarityLevel: null }),
}));
