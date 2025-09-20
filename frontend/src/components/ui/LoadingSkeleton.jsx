import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box
} from '@mui/material';

const ProductSkeleton = () => (
  <Card className="product-loading-skeleton product-card" sx={{ 
    minHeight: '380px',
    maxHeight: '380px',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Skeleton 
      variant="rectangular" 
      height={160} 
      sx={{ 
        borderRadius: '0',
        flexShrink: 0
      }} 
    />
    <CardContent sx={{ 
      p: 2,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Header Section */}
      <Box>
        <Skeleton variant="text" height={24} sx={{ mb: 1, fontSize: '1rem' }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Skeleton variant="rectangular" width={60} height={18} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={50} height={18} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" height={14} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" height={14} width="80%" sx={{ mb: 1 }} />
      </Box>
      
      {/* Footer Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="rectangular" width={60} height={14} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" height={28} sx={{ borderRadius: 1, mb: 0.5 }} />
        <Skeleton variant="rectangular" height={28} sx={{ borderRadius: 1 }} />
      </Box>
    </CardContent>
  </Card>
);

const LoadingSkeleton = ({ count = 12, variant = 'grid' }) => {
  if (variant === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Array.from(new Array(count)).map((_, index) => (
          <Card key={index} className="product-card-list" sx={{ 
            height: '180px',
            minHeight: '180px',
            maxHeight: '180px',
            display: 'flex',
            flexDirection: 'row'
          }}>
            <Skeleton 
              variant="rectangular" 
              width={200} 
              height={180} 
              sx={{ 
                borderRadius: '0',
                flexShrink: 0
              }} 
            />
            <CardContent sx={{ 
              flex: 1, 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Header */}
              <Box>
                <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Skeleton variant="rectangular" width={50} height={14} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={40} height={14} sx={{ borderRadius: 1 }} />
                </Box>
                <Skeleton variant="text" height={14} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" height={14} width="60%" sx={{ mb: 1 }} />
              </Box>
              
              {/* Footer */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width={50} height={18} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
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
