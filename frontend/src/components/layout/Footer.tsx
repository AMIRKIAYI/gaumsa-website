import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaYoutube,
  FaPaperPlane, FaHeart, FaBook, FaUsers,
  FaCalendarAlt, FaHome, FaUser
} from 'react-icons/fa';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Dashboard', path: '/profile/dashboard', icon: FaUser },
    { name: 'Activities', path: '/activities', icon: FaCalendarAlt },
    { name: 'Leadership', path: '/leadership', icon: FaUsers },
    { name: 'Quran', path: '/quran', icon: FaBook },
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: 'Garissa University, Garissa, Kenya' },
    { icon: FaPhone, text: '+254 700 000 000' },
    { icon: FaEnvelope, text: 'gaumsa@garissauniversity.ac.ke' },
    { icon: FaClock, text: 'Mon - Fri: 9:00 AM - 5:00 PM' },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-[#1877f2]' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-[#1da1f2]' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-[#e4405f]' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:text-[#ff0000]' },
  ];

  return (
    <footer className="bg-gau-msa-primary text-white">
      {/* Main Footer */}
      <div className="container-custom pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Logo size="md" showText={true} className="mb-4" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Garissa University Muslim Student Association - Uniting Muslim students 
              in faith, knowledge, and community service.
            </p>
            <div className="flex items-center space-x-2 text-gau-msa-gold">
              <FaHeart className="h-4 w-4" />
              <span className="text-sm">Serving the community since 2020</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gau-msa-gold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-gau-msa-gold transition-colors duration-200 flex items-center space-x-2 text-sm group"
                  >
                    <link.icon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gau-msa-gold">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-300 text-sm">
                  <item.icon className="h-4 w-4 text-gau-msa-gold mt-0.5 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gau-msa-gold">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get updates on activities and events.
            </p>
            
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-white/10 border border-gau-msa-secondary/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gau-msa-gold text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gau-msa-gold text-gau-msa-primary rounded-r-lg hover:opacity-90 transition duration-300 flex items-center"
                >
                  <FaPaperPlane className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Social Links */}
            <div className="flex space-x-3 mt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gau-msa-secondary/30 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>© {currentYear} GAUMSA. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-gau-msa-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gau-msa-gold transition-colors">Terms of Service</a>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span>Made with</span>
            <FaHeart className="h-3.5 w-3.5 text-gau-msa-gold animate-pulse" />
            <span>for the GAUMSA community</span>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="mt-6 text-center">
          <p className="font-arabic text-lg text-gau-msa-gold">
            وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ
          </p>
          <p className="text-xs text-gray-400 mt-1">
            "And who is better in speech than one who invites to Allah"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;