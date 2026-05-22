import { Box, Text } from '@chakra-ui/react';
import { MdOutlineEmail } from 'react-icons/md';

export default function Footer() {
  return (
    <Box
      as="footer"
      w="100%"
      borderTop="1px solid"
      borderColor="accent.border"
      style={{
        background: 'rgba(7, 11, 18, 0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Box
        w="100%"
        maxW="1120px"
        mx="auto"
        px="24px"
        py="28px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap="12px"
      >
        <Text fontFamily="body" fontSize="body.sm" color="text.3">
          © Youssef Al Mostafa,{' '}
          <Text as="span" color="accent" fontWeight={600}>
            Dazlle
          </Text>{' '}
          · 2026 · All rights reserved
        </Text>

        <Box
          as="a"
          href="mailto:youssefalmostafa2@gmail.com"
          display="flex"
          alignItems="center"
          gap="6px"
          fontFamily="body"
          fontSize="body.sm"
          color="text.3"
          transition="color 0.2s ease"
          _hover={{ color: 'accent' }}
        >
          <MdOutlineEmail size={15} />
          youssefalmostafa2@gmail.com
        </Box>
      </Box>
    </Box>
  );
}
