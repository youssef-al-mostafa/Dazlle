import { Box, Flex, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiFile } from 'react-icons/fi';

interface UploadFile {
  file: File;
  url: string;
}

interface ImageUploadProps {
  type: 'pickup' | 'return';
  uploadFile: UploadFile | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}

const CARD_META = {
  pickup: {
    title: 'Pickup Inspection',
    subtitle: 'Condition at vehicle pickup',
  },
  return: {
    title: 'Return Inspection',
    subtitle: 'Condition at vehicle return',
  },
};

export default function ImageUpload({
  type,
  uploadFile,
  onFileChange,
  onRemove,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { title, subtitle } = CARD_META[type];
  const isPickup = type === 'pickup';

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileChange(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const iconActive = isHovering || isDragging;

  return (
    <Box
      bg="surface"
      border="1px solid"
      borderColor={isDragging ? 'accent' : 'border.2'}
      borderRadius="xl"
      overflow="hidden"
      boxShadow={isDragging ? 'glow.card' : undefined}
      style={{ transition: 'border-color 0.25s ease, box-shadow 0.25s ease' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card header */}
      <Flex
        align="center"
        justify="space-between"
        px="22px"
        pt="18px"
        pb="16px"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Flex align="center" gap="10px">
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
          <Box>
            <Text fontFamily="display" fontSize="body.md" fontWeight={600} color="text.1">
              {title}
            </Text>
            <Text fontFamily="body" fontSize="body.xs" color="text.3" mt="1px">
              {subtitle}
            </Text>
          </Box>
        </Flex>

        {/* Badge */}
        <Box
          as="span"
          fontFamily="body"
          fontSize="label.xs"
          fontWeight={600}
          px="10px"
          py="3px"
          borderRadius="pill"
          letterSpacing="wide"
          textTransform="uppercase"
          style={{ transition: 'all 0.2s ease' }}
          color={uploadFile ? 'success' : 'text.2'}
          bg={uploadFile ? 'rgba(16, 217, 160, 0.1)' : 'rgba(255,255,255,0.07)'}
          border="1px solid"
          borderColor={uploadFile ? 'rgba(16, 217, 160, 0.3)' : 'border.2'}
        >
          {uploadFile ? 'Ready' : 'Awaiting'}
        </Box>
      </Flex>

      {/* Drop zone */}
      {!uploadFile && (
        <Box
          position="relative"
          px="28px"
          py="44px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="18px"
          minH="230px"
          justifyContent="center"
          cursor="pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleChange}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          />

          {/* Drop icon */}
          <Box
            w="76px"
            h="76px"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={iconActive ? 'accent.dim' : 'surface.2'}
            border="1px solid"
            borderColor={iconActive ? 'accent.border' : 'border.2'}
            color={iconActive ? 'accent' : 'text.3'}
            style={{
              transform: iconActive ? 'scale(1.06)' : 'scale(1)',
              boxShadow: iconActive ? '0 0 24px rgba(167,139,250,0.2)' : undefined,
              transition: 'all 0.3s ease',
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </Box>

          <Box textAlign="center">
            <Text
              fontFamily="display"
              fontSize="body.md"
              fontWeight={600}
              color="text.1"
              mb="5px"
            >
              Click to upload or drag &amp; drop
            </Text>
            <Text fontFamily="body" fontSize="body.xs" color="text.3">
              PNG, JPG, JPEG — up to 10 MB
            </Text>
          </Box>
        </Box>
      )}

      {/* Preview zone */}
      {uploadFile && (
        <Box px="20px" pt="14px" pb="22px" display="flex" flexDirection="column" gap="10px">
          <Box
            position="relative"
            borderRadius="md"
            overflow="hidden"
            bg="surface.2"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={uploadFile.url}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Remove button */}
            <Box
              as="button"
              position="absolute"
              top="8px"
              right="8px"
              w="28px"
              h="28px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              border="1px solid rgba(255,255,255,0.12)"
              cursor="pointer"
              style={{
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s ease',
                fontSize: '13px',
              }}
              _hover={{ bg: 'danger' }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ✕
            </Box>
          </Box>

          {/* Filename */}
          <Flex align="center" gap="7px">
            <Box color="text.3" style={{ opacity: 0.5 }} flexShrink={0}>
              <FiFile size={12} />
            </Box>
            <Text
              fontFamily="body"
              fontSize="body.xs"
              color="text.2"
              overflow="hidden"
              style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {uploadFile.file.name}
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
