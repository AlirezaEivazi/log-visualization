'use client';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: 'small' | 'medium';
}

export default function SearchBar({
  placeholder = 'Search…',
  value,
  onChange,
  size = 'small',
}: SearchBarProps) {
  return (
    <TextField
      fullWidth
      size={size}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          sx: { fontSize: '0.8125rem' },
        },
      }}
    />
  );
}
