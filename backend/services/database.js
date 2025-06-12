const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://jqdivxayqlpviuouwnrd.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Supabase tables
const createTables = async () => {
    try {
        // Supabase handles table creation through its dashboard
        console.log('Supabase tables should be created through the dashboard');
    } catch (err) {
        console.error('Error initializing Supabase:', err);
    }
};

// Appointment operations
const createAppointment = async (appointmentData) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .insert([{
                pet_name: appointmentData.petName,
                owner_name: appointmentData.ownerName,
                phone_number: appointmentData.phoneNumber,
                email: appointmentData.email,
                service_type: appointmentData.serviceType,
                appointment_date: appointmentData.appointmentDate,
                notes: appointmentData.notes
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        throw err;
    }
};

const getAppointments = async () => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('appointment_date', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (err) {
        throw err;
    }
};

const updateAppointmentStatus = async (id, status) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (err) {
        throw err;
    }
};

// Initialize database
createTables();

module.exports = {
    createTables,
    createAppointment,
    getAppointments,
    updateAppointmentStatus
};
