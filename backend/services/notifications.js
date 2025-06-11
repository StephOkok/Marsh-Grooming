require('dotenv').config();
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendSMS = async (to, message) => {
    try {
        const messageOptions = {
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        };
        
        const response = await twilioClient.messages.create(messageOptions);
        return response;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};

const sendEmail = async (to, subject, text) => {
    try {
        const msg = {
            to: to,
            from: 'petgrooming@example.com',
            subject: subject,
            text: text,
            html: `<p>${text}</p>`
        };
        
        const response = await sgMail.send(msg);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendAppointmentConfirmation = async (appointment) => {
    try {
        // Format the appointment date
        const formattedDate = new Date(appointment.appointmentDate).toLocaleString();
        
        // Create message content
        const message = `Thank you for booking with Pet Grooming!\n\n` +
            `Your appointment for ${appointment.petName} is confirmed on ${formattedDate}.\n` +
            `Service: ${appointment.serviceType}\n` +
            `Status: ${appointment.status}\n\n` +
            'Please arrive 10 minutes before your scheduled time.\n' +
            'Thank you!';

        // Send SMS
        await sendSMS(appointment.phoneNumber, message);
        
        // Send Email
        await sendEmail(
            appointment.email,
            'Appointment Confirmation - Pet Grooming',
            message
        );

        return true;
    } catch (error) {
        console.error('Error sending appointment confirmation:', error);
        throw error;
    }
};

module.exports = {
    sendSMS,
    sendEmail,
    sendAppointmentConfirmation
};
