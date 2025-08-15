import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { api } from '../utils/api';

const OrderDetails = () => {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		api.get(`/orders/${id}`)
			.then(res => setOrder(res.data))
			.catch(err => setError(err.response?.data?.message || err.message))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="50vh"><CircularProgress /></Box>;
	if (error) return <Alert severity="error">{error}</Alert>;
	if (!order) return null;

	return (
		<Box maxWidth="md" mx="auto" mt={4}>
			<Paper elevation={2} sx={{ p: 3 }}>
				<Typography variant="h5" gutterBottom>Order Details</Typography>
				<Typography variant="subtitle1">Order ID: {order._id}</Typography>
				<Typography>Status: {order.status}</Typography>
				<Typography>Total: ${order.total}</Typography>
				<Typography variant="h6" mt={2}>Products:</Typography>
				<List>
					{order.products?.map((prod, idx) => (
						<ListItem key={prod._id || idx}>
							<ListItemText
								primary={prod.title || 'Product'}
								secondary={`Price: $${prod.price || ''}`}
							/>
						</ListItem>
					))}
				</List>
				<Typography variant="subtitle2" mt={2}>Buyer: {order.buyer?.name} ({order.buyer?.email})</Typography>
				<Typography variant="caption" display="block" mt={2}>Created: {new Date(order.createdAt).toLocaleString()}</Typography>
			</Paper>
		</Box>
	);
};

export default OrderDetails;
