import { Box, Text, chakra } from '@chakra-ui/react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

const socialLinks = [
  {
    icon: FaGithub,
    href: 'https://github.com/youssef-al-mostafa/Dazlle/',
    label: 'GitHub',
  },
  {
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/in/youssef-al-mostafa/',
    label: 'LinkedIn',
  },
  {
    icon: MdOutlineEmail,
    href: 'mailto:youssefalmostafa2@gmail.com',
    label: 'Email',
  },
];

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
      <Box
        w="100%"
        maxW="1120px"
        mx="auto"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
      <Text
        fontFamily="display"
        fontSize="36px"
        fontWeight={700}
        letterSpacing="title"
        color="text.1"
        lineHeight="1"
        textAlign="center"
      >
        Daz
        <Text as="em" fontStyle="normal" color="accent">
          elle
        </Text>
      </Text>

      <Box flex="1" display="flex" justifyContent="flex-end" gap="4px">
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <chakra.a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="36px"
            h="36px"
            borderRadius="sm"
            color="text.3"
            fontSize="18px"
            transition="color 0.2s ease, background 0.2s ease"
            _hover={{
              color: 'accent',
              background: 'accent.dim',
            }}
          >
            <Icon />
          </chakra.a>
        ))}
      </Box>
      </Box>
    </Box>
  );
}
