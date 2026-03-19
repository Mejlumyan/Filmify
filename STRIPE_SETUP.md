# Stripe Payment Integration Guide

## Overview
This project now includes Stripe payment integration for booking tickets. Users can either:
1. **Pay with Balance** - Use their wallet/account balance to book tickets
2. **Pay with Card** - Use Stripe to pay directly with a credit/debit card

## Setup Instructions

### 1. Install Dependencies
Stripe packages are already installed:
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

### 2. Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in to your Stripe account
3. Navigate to **Developers** → **API Keys**
4. Copy your **Publishable Key** (starts with `pk_test_` for testing)
5. Copy your **Secret Key** (starts with `sk_test_` for testing)

### 3. Configure Environment Variables

Create a `.env.local` file in the `front` directory:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Or use `.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

### 4. Test Payment Details

For testing purposes, use these Stripe test card numbers:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

**Requires Authentication:**
- Card Number: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits

## Implementation Details

### Files Modified/Created

1. **StripePaymentForm.jsx** - Reusable Stripe payment form component
   - Handles card input validation
   - Processes Stripe payments
   - Displays payment status

2. **Booking.jsx** - Updated booking flow
   - Added Stripe payment modal
   - Added "Book with Card" button
   - Integrated payment processing

3. **paymentService.js** - Extended service
   - Added `processStripePayment()` method
   - Communicates with backend

4. **Booking.scss** - Updated styles
   - Stripe modal styling
   - Two-button checkout layout
   - Test card information display

### Payment Flow

```
User Selects Seats
    ↓
Click "Book Now"
    ↓
Choose Payment Method:
  ├─ "Book with Balance" → Deduct from wallet
  └─ "Book with Card" → Show Stripe Modal
         ↓
    Enter Card Details
         ↓
    Process with Stripe
         ↓
    Confirm to Backend
         ↓
    Create Booking & Tickets
```

## Backend Integration

Your backend needs to handle the `/payments/stripe` endpoint:

```javascript
// Backend endpoint example (Node.js/Express)
app.post('/payments/stripe', async (req, res) => {
  const { paymentMethodId, amount, isDirectPayment } = req.body;
  
  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });
    
    if (paymentIntent.status === 'succeeded') {
      // Create booking tickets
      // Update user balance if needed
      res.json({ success: true, bookingId: '...' });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## Features

✅ **Test Mode Support** - Pre-filled test card for easy testing  
✅ **Error Handling** - Comprehensive error messages  
✅ **Loading States** - Visual feedback during processing  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Dark Mode** - Fully styled for dark theme  
✅ **Two Payment Options** - Balance or Card  

## Security Notes

⚠️ **NEVER** commit real Stripe keys to git  
⚠️ **ALWAYS** use environment variables for sensitive data  
⚠️ **ALWAYS** validate payments on the backend  
⚠️ Keep `VITE_STRIPE_PUBLISHABLE_KEY` safe (it's public, but don't share widely)  
⚠️ Never expose `VITE_STRIPE_SECRET_KEY` on the frontend  

## Troubleshooting

### "Stripe is not loaded"
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Verify the key is a test key (`pk_test_`)

### "Card element not found"
- Ensure the page has properly loaded the Stripe elements
- Check browser console for errors

### Payment fails with test card
- Use the exact test card numbers listed above
- Check that the Stripe key is correct
- Verify backend endpoint exists and is properly configured

## Testing the Feature

1. Select seats on the booking page
2. Click "Book with Card" button
3. A modal will appear with test card details
4. The form shows pre-filled test card info
5. Click "Pay [amount] AMD"
6. Backend processes the payment
7. Booking is confirmed

## Future Enhancements

- [ ] Add 3D Secure authentication modal
- [ ] Save payment methods for future use
- [ ] Implement payment retry logic
- [ ] Add payment receipt/invoice PDF
- [ ] Support more payment methods (Apple Pay, Google Pay)
- [ ] Implement subscription plans

---

**Need help?** Check [Stripe Documentation](https://stripe.com/docs)
