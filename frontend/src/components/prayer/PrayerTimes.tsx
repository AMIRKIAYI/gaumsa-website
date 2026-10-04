import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise, Sunset, Coffee } from 'lucide-react';
import PageHeader from '../ui/PageHeader';

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const PrayerTimes: React.FC = () => {
  const [times] = useState<PrayerTimes>({
    fajr: '5:00 AM',
    sunrise: '6:30 AM',
    dhuhr: '12:30 PM',
    asr: '3:45 PM',
    maghrib: '6:30 PM',
    isha: '8:00 PM',
  });
  const [nextPrayer, setNextPrayer] = useState('');

  useEffect(() => {
    calculateNextPrayer();
  }, []);

  const calculateNextPrayer = () => {
    const now = new Date();
    const prayers = [
      { name: 'Fajr', time: times.fajr },
      { name: 'Sunrise', time: times.sunrise },
      { name: 'Dhuhr', time: times.dhuhr },
      { name: 'Asr', time: times.asr },
      { name: 'Maghrib', time: times.maghrib },
      { name: 'Isha', time: times.isha },
    ];

    for (const prayer of prayers) {
      const [time, period] = prayer.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let prayerHour = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      if (period === 'AM' && hours === 12) prayerHour = 0;

      const prayerTime = new Date();
      prayerTime.setHours(prayerHour, minutes, 0, 0);

      if (prayerTime > now) {
        setNextPrayer(prayer.name);
        return;
      }
    }
    setNextPrayer('Isha');
  };

  const prayerIcons = [
    { name: 'Fajr', icon: Sun, time: times.fajr },
    { name: 'Sunrise', icon: Sunrise, time: times.sunrise },
    { name: 'Dhuhr', icon: Coffee, time: times.dhuhr },
    { name: 'Asr', icon: Sun, time: times.asr },
    { name: 'Maghrib', icon: Sunset, time: times.maghrib },
    { name: 'Isha', icon: Moon, time: times.isha },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Prayer Times"
        subtitle="Today's prayer schedule"
      />

      {/* Next Prayer Banner */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
        <div className="absolute -top-4 -right-4 text-7xl font-arabic opacity-10 select-none pointer-events-none">
          ﷽
        </div>
        <div className="relative">
          <Clock className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 text-gau-msa-gold" />
          <h3 className="text-sm md:text-base font-semibold">Next Prayer</h3>
          <p className="text-2xl md:text-3xl font-bold mt-1">{nextPrayer}</p>
          <p className="text-xs md:text-sm opacity-80 mt-1">
            Time to prepare for prayer
          </p>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 md:grid-cols-6 bg-gau-msa-primary text-white">
          {prayerIcons.map((prayer) => (
            <div
              key={prayer.name}
              className="p-3 md:p-4 text-center border-r border-white/10 last:border-r-0"
            >
              <prayer.icon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-gau-msa-gold" />
              <span className="text-[10px] md:text-xs font-semibold">
                {prayer.name}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-gray-100">
          {prayerIcons.map((prayer) => (
            <div
              key={prayer.name}
              className="p-3 md:p-4 text-center font-bold text-gau-msa-primary text-xs md:text-sm"
            >
              {prayer.time}
            </div>
          ))}
        </div>
      </div>

      {/* Islamic Quote */}
      <div className="bg-gau-msa-light rounded-2xl p-5 md:p-6 text-center border border-gray-100">
        <p
          className="text-2xl md:text-3xl text-gau-msa-primary"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Scheherazade New", serif' }}
        >
          وَأَقِمِ الصَّلَاةَ لِذِكْرِي
        </p>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          "And establish prayer for My remembrance"
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Surah Taha, Verse 14
        </p>
      </div>
    </div>
  );
};

export default PrayerTimes;