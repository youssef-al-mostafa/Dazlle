import { Box, Flex, Text } from '@chakra-ui/react';

export default function Hero() {
  return (
    <Box
      textAlign="center"
      maxW="680px"
      px="24px"
      pt="56px"
      pb="44px"
      w="100%"
    >

      {/* Title */}
      <Box
        fontFamily="display"
        fontWeight={700}
        lineHeight="hero"
        letterSpacing="hero"
        mb="18px"
        fontSize={{ base: '36px', md: 'display.hero' }}
        style={{
          background: 'linear-gradient(150deg, #eef2ff 10%, #a5b4fc 60%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Vehicle Damage
        <br />
        Inspector
      </Box>

      {/* Subtitle */}
      <Text
        fontFamily="body"
        fontSize="body.lg"
        color="text.2"
        lineHeight="relaxed"
        maxW="520px"
        mx="auto"
      >
        Upload pickup and return inspection photos. Our AI instantly identifies
        new damage between inspections precise, annotated, reportable.
      </Text>
    </Box>
  );
}
