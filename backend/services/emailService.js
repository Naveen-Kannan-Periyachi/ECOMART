const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.log('Error with email transporter:', error);
  } else {
    console.log('Email server is ready');
  }
});

// Send order confirmation
const sendOrderConfirmation = async (order) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: order.buyer.email,
      subject: 'Order Confirmation - Ecomart',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order ID: ${order._id}</p>
        <p>Total: $${order.totalPrice}</p>
        <h2>Items:</h2>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>${item.product.title} x ${item.quantity} - $${
                item.price * item.quantity
              }</li>
          `
            )
            .join('')}
        </ul>
        <h2>Shipping Address:</h2>
        <p>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
        order.shippingAddress.zipCode
      }<br>
          ${order.shippingAddress.country}
        </p>
      `,
    });
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
};

// Send booking confirmation
const sendBookingConfirmation = async (booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: booking.renter.email,
      subject: 'Booking Confirmation - Ecomart',
      html: `
        <h1>Your booking is confirmed!</h1>
        <p>Booking ID: ${booking._id}</p>
        <p>Product: ${booking.product.title}</p>
        <p>Dates: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(
        booking.endDate
      ).toLocaleDateString()}</p>
        <p>Total: $${booking.totalPrice}</p>
        <p>Status: ${booking.status}</p>
      `,
    });

    // Also notify the owner
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: booking.owner.email,
      subject: 'New Booking Request - Ecomart',
      html: `
        <h1>You have a new booking request!</h1>
        <p>Booking ID: ${booking._id}</p>
        <p>Product: ${booking.product.title}</p>
        <p>Renter: ${booking.renter.name} (${booking.renter.email})</p>
        <p>Dates: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(
        booking.endDate
      ).toLocaleDateString()}</p>
        <p>Total: $${booking.totalPrice}</p>
        <p>Please log in to your account to confirm or reject this booking.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendBookingConfirmation,
};
