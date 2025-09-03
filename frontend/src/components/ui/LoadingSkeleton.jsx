import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box
} from '@mui/material';

const ProductSkeleton = () => (
  <Card className="product-loading-skeleton">
    <Skeleton 
      variant="rectangular" 
      height={200} 
      sx={{ borderRadius: '16px 16px 0 0' }} 
    />
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
        <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="text" height={16} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" height={16} width="80%" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Skeleton variant="text" width={60} height={24} />
        <Skeleton variant="rectangular" width={80} height={16} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 2, mb: 1 }} />
      <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 2 }} />
    </CardContent>
  </Card>
);

const LoadingSkeleton = ({ count = 12, variant = 'grid' }) => {
  if (variant === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Array.from(new Array(count)).map((_, index) => (
          <Card key={index} className="product-card-list" sx={{ height: 150 }}>
            <Skeleton 
              variant="rectangular" 
              width={200} 
              height={150} 
              sx={{ borderRadius: '16px 0 0 16px' }} 
            />
            <CardContent sx={{ flex: 1, p: 2.5 }}>
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Skeleton variant="rectangular" width={50} height={16} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={40} height={16} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={16} width="60%" sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width={50} height={20} />
                <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {Array.from(new Array(count)).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
