import { Box, Flex, Text } from '@chakra-ui/react';
import AnnotatedImage from './AnnotatedImage';
import type { RoboflowPrediction } from '../../types/roboflow';

interface ResultPanelProps {
  type: 'pickup' | 'return';
  imageFile: File | null;
  predictions: RoboflowPrediction[];
  newPredictions?: RoboflowPrediction[];
  originalWidth?: number;
  originalHeight?: number;
}

export default function ResultPanel({
  type,
  imageFile,
  predictions,
  newPredictions = [],
  originalWidth,
  originalHeight,
}: ResultPanelProps) {
  const isPickup = type === 'pickup';
  const totalCount = predictions.length + newPredictions.length;
  const hasNew = newPredictions.length > 0;

  return (
    <Box
      bg="surface"
      border="1px solid"
      borderColor="border.2"
      borderRadius="xl"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px="20px"
        py="15px"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Flex
          align="center"
          gap="8px"
          fontFamily="display"
          fontSize="body.md"
          fontWeight={600}
          color="text.1"
        >
          <Box
            w="9px"
            h="9px"
            borderRadius="full"
            bg={isPickup ? 'accent' : 'danger'}
            flexShrink={0}
            style={{
              boxShadow: isPickup
                ? '0 0 8px rgba(167,139,250,0.7)'
                : '0 0 8px rgba(244,63,94,0.7)',
            }}
          />
          {isPickup ? 'Pickup Inspection' : 'Return Inspection'}
        </Flex>

        {/* Badge */}
        {!isPickup && hasNew ? (
          <Box
            as="span"
            fontFamily="body"
            fontSize="label.xs"
            fontWeight={600}
            color="success"
            bg="rgba(16, 217, 160, 0.1)"
            border="1px solid rgba(16, 217, 160, 0.3)"
            px="10px"
            py="3px"
            borderRadius="pill"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            {newPredictions.length} NEW
          </Box>
        ) : (
          <Box
            as="span"
            fontFamily="body"
            fontSize="label.xs"
            fontWeight={600}
            color="text.3"
            bg="rgba(255,255,255,0.04)"
            border="1px solid"
            borderColor="border"
            px="10px"
            py="3px"
            borderRadius="pill"
          >
            {totalCount} {totalCount === 1 ? 'damage' : 'damages'}
          </Box>
        )}
      </Flex>

      {/* Canvas */}
      <Box
        bg="surface.2"
        style={{ aspectRatio: '16/10' }}
        position="relative"
        overflow="hidden"
      >
        <AnnotatedImage
          imageFile={imageFile}
          predictions={predictions}
          newPredictions={newPredictions}
          originalWidth={originalWidth}
          originalHeight={originalHeight}
        />
      </Box>

      {/* Legend */}
      <Flex
        align="center"
        gap="18px"
        px="20px"
        py="12px"
        borderTop="1px solid"
        borderColor="border"
      >
        <Flex align="center" gap="6px">
          <Box w="10px" h="10px" borderRadius="2px" bg="#3b82f6" />
          <Text fontFamily="body" fontSize="label" color="text.2">
            Pre-existing
          </Text>
        </Flex>
        {!isPickup && (
          <Flex align="center" gap="6px">
            <Box w="10px" h="10px" borderRadius="2px" bg="#f43f5e" />
            <Text fontFamily="body" fontSize="label" color="text.2">
              New damage
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
