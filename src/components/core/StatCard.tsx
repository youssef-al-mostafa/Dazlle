import { Box, Text } from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: string | number;
  hint: string;
  alert?: boolean;
}

export default function StatCard({ label, value, hint, alert = false }: StatCardProps) {
  return (
    <Box
      borderRadius="lg"
      border="1px solid"
      borderColor={alert ? 'danger.border' : 'border.2'}
      px="22px"
      py="18px"
      display="flex"
      flexDirection="column"
      gap="6px"
      style={
        alert
          ? { background: 'linear-gradient(135deg, rgba(244,63,94,0.06), rgba(244,63,94,0.02))' }
          : { background: '#111827' }
      }
    >
      <Text
        fontFamily="body"
        fontSize="label.xs"
        fontWeight={600}
        color="text.3"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <Text
        fontFamily="display"
        fontSize="display.lg"
        fontWeight={700}
        color={alert ? 'danger' : 'text.1'}
        lineHeight="1"
      >
        {value}
      </Text>
      <Text fontFamily="body" fontSize="body.xs" color="text.3">
        {hint}
      </Text>
    </Box>
  );
}
