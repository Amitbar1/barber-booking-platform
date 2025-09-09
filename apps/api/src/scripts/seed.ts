import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create salons
  const salon1 = await prisma.salon.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'מספרת אליהו',
      description: 'מספרה מקצועית עם שירותים מתקדמים',
      address: 'רחוב הרצל 15, תל אביב',
      phone: '03-1234567',
      email: 'info@eliyahu-barber.co.il',
      images: [
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'
      ],
      workingHours: {
        monday: { start: '09:00', end: '19:00' },
        tuesday: { start: '09:00', end: '19:00' },
        wednesday: { start: '09:00', end: '19:00' },
        thursday: { start: '09:00', end: '19:00' },
        friday: { start: '09:00', end: '15:00' },
        saturday: { start: '10:00', end: '16:00' },
        sunday: { start: '10:00', end: '16:00' }
      },
      isActive: true
    }
  })

  const salon2 = await prisma.salon.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'מספרת דוד',
      description: 'מספרה קלאסית עם אווירה חמימה',
      address: 'רחוב דיזנגוף 45, תל אביב',
      phone: '03-7654321',
      email: 'info@david-barber.co.il',
      images: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'
      ],
      workingHours: {
        monday: { start: '08:00', end: '20:00' },
        tuesday: { start: '08:00', end: '20:00' },
        wednesday: { start: '08:00', end: '20:00' },
        thursday: { start: '08:00', end: '20:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '09:00', end: '17:00' },
        sunday: { start: '09:00', end: '17:00' }
      },
      isActive: true
    }
  })

  // Create services
  const service1 = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'תספורת גברית',
      description: 'תספורת מקצועית לגברים',
      duration: 30,
      price: 80,
      salonId: salon1.id,
      isActive: true
    }
  })

  const service2 = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'תספורת + זקן',
      description: 'תספורת + עיצוב זקן',
      duration: 45,
      price: 120,
      salonId: salon1.id,
      isActive: true
    }
  })

  await prisma.service.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'תספורת קלאסית',
      description: 'תספורת קלאסית מסורתית',
      duration: 25,
      price: 70,
      salonId: salon2.id,
      isActive: true
    }
  })

  // Create sample bookings
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
  dayAfterTomorrow.setHours(14, 30, 0, 0)

  await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      dateTime: tomorrow,
      status: 'CONFIRMED',
      customerName: 'יוסי כהן',
      customerPhone: '+972501234567',
      customerEmail: 'yossi@example.com',
      notes: 'תספורת קצרה',
      salonId: salon1.id,
      serviceId: service1.id
    }
  })

  await prisma.booking.upsert({
    where: { id: 2 },
    update: {},
    create: {
      dateTime: dayAfterTomorrow,
      status: 'CONFIRMED',
      customerName: 'דני לוי',
      customerPhone: '+972509876543',
      customerEmail: 'danny@example.com',
      notes: 'תספורת + זקן',
      salonId: salon1.id,
      serviceId: service2.id
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created ${salon1.name} and ${salon2.name}`)
  console.log(`🔧 Created 3 services`)
  console.log(`📅 Created 2 sample bookings`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
