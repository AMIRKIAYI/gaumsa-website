import type { Leader } from '../types';

// Helper function to generate avatar URL with different colors
const getAvatarUrl = (name: string, id: string) => {
  const colors = [
    '1a472a', '2d6a4f', '52b788', 'd4a373', 
    '0d2818', '40916c', '74c69d', 'b7e4c7',
    '1a472a', '2d6a4f', '52b788', 'd4a373',
    '0d2818', '40916c'
  ];
  const colorIndex = parseInt(id) % colors.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex]}&color=fff&size=128&font-size=0.5&bold=true`;
};

export const leaders: Leader[] = [
  // Executive Committee
  {
    id: '1',
    name: 'Dr. Ahmed Hassan',
    position: 'Chairman',
    positionArabic: 'الرئيس',
    description: 'Overall leadership and strategic direction of GAUMSA. Oversees all activities and represents the association.',
    email: 'chairman@gaumsa.org',
    phone: '+254 700 000 001',
    year: '4th Year',
    department: 'Islamic Studies',
    quote: 'Leadership is not about being in charge. It is about taking care of those in your charge.',
    image: getAvatarUrl('Dr. Ahmed Hassan', '1'),
    order: 1
  },
  {
    id: '2',
    name: 'Sr. Fatima Abdullah',
    position: 'Chairlady',
    positionArabic: 'نائبة الرئيس',
    description: 'Assists the Chairman and leads initiatives focused on sisters\' welfare and participation.',
    email: 'chairlady@gaumsa.org',
    phone: '+254 700 000 002',
    year: '4th Year',
    department: 'Education',
    quote: 'The best of leaders are those who serve with humility and wisdom.',
    image: getAvatarUrl('Sr. Fatima Abdullah', '2'),
    order: 2
  },
  {
    id: '3',
    name: 'Br. Omar Faruq',
    position: 'Vice Chairman',
    positionArabic: 'نائب الرئيس',
    description: 'Supports the Chairman and oversees daily operations. Coordinates between different departments.',
    email: 'vicechairman@gaumsa.org',
    phone: '+254 700 000 003',
    year: '3rd Year',
    department: 'Business Administration',
    quote: 'Great leaders don\'t create followers, they create more leaders.',
    image: getAvatarUrl('Br. Omar Faruq', '3'),
    order: 3
  },

  // Secretariat
  {
    id: '4',
    name: 'Br. Khalid Abdulrahman',
    position: 'Secretary',
    positionArabic: 'السكرتير',
    description: 'Manages all official correspondence, meeting minutes, and documentation. Maintains records of all activities.',
    email: 'secretary@gaumsa.org',
    phone: '+254 700 000 004',
    year: '3rd Year',
    department: 'Information Technology',
    quote: 'The pen is mightier than the sword when it comes to preserving our legacy.',
    image: getAvatarUrl('Br. Khalid Abdulrahman', '4'),
    order: 4
  },
  {
    id: '5',
    name: 'Sr. Aisha Mohamed',
    position: 'Vice Secretary',
    positionArabic: 'نائبة السكرتير',
    description: 'Assists the Secretary and handles communication with external organizations.',
    email: 'vicsecretary@gaumsa.org',
    phone: '+254 700 000 005',
    year: '2nd Year',
    department: 'Communication Studies',
    quote: 'Clear communication is the bridge between confusion and clarity.',
    image: getAvatarUrl('Sr. Aisha Mohamed', '5'),
    order: 5
  },

  // Treasury
  {
    id: '6',
    name: 'Br. Yusuf Ibrahim',
    position: 'Treasurer',
    positionArabic: 'أمين الصندوق',
    description: 'Manages all financial matters including budgets, fundraising, and financial reporting.',
    email: 'treasurer@gaumsa.org',
    phone: '+254 700 000 006',
    year: '4th Year',
    department: 'Finance and Accounting',
    quote: 'Financial integrity is a trust from Allah that must be upheld.',
    image: getAvatarUrl('Br. Yusuf Ibrahim', '6'),
    order: 6
  },
  {
    id: '7',
    name: 'Sr. Maryam Ali',
    position: 'Vice Treasurer',
    positionArabic: 'نائبة أمين الصندوق',
    description: 'Assists the Treasurer and oversees financial record-keeping and audits.',
    email: 'victreasurer@gaumsa.org',
    phone: '+254 700 000 007',
    year: '3rd Year',
    department: 'Economics',
    quote: 'Wealth is a blessing, and managing it with honesty is a responsibility.',
    image: getAvatarUrl('Sr. Maryam Ali', '7'),
    order: 7
  },

  // Organizing Committee
  {
    id: '8',
    name: 'Br. Musa Omar',
    position: 'Organizer',
    positionArabic: 'منظم الفعاليات',
    description: 'Plans and coordinates all GAUMSA events, programs, and activities.',
    email: 'organizer@gaumsa.org',
    phone: '+254 700 000 008',
    year: '3rd Year',
    department: 'Event Management',
    quote: 'Excellence in organizing is about creating experiences that inspire.',
    image: getAvatarUrl('Br. Musa Omar', '8'),
    order: 8
  },
  {
    id: '9',
    name: 'Sr. Khadija Hassan',
    position: 'Vice Organizer',
    positionArabic: 'نائبة منظم الفعاليات',
    description: 'Assists the Organizer and manages logistics for all events.',
    email: 'vicorganizer@gaumsa.org',
    phone: '+254 700 000 009',
    year: '2nd Year',
    department: 'Project Management',
    quote: 'Behind every successful event is a team that cares about every detail.',
    image: getAvatarUrl('Sr. Khadija Hassan', '9'),
    order: 9
  },

  // Religious Leadership
  {
    id: '10',
    name: 'Sheikh Muhammad Hassan',
    position: 'Imam',
    positionArabic: 'الإمام',
    description: 'Leads prayers, delivers Friday sermons, and provides spiritual guidance to the community.',
    email: 'imam@gaumsa.org',
    phone: '+254 700 000 010',
    year: 'Graduate Student',
    department: 'Islamic Theology',
    quote: 'The Imam is a shepherd, and every shepherd will be questioned about his flock.',
    image: getAvatarUrl('Sheikh Muhammad Hassan', '10'),
    order: 10
  },
  {
    id: '11',
    name: 'Br. Abdullah Yusuf',
    position: 'Assistant Imam',
    positionArabic: 'مساعد الإمام',
    description: 'Assists the Imam in leading prayers and teaching Islamic studies.',
    email: 'assistantimam@gaumsa.org',
    phone: '+254 700 000 011',
    year: '4th Year',
    department: 'Islamic Law',
    quote: 'Knowledge without action is like a tree without fruit.',
    image: getAvatarUrl('Br. Abdullah Yusuf', '11'),
    order: 11
  },

  // Media & Communications
  {
    id: '12',
    name: 'Br. Ibrahim Khalil',
    position: 'Media Officer',
    positionArabic: 'مسؤول الإعلام',
    description: 'Manages all media content, social media presence, and public communications.',
    email: 'media@gaumsa.org',
    phone: '+254 700 000 012',
    year: '3rd Year',
    department: 'Journalism and Media',
    quote: 'Media is not just about information; it\'s about inspiration.',
    image: getAvatarUrl('Br. Ibrahim Khalil', '12'),
    order: 12
  },
  {
    id: '13',
    name: 'Sr. Zainab Ahmed',
    position: 'Assistant Media Officer',
    positionArabic: 'مساعد مسؤول الإعلام',
    description: 'Assists the Media Officer in content creation and digital outreach.',
    email: 'assistantmedia@gaumsa.org',
    phone: '+254 700 000 013',
    year: '2nd Year',
    department: 'Graphic Design',
    quote: 'Creativity is the language of the soul, and media is its canvas.',
    image: getAvatarUrl('Sr. Zainab Ahmed', '13'),
    order: 13
  },
  {
    id: '14',
    name: 'Br. Hamza Ali',
    position: 'Muadheen',
    positionArabic: 'المؤذن',
    description: 'Responsible for the call to prayer (Adhan) and coordinating prayer times.',
    email: 'muadheen@gaumsa.org',
    phone: '+254 700 000 014',
    year: '2nd Year',
    department: 'Islamic Studies',
    quote: 'The Adhan is not just a call to prayer; it is a call to the heart.',
    image: getAvatarUrl('Br. Hamza Ali', '14'),
    order: 14
  }
];

export const leadershipPositions = [
  { category: 'Executive Committee', positions: ['Chairman', 'Chairlady', 'Vice Chairman'] },
  { category: 'Secretariat', positions: ['Secretary', 'Vice Secretary'] },
  { category: 'Treasury', positions: ['Treasurer', 'Vice Treasurer'] },
  { category: 'Organizing Committee', positions: ['Organizer', 'Vice Organizer'] },
  { category: 'Religious Leadership', positions: ['Imam', 'Assistant Imam', 'Muadheen'] },
  { category: 'Media & Communications', positions: ['Media Officer', 'Assistant Media Officer'] }
];