import { Box } from '@chakra-ui/react';

export default function Scanner() {
  return (
    <Box position="relative" w="130px" h="130px" flexShrink={0}>
      {/* Ring 1 — outer, clockwise 1.1s */}
      <Box
        position="absolute"
        inset={0}
        borderRadius="full"
        border="2px solid transparent"
        borderTopColor="accent"
        style={{ animation: 'spin 1.1s linear infinite' }}
      />

      {/* Ring 2 — counter-clockwise 1.7s */}
      <Box
        position="absolute"
        borderRadius="full"
        border="2px solid transparent"
        style={{
          inset: '14px',
          borderTopColor: 'rgba(139, 92, 246, 0.8)',
          animation: 'spin 1.7s linear infinite reverse',
        }}
      />

      {/* Ring 3 — clockwise 2.3s */}
      <Box
        position="absolute"
        borderRadius="full"
        border="2px solid transparent"
        style={{
          inset: '28px',
          borderTopColor: 'rgba(167,139,250,0.35)',
          animation: 'spin 2.3s linear infinite',
        }}
      />

      {/* Core — pulsing */}
      <Box
        position="absolute"
        borderRadius="full"
        bg="accent.dim"
        border="1px solid"
        borderColor="accent.border"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          inset: '42px',
          animation: 'pulse-core 2s ease-in-out infinite',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </Box>
    </Box>
  );
}
