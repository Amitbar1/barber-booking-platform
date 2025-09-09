import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Calendar, 
  Star, 
  Users, 
  Scissors, 
  Shield,
  Search,
  MapPin,
  Filter,
  Plus
} from 'lucide-react'
import Header from '../components/Header'
import Logo from '../components/Logo'
import BusinessRegistrationForm from '../components/BusinessRegistrationForm'

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [showBusinessRegistration, setShowBusinessRegistration] = useState(false)

  // Mock salons data
  const nearbySalons = [
    {
      id: '1',
      name: 'מספרת דוד',
      address: 'רחוב הרצל 15, תל אביב',
      distance: '0.5 ק"מ',
      rating: 4.8,
      reviewCount: 127,
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
      services: ['תספורת', 'זקן', 'חבילה']
    },
    {
      id: '2',
      name: 'סטייליסט',
      address: 'רחוב דיזנגוף 25, תל אביב',
      distance: '1.2 ק"מ',
      rating: 4.6,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
      services: ['תספורת', 'טיפוח']
    },
    {
      id: '3',
      name: 'מספרת יוסי',
      address: 'רחוב אלנבי 8, תל אביב',
      distance: '0.8 ק"מ',
      rating: 4.9,
      reviewCount: 203,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
      services: ['זקן', 'חבילה']
    }
  ]

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "ניהול תורים מתקדם",
      description: "לוח זמנים דיגיטלי עם תצוגות חודשיות, שבועיות ויומיות"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "ניהול לקוחות חכם",
      description: "מערכת ניהול לקוחות עם היסטוריה מלאה והעדפות אישיות"
    },
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "שירותים מותאמים",
      description: "ניהול שירותים עם תמונות, מחירים ומשך זמן מדויק"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "אבטחה מתקדמת",
      description: "הגנה מלאה על נתוני הלקוחות והעסק"
    }
  ]

  const testimonials = [
    {
      name: "דוד כהן",
      salon: "מספרת דוד",
      rating: 5,
      text: "הפלטפורמה שינתה את העסק שלי לחלוטין. התורים מסודרים והלקוחות מרוצים!"
    },
    {
      name: "מיכאל לוי",
      salon: "סטייליסט",
      rating: 5,
      text: "מערכת פשוטה ואינטואיטיבית. המלצה חמה לכל בעל מספרה!"
    },
    {
      name: "יוסי ישראלי",
      salon: "מספרת יוסי",
      rating: 5,
      text: "הלקוחות שלי אוהבים את האפשרות להזמין תור אונליין. זה חוסך המון זמן!"
    }
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-text block">מצא מספרה קרובה</span>
              <span className="text-text block">או פתח מספרה חדשה</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted mb-6 sm:mb-8 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              חיפוש מספרות קרובות אליך או הרשמה לפתיחת מספרה חדשה עם פלטפורמת ניהול מתקדמת
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-surface border border-border rounded-2xl shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-text mb-6 text-center">חפש מספרה קרובה</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text mb-2">חיפוש</label>
                  <div className="relative">
                    <Search className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                    <input
                      type="text"
                      placeholder="שם המספרה או שירות..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text mb-2">מיקום</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                    <input
                      type="text"
                      placeholder="עיר או כתובת..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-primary text-onPrimary rounded-xl px-6 py-3 text-base font-medium hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center">
                  <Search className="w-5 h-5 ml-2 rtl:mr-2" />
                  חפש מספרות
                </button>
                <button className="flex-1 border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-onPrimary rounded-xl px-6 py-3 text-base font-medium transition-all duration-300 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center">
                  <Filter className="w-5 h-5 ml-2 rtl:mr-2" />
                  סינון מתקדם
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nearby Salons */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            מספרות קרובות אליך
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {nearbySalons.map((salon, index) => (
              <motion.div
                key={salon.id}
                className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => window.location.href = `/salon/${salon.id}`}
              >
                <div className="relative mb-4">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 rtl:left-2 bg-primary text-onPrimary px-2 py-1 rounded text-xs font-semibold">
                    {salon.distance}
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-text">{salon.name}</h3>
                <p className="text-sm text-muted mb-3 flex items-center">
                  <MapPin className="w-4 h-4 ml-1 rtl:mr-1" />
                  {salon.address}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-primary fill-current ml-1 rtl:mr-1" />
                    <span className="text-sm font-semibold text-text">{salon.rating}</span>
                    <span className="text-xs text-muted mr-2 rtl:ml-2">({salon.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {salon.services.map((service) => (
                    <span 
                      key={service}
                      className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                
                <button className="w-full bg-primary text-onPrimary py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  הזמן תור
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Registration CTA */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-text">
              בעל מספרה? פתח מספרה חדשה!
            </h2>
            <p className="text-lg text-muted mb-6 px-4">
              הצטרף לפלטפורמה שלנו וקבל כלי ניהול מתקדמים למספרה שלך
            </p>
            <button 
              className="bg-primary text-onPrimary rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center mx-auto"
              onClick={() => setShowBusinessRegistration(true)}
            >
              <Plus className="w-5 h-5 ml-2 rtl:mr-2" />
              פתח מספרה חדשה
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-text">תכונות מתקדמות</h2>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto px-4">
              כל מה שאתה צריך כדי לנהל את המספרה שלך בצורה מקצועית ויעילה
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-text">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-text">מה אומרים הלקוחות שלנו</h2>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto px-4">
              אלפי בעלי מספרות כבר בחרו בפלטפורמה שלנו
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-current ml-1 rtl:mr-1" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-text text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-muted text-xs sm:text-sm">{testimonial.salon}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-text">
              מוכן להתחיל?
            </h2>
            <p className="text-lg sm:text-xl text-muted mb-6 sm:mb-8 px-4">
              הצטרף לאלפי בעלי מספרות שכבר מנהלים את העסק שלהם בצורה מקצועית
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="w-full sm:w-auto bg-primary text-onPrimary rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover:opacity-90 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center">
                התחל חינם עכשיו
              </button>
              <button className="w-full sm:w-auto border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-onPrimary rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 focus:ring-2 focus:ring-primary/50 min-h-[44px] flex items-center justify-center">
                דבר איתנו
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Registration Modal */}
      {showBusinessRegistration && (
        <BusinessRegistrationForm
          onClose={() => setShowBusinessRegistration(false)}
          onSuccess={(businessData) => {
            console.log('Business registration successful:', businessData)
            setShowBusinessRegistration(false)
            // Here you would typically redirect to admin dashboard or show success message
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Logo size="md" className="text-primary" />
              <span className="text-lg sm:text-xl font-bold text-text">Padel Pro Israel</span>
            </div>
            <p className="text-sm sm:text-base text-muted text-center sm:text-right">
              © 2024 Padel Pro Israel. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
