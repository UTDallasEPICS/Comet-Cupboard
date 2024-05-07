import React from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageName: string;
}

export const Cart = () => {
    const navigate = useNavigate();
    const cartItems: CartItem[] = [
        { id: 1, name: 'Apple', quantity: 2, price: 9.99, imageName: 'apple.png' },
        { id: 2, name: 'Banana', quantity: 1, price: 19.99, imageName: 'banana.png' },
        { id: 3, name: 'Beef', quantity: 3, price: 5.99, imageName: 'beef.png' },
        { id: 4, name: 'Carrot', quantity: 1, price: 3.45, imageName: 'carrot.png' }
    ];

    
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxRate = 0.08;  // Example tax rate of 8%
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes;

    const handleNavigateBack = () => {
        navigate(-1); 
    };

    return (
        <div style={{ padding: '10vh 10vw', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Paper style={{ padding: '20px', marginRight: '50px', backgroundColor: 'white', minWidth: '200px' }}>
                <Typography variant="h6">Summary</Typography>
                <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                <Typography>Tax: ${taxes.toFixed(2)}</Typography>
                <Typography>Total: ${total.toFixed(2)}</Typography>
                <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={() => alert('Proceed to Checkout')}>
                    Checkout
                </Button>
            </Paper>

            <List style={{ flexGrow: 1, maxWidth: '600px', marginTop: '12vh' }}>
                <AppBar position="fixed" sx={{ background: "#154734", blockSize: '10vh', width: "100%" }}>
                    <Toolbar>
                        <img src="/src/images/CometCupboard_transparent_orange.png" alt="Comet Cupboard Logo" style={{ marginRight: '1vw', height: '5vh', width: '10vw' }} />
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                            Shopping Cart
                        </Typography>
                        <Button color="inherit" onClick={handleNavigateBack}>
                            Back
                        </Button>
                    </Toolbar>
                </AppBar>
                {cartItems.map((item: CartItem) => (
                    <React.Fragment key={item.id}>
                        <ListItem>
                            <div style={{ marginRight: '10px' }}>
                                <img src={`/ui/public/images/${item.imageName}`} alt={item.name} style={{ height: '50px', width: '50px' }} />
                            </div>
                            <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity} | Price: $${item.price}`} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
}

