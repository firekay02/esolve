const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if data already exists
    const userCount = await query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 0) {
      console.log('⚠️  Database already contains data. Skipping seed.');
      return;
    }

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const adminResult = await query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, 'admin') 
       RETURNING id`,
      ['Admin User', process.env.ADMIN_EMAIL || 'admin@fixitnow.com', adminPassword]
    );
    console.log('✅ Admin user created');

    // Create sample technicians
    const technicianPassword = await bcrypt.hash('technician123', 12);
    const technicians = [
      { name: 'Sarah Johnson', email: 'sarah@fixitnow.com' },
      { name: 'Mike Chen', email: 'mike@fixitnow.com' },
      { name: 'Emily Rodriguez', email: 'emily@fixitnow.com' },
      { name: 'David Kim', email: 'david@fixitnow.com' }
    ];

    const technicianIds = [];
    for (const tech of technicians) {
      const result = await query(
        `INSERT INTO users (name, email, password_hash, role) 
         VALUES ($1, $2, $3, 'technician') 
         RETURNING id`,
        [tech.name, tech.email, technicianPassword]
      );
      technicianIds.push(result.rows[0].id);
    }
    console.log('✅ Sample technicians created');

    // Create sample customers
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customers = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Wilson', email: 'bob@example.com' },
      { name: 'Alice Brown', email: 'alice@example.com' },
      { name: 'Charlie Davis', email: 'charlie@example.com' }
    ];

    const customerIds = [];
    for (const customer of customers) {
      const result = await query(
        `INSERT INTO users (name, email, password_hash, role) 
         VALUES ($1, $2, $3, 'customer') 
         RETURNING id`,
        [customer.name, customer.email, customerPassword]
      );
      customerIds.push(result.rows[0].id);
    }
    console.log('✅ Sample customers created');

    // Create sample sessions
    const issueTypes = [
      'Computer running slow',
      'Software installation',
      'Virus removal',
      'Network connectivity',
      'Email setup',
      'Data recovery',
      'Printer setup',
      'Operating system update'
    ];

    const statuses = ['pending', 'assigned', 'in_progress', 'completed'];
    const urgencies = ['low', 'medium', 'high', 'urgent'];

    for (let i = 0; i < 20; i++) {
      const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
      const technicianId = Math.random() > 0.3 ? technicianIds[Math.floor(Math.random() * technicianIds.length)] : null;
      const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
      
      // Random date within last 30 days
      const scheduledTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      const sessionResult = await query(
        `INSERT INTO sessions (customer_id, technician_id, issue_type, issue_description, status, urgency, scheduled_time, rating, feedback)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          customerId,
          technicianId,
          issueType,
          `Detailed description for ${issueType.toLowerCase()} issue. Customer needs assistance with resolving this problem.`,
          status,
          urgency,
          scheduledTime,
          status === 'completed' ? Math.floor(Math.random() * 5) + 1 : null,
          status === 'completed' ? 'Great service! The technician was very helpful and resolved my issue quickly.' : null
        ]
      );

      // Create transaction for completed sessions
      if (status === 'completed') {
        const amount = Math.floor(Math.random() * 70) + 30; // $30-$99
        await query(
          `INSERT INTO transactions (user_id, session_id, amount, currency, payment_method, status)
           VALUES ($1, $2, $3, 'USD', 'card', 'completed')`,
          [customerId, sessionResult.rows[0].id, amount]
        );
      }
    }
    console.log('✅ Sample sessions and transactions created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Sample Login Credentials:');
    console.log('Admin: admin@fixitnow.com / admin123');
    console.log('Technician: sarah@fixitnow.com / technician123');
    console.log('Customer: john@example.com / customer123');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = { seedDatabase };