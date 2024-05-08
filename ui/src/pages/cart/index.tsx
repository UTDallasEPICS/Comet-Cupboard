import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Box, Paper, Card, CardContent, CardMedia } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import BottomBar from "../../components/bottombar/BottomBar";

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
        { id: 1, name: 'Tomato', quantity: 2, price: 9.99, imageName: 'tomato.png' },
        { id: 2, name: 'Banana', quantity: 1, price: 19.99, imageName: 'banana.png' },
        { id: 3, name: 'Beef', quantity: 3, price: 5.99, imageName: 'beef.png' },
        { id: 4, name: 'Carrot', quantity: 1, price: 3.45, imageName: 'carrot.png' }
    ];

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxRate = 0.08; // Example tax rate of 8%
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ background: "#154734", blockSize: '10vh', width: "100%" }}>
                <Toolbar>
                    <div
                    style={{
                        width: "10vw",
                        height: "5vh",
                        overflow: "hidden",
                        marginTop: 15,
                    }}
                    >
                    <img
                        src="src/assets/CometCupboard_transparent_orange.png"
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        }}
                    ></img>
                    </div>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Shopping Cart
                    </Typography>
                    <Button color="inherit" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container sx={{ marginTop: '15vh', padding: '2vh 10vw', flexGrow: 1 }} spacing={2}>
                <Grid item xs={12} md={8}>
                    {cartItems.map((item: CartItem) => (
                        <Card key={item.id} sx={{ display: 'flex', marginBottom: 2 }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 151 }}
                                image={`/images/${item.imageName}`}
                                alt={item.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5">{item.name}</Typography>
                                <Typography variant="body2">Price: ${item.price}</Typography>
                                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                <Typography variant="body2">Subtotal: ${item.price * item.quantity}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>Order Summary</Typography>
                        <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                        <Typography>Tax: ${taxes.toFixed(2)}</Typography>
                        <Typography>Total: ${total.toFixed(2)}</Typography>
                        <Button variant="contained" color="primary" startIcon={<ShoppingCartIcon />} sx={{ marginTop: 2, backgroundColor: '#004d40' }} onClick={() => alert('Proceed to Checkout')}>
                            Checkout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <BottomBar image={"/src/assets/CometCupboard_transparent.png"} />
        </Box>
    );
}

