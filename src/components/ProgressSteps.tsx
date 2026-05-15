import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type StepState = 'default' | 'active' | 'done';

const STEP_LABELS = [
  'Encoding images for processing',
  'Detecting damage regions',
  'Comparing inspections',
  'Generating report',
];

const INITIAL_STATES: StepState[] = ['done', 'active', 'default', 'default'];

export default function ProgressSteps() {
  const [stepStates, setStepStates] = useState<StepState[]>(INITIAL_STATES);

  useEffect(() => {
    setStepStates(INITIAL_STATES);

    const t1 = setTimeout(() => {
      setStepStates(['done', 'done', 'active', 'default']);
    }, 900);

    const t2 = setTimeout(() => {
      setStepStates(['done', 'done', 'done', 'active']);
    }, 1700);

    const t3 = setTimeout(() => {
      setStepStates(['done', 'done', 'done', 'done']);
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <Flex direction="column" gap="10px" w="100%">
      {STEP_LABELS.map((label, i) => {
        const state = stepStates[i];
        const textColor =
          state === 'done' ? 'success' : state === 'active' ? 'text.1' : 'text.3';
        const pipBg =
          state === 'done' ? 'success' : state === 'active' ? 'accent' : 'text.3';
        const pipShadow =
          state === 'active' ? '0 0 6px #a78bfa' : undefined;

        return (
          <Flex key={i} align="center" gap="10px" style={{ transition: 'color 0.3s ease' }}>
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg={pipBg}
              flexShrink={0}
              style={{
                boxShadow: pipShadow,
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }}
            />
            <Text
              fontFamily="body"
              fontSize="body.sm"
              color={textColor}
              style={{ transition: 'color 0.3s ease' }}
            >
              {label}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}
