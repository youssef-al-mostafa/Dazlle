import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FiRefreshCcw, FiSearch } from 'react-icons/fi';
import { Provider } from './components/ui/provider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageUpload from './components/ImageUpload';
import Scanner from './components/Scanner';
import ProgressSteps from './components/ProgressSteps';
import StatCard from './components/StatCard';
import ResultPanel from './components/ResultPanel';
import DamageTable from './components/DamageTable';
import { RoboflowService } from './services/roboflow';
import type { DamageDetectionResult, RoboflowPrediction } from './types/roboflow';

type AppState = 'upload' | 'analyzing' | 'results';

interface UploadFile {
  file: File;
  url: string;
}

interface AnalysisResult {
  pickupDamage: DamageDetectionResult;
  returnDamage: DamageDetectionResult;
  newDamage: RoboflowPrediction[];
}

// Demo data — center-coordinate format matching Roboflow's API response
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

function isNewDamage(pred: RoboflowPrediction, newDamage: RoboflowPrediction[]): boolean {
  return newDamage.some(nd =>
    nd.detection_id && pred.detection_id
      ? nd.detection_id === pred.detection_id
      : Math.abs(nd.x - pred.x) < 1 && Math.abs(nd.y - pred.y) < 1,
  );
}

function getAvgConfidence(preds: RoboflowPrediction[]): string {
  if (preds.length === 0) return '0%';
  const avg = preds.reduce((s, p) => s + p.confidence, 0) / preds.length;
  return `${Math.round(avg * 100)}%`;
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function AnalyzingView() {
  return (
    <Flex
      direction="column"
      align="center"
      w="100%"
      maxW="480px"
      mx="auto"
      px="48px"
      py="80px"
      gap="32px"
      bg="surface"
      border="1px solid"
      borderColor="border.2"
      borderRadius="xl"
    >
      <Scanner />

      <Box textAlign="center">
        <Text fontFamily="display" fontSize="display.md" fontWeight={700} color="text.1">
          Analyzing Images
        </Text>
        <Text fontFamily="body" fontSize="body.md" color="text.2" mt="4px">
          AI is scanning for damage patterns…
        </Text>
      </Box>

      {/* Progress bar */}
      <Box w="100%" h="3px" bg="surface.3" borderRadius="pill" overflow="hidden">
        <Box
          h="100%"
          borderRadius="pill"
          style={{
            background: 'linear-gradient(90deg, #a78bfa, #ec4899)',
            animation: 'progress-anim 2.6s ease-in-out forwards',
          }}
        />
      </Box>

      <ProgressSteps />
    </Flex>
  );
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [pickup, setPickup] = useState<UploadFile | null>(null);
  const [returnFile, setReturnFile] = useState<UploadFile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = pickup !== null && returnFile !== null;

  const handlePickupChange = (file: File) => {
    if (pickup) URL.revokeObjectURL(pickup.url);
    setPickup({ file, url: URL.createObjectURL(file) });
  };

  const handleReturnChange = (file: File) => {
    if (returnFile) URL.revokeObjectURL(returnFile.url);
    setReturnFile({ file, url: URL.createObjectURL(file) });
  };

  const handlePickupRemove = () => {
    if (pickup) URL.revokeObjectURL(pickup.url);
    setPickup(null);
  };

  const handleReturnRemove = () => {
    if (returnFile) URL.revokeObjectURL(returnFile.url);
    setReturnFile(null);
  };

  const handleAnalyze = async (demo = false) => {
    setError(null);
    setAppState('analyzing');

    const timerPromise = new Promise<void>(r => setTimeout(r, 2900));

    if (demo) {
      await timerPromise;
      setResult(DEMO_RESULT);
      setAppState('results');
      return;
    }

    let apiError: string | null = null;

    const [analysis] = await Promise.all([
      RoboflowService.compareDamage(pickup!.file, returnFile!.file).catch(err => {
        apiError = err instanceof Error ? err.message : 'Analysis failed';
        return null;
      }),
      timerPromise,
    ]);

    if (apiError || !analysis) {
      setError(apiError ?? 'Analysis failed');
      setAppState('upload');
      return;
    }

    setResult(analysis);
    setAppState('results');
  };

  const handleReset = () => {
    if (pickup) URL.revokeObjectURL(pickup.url);
    if (returnFile) URL.revokeObjectURL(returnFile.url);
    setPickup(null);
    setReturnFile(null);
    setResult(null);
    setError(null);
    setAppState('upload');
  };

  return (
    <Provider>
      <Box
        minH="100vh"
        w="100%"
        style={{
          backgroundColor: '#070b12',
          backgroundImage: `
            radial-gradient(circle at 15% 15%, rgba(167,139,250,0.07) 0%, transparent 55%),
            radial-gradient(circle at 85% 75%, rgba(236,72,153,0.06) 0%, transparent 50%),
            linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 52px 52px, 52px 52px',
          backgroundAttachment: 'fixed',
        }}
      >
        <Navbar />

        <Box
          as="main"
          position="relative"
          zIndex={1}
          pt="62px"
          minH="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {/* Hero — always visible */}
          <Hero />

          {/* Workspace */}
          <Box w="100%" maxW="1120px" px="24px" pb="80px">

            {/* ── UPLOAD STATE ── */}
            {appState === 'upload' && (
              <Flex direction="column" align="center" gap="24px" w="100%">
                {error && (
                  <Box
                    w="100%"
                    px="20px"
                    py="14px"
                    bg="rgba(244,63,94,0.08)"
                    border="1px solid"
                    borderColor="danger.border"
                    borderRadius="xl"
                    textAlign="center"
                  >
                    <Text fontFamily="body" fontSize="body.sm" color="danger">
                      {error}
                    </Text>
                  </Box>
                )}

                <Grid
                  templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                  gap="20px"
                  w="100%"
                >
                  <ImageUpload
                    type="pickup"
                    uploadFile={pickup}
                    onFileChange={handlePickupChange}
                    onRemove={handlePickupRemove}
                  />
                  <ImageUpload
                    type="return"
                    uploadFile={returnFile}
                    onFileChange={handleReturnChange}
                    onRemove={handleReturnRemove}
                  />
                </Grid>

                {/* Analyze button */}
                <Box
                  as="button"
                  display="inline-flex"
                  alignItems="center"
                  gap="8px"
                  h="58px"
                  px="52px"
                  fontFamily="display"
                  fontSize="body.lg"
                  fontWeight={700}
                  letterSpacing="0.2px"
                  color="white"
                  borderRadius="pill"
                  border="none"
                  opacity={canAnalyze ? 1 : 0.22}
                  style={{
                    background: 'linear-gradient(130deg, #a78bfa 0%, #ec4899 100%)',
                    cursor: canAnalyze ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                  }}
                  _hover={
                    canAnalyze
                      ? { transform: 'translateY(-3px)', boxShadow: 'glow.button' }
                      : {}
                  }
                  onClick={() => canAnalyze && handleAnalyze(false)}
                >
                  <FiSearch size={16} />
                  Analyze Damage
                </Box>

                {/* Demo link */}
                <Box
                  as="button"
                  fontFamily="body"
                  fontSize="body.sm"
                  color="text.3"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  style={{
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255,255,255,0.1)',
                    transition: 'color 0.2s ease',
                  }}
                  _hover={{ color: 'text.2' }}
                  onClick={() => handleAnalyze(true)}
                >
                  Try with sample demo →
                </Box>
              </Flex>
            )}

            {/* ── ANALYZING STATE ── */}
            {appState === 'analyzing' && <AnalyzingView />}

            {/* ── RESULTS STATE ── */}
            {appState === 'results' && result && (
              <Flex direction="column" gap="20px" w="100%">

                {/* Header row */}
                <Flex align="flex-start" justify="space-between" gap="16px" flexWrap="wrap">
                  <Box>
                    <Text fontFamily="display" fontSize="display.sm" fontWeight={700} color="text.1">
                      Inspection Report
                    </Text>
                    <Text fontFamily="body" fontSize="body.sm" color="text.2" mt="3px">
                      Analysis complete · {formatDate()}
                    </Text>
                  </Box>

                  <Box
                    as="button"
                    display="inline-flex"
                    alignItems="center"
                    gap="7px"
                    h="40px"
                    px="20px"
                    fontFamily="display"
                    fontSize="body.sm"
                    fontWeight={600}
                    color="text.2"
                    bg="surface.2"
                    border="1px solid"
                    borderColor="border.2"
                    borderRadius="pill"
                    cursor="pointer"
                    whiteSpace="nowrap"
                    style={{ transition: 'all 0.2s ease' }}
                    _hover={{ bg: 'surface.3', color: 'text.1' }}
                    onClick={handleReset}
                  >
                    <FiRefreshCcw size={13} />
                    New Inspection
                  </Box>
                </Flex>

                {/* Stats row */}
                <Grid
                  templateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
                  gap="14px"
                >
                  <StatCard
                    label="Pickup Damages"
                    value={result.pickupDamage.predictions.length}
                    hint="Pre-existing at pickup"
                  />
                  <StatCard
                    label="Return Damages"
                    value={result.returnDamage.predictions.length}
                    hint="Total found at return"
                  />
                  <StatCard
                    label="New Damage"
                    value={result.newDamage.length}
                    hint="Occurred during rental"
                    alert
                  />
                  <StatCard
                    label="Avg. Confidence"
                    value={getAvgConfidence(result.returnDamage.predictions)}
                    hint="Model detection accuracy"
                  />
                </Grid>

                {/* Annotated image grid */}
                <Grid
                  templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                  gap="18px"
                >
                  <ResultPanel
                    type="pickup"
                    imageFile={pickup?.file ?? null}
                    predictions={result.pickupDamage.predictions}
                    originalWidth={result.pickupDamage.imageWidth}
                    originalHeight={result.pickupDamage.imageHeight}
                  />
                  <ResultPanel
                    type="return"
                    imageFile={returnFile?.file ?? null}
                    predictions={result.returnDamage.predictions.filter(
                      p => !isNewDamage(p, result.newDamage),
                    )}
                    newPredictions={result.newDamage}
                    originalWidth={result.returnDamage.imageWidth}
                    originalHeight={result.returnDamage.imageHeight}
                  />
                </Grid>

                {/* Damage table */}
                {result.newDamage.length > 0 && (
                  <DamageTable
                    damages={result.newDamage}
                    imageWidth={result.returnDamage.imageWidth}
                    imageHeight={result.returnDamage.imageHeight}
                  />
                )}

                {result.newDamage.length === 0 && (
                  <Box
                    px="22px"
                    py="18px"
                    bg="rgba(16, 217, 160, 0.06)"
                    border="1px solid rgba(16, 217, 160, 0.2)"
                    borderRadius="xl"
                    textAlign="center"
                  >
                    <Text fontFamily="display" fontSize="body.md" fontWeight={600} color="success">
                      No New Damage Detected
                    </Text>
                    <Text fontFamily="body" fontSize="body.sm" color="text.2" mt="4px">
                      The vehicle appears to be in the same condition as pickup.
                    </Text>
                  </Box>
                )}
              </Flex>
            )}

          </Box>
        </Box>
      </Box>
    </Provider>
  );
}
