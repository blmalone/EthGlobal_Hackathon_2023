import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

function ImageCard({ imageUrl, title }) {
  return (
    <Card>
      <CardMedia
        component="img"
        alt={title}
        height="200"
        image={imageUrl} // URL of the image
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ImageCard;
