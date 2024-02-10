import * as React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function FloatingActionButtons({ buttonContent }: { buttonContent?: [string] }) {
    return (
        <Fab variant="extended">
          <AddIcon sx={{ mr: 1 }} />
          {buttonContent}
        </Fab>
    );
  }