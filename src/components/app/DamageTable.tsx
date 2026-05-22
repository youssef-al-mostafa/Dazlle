import { Box, Flex, Text } from '@chakra-ui/react';
import type { RoboflowPrediction } from '../../types/roboflow';

interface DamageTableProps {
  damages: RoboflowPrediction[];
  imageWidth?: number;
  imageHeight?: number;
}

function getLocation(pred: RoboflowPrediction, imgW = 800, imgH = 500): string {
  const cx = pred.x / imgW;
  const cy = pred.y / imgH;

  const hPos = cx < 0.33 ? 'left' : cx < 0.67 ? 'center' : 'right';
  const vPos = cy < 0.33 ? 'front' : cy < 0.67 ? 'side' : 'rear';

  const area =
    vPos === 'front'
      ? 'Hood / front panel'
      : vPos === 'rear'
        ? 'Rear bumper'
        : hPos === 'left'
          ? 'Driver door'
          : hPos === 'right'
            ? 'Passenger door'
            : 'Center panel';

  const side =
    hPos === 'left' ? 'left side' : hPos === 'right' ? 'right side' : 'center';

  return `${area} — ${side}`;
}

export default function DamageTable({ damages, imageWidth = 800, imageHeight = 500 }: DamageTableProps) {
  if (damages.length === 0) return null;

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
        px="22px"
        py="18px"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Text fontFamily="display" fontSize="body.md" fontWeight={600} color="text.1">
          New Damage Detected
        </Text>
        <Box
          as="span"
          fontFamily="body"
          fontSize="label.xs"
          fontWeight={700}
          color="danger"
          bg="danger.dim"
          border="1px solid"
          borderColor="danger.border"
          px="10px"
          py="3px"
          borderRadius="pill"
          letterSpacing="wide"
          textTransform="uppercase"
        >
          {damages.length} {damages.length === 1 ? 'Item' : 'Items'}
        </Box>
      </Flex>

      {/* Rows */}
      {damages.map((dmg, i) => {
        const conf = Math.round(dmg.confidence * 100);
        const location = getLocation(dmg, imageWidth, imageHeight);

        return (
          <Flex
            key={dmg.detection_id ?? i}
            align="center"
            justify="space-between"
            px="22px"
            py="13px"
            borderBottom={i < damages.length - 1 ? '1px solid' : undefined}
            borderColor="border"
            style={{ transition: 'background 0.15s ease' }}
            _hover={{ bg: 'surface.2' }}
          >
            {/* Left */}
            <Flex align="center" gap="13px">
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg="danger"
                flexShrink={0}
                style={{ boxShadow: '0 0 6px rgba(244,63,94,0.6)' }}
              />
              <Box>
                <Text fontFamily="body" fontSize="body.md" fontWeight={500} color="text.1" textTransform="capitalize">
                  {dmg.class}
                </Text>
                <Text fontFamily="body" fontSize="body.xs" color="text.3" mt="1px">
                  {location}
                </Text>
              </Box>
            </Flex>

            {/* Right — confidence */}
            <Flex align="center" gap="10px">
              <Box w="84px" h="3px" bg="surface.3" borderRadius="pill" overflow="hidden">
                <Box
                  h="100%"
                  borderRadius="pill"
                  bg="danger"
                  style={{ width: `${conf}%` }}
                />
              </Box>
              <Text
                fontFamily="body"
                fontSize="body.xs"
                fontWeight={600}
                color="text.2"
                w="34px"
                textAlign="right"
              >
                {conf}%
              </Text>
            </Flex>
          </Flex>
        );
      })}
    </Box>
  );
}
