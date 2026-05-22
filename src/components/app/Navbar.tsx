import { Box, Text } from '@chakra-ui/react';

export default function Navbar() {
  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={200}
      h="62px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px="32px"
      boxShadow="navbar"
      style={{
        background: 'rgba(7, 11, 18, 0.82)',
        backdropFilter: 'blur(20px)',
      }}
    >
   
        <Text
          fontFamily="display"
          fontSize="36px"
          fontWeight={700}
          letterSpacing="title"
          color="text.1"
          lineHeight="1"
          w="100vw"
          textAlign="center"
        >
          Daz
          <Text as="em" fontStyle="normal" color="accent">
            elle
          </Text>
        </Text>
    
    </Box>
  );
}
