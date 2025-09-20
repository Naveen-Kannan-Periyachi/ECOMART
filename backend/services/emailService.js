import nodemailer from 'nodemailer';

// Create transporter with fallback configuration
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('No email credentials found. Email service disabled.');
    return null;
  }

  return nodemailer.createTransporter(config);
};

const transporter = createTransporter();

if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.log('Email transporter error:', error.message);
    } else {
      console.log('Email server is ready');
    }
  });
} else {
  console.log('Email service disabled - no credentials provided');
}

const emailTemplates = {
  welcome: (user) => ({
    subject: 'Welcome to EcoMart!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1976d2; padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to EcoMart!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hi ${user.name}!</h2>
          <p>Welcome to EcoMart - your marketplace for buying, selling, and renting products!</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Get Started:</h3>
            <ul>
              <li>Browse thousands of products</li>
              <li>List your own items for sale or rent</li>
              <li>Chat with buyers and sellers</li>
              <li>Track your orders and earnings</li>
            </ul>
          </div>
        </div>
      </div>
    `
  }),

  orderConfirmation: (order) => ({
    subject: 'Order Confirmation - EcoMart',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4caf50; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Thank you for your order, ${order.buyer ? order.buyer.name : 'Customer'}!</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total:</strong> $${order.total || 'N/A'}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
        </div>
      </div>
    `
  })
};

const sendEmail = async (to, template) => {
  if (!transporter) {
    console.log('Email service unavailable - would send:', template.subject);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (user) => {
  const template = emailTemplates.welcome(user);
  return await sendEmail(user.email, template);
};

const sendOrderConfirmation = async (order) => {
  if (!order.buyer || !order.buyer.email) {
    console.error('Cannot send order confirmation: missing buyer email');
    return { success: false, message: 'Missing buyer email' };
  }
  
  const template = emailTemplates.orderConfirmation(order);
  return await sendEmail(order.buyer.email, template);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const template = {
    subject: 'Password Reset Request - EcoMart',
    html: `<h1>Password Reset</h1><p>Hi ${user.name}, click to reset your password.</p>`
  };
  return await sendEmail(user.email, template);
};

const sendProductSoldNotification = async (seller, product, buyer) => {
  const template = {
    subject: 'Your product has been sold!',
    html: `<h1>Product Sold!</h1><p>Hi ${seller.name}, your product "${product.title}" has been sold to ${buyer.name}.</p>`
  };
  return await sendEmail(seller.email, template);
};

const sendChatNotification = async (recipient, sender, product, messagePreview) => {
  const template = {
    subject: 'New message from ' + sender.name + ' - EcoMart',
    html: `<h1>New Message</h1><p>Hi ${recipient.name}, you have a new message about "${product.title}"</p>`
  };
  return await sendEmail(recipient.email, template);
};

const sendBookingConfirmation = async (booking) => {
  if (!booking.renter || !booking.renter.email) {
    console.error('Cannot send booking confirmation: missing renter email');
    return { success: false, message: 'Missing renter email' };
  }

  const template = {
    subject: 'Booking Confirmation - EcoMart',
    html: `<h1>Booking Confirmed!</h1><p>Hi ${booking.renter.name}, your booking has been confirmed.</p>`
  };

  return await sendEmail(booking.renter.email, template);
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail,
  sendProductSoldNotification,
  sendChatNotification,
  sendBookingConfirmation,
  emailTemplates
};