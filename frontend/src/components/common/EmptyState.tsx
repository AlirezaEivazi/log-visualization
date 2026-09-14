import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'text.secondary',
        py: 6,
        gap: 1,
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 32, opacity: 0.5 }} />
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      {description && <Typography variant="caption">{description}</Typography>}
    </Box>
  );
}
