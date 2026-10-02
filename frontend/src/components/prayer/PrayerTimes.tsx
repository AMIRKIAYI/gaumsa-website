import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise, Sunset, Coffee } from 'lucide-react';

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const PrayerTimes: React.FC = () => {
  const [times, setTimes] = useState<PrayerTimes>({
    fajr: '5:00 AM',
    sunrise: '6:30 AM',
    dhuhr: '12:30 PM',
    asr: '3:45 PM',
    maghrib: '6:30 PM',
    isha: '8:00 PM',
  });
  const [nextPrayer, setNextPrayer] = useState('');

  useEffect(() => {
    // You can connect to a real API here
    // Example: fetchPrayerTimes('Garissa').then(data => setTimes(data));
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

    // Find next prayer
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
    { name: 'Fajr', icon: Sun },
    { name: 'Sunrise', icon: Sunrise },
    { name: 'Dhuhr', icon: Coffee },
    { name: 'Asr', icon: Sun },
    { name: 'Maghrib', icon: Sunset },
    { name: 'Isha', icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Next Prayer Banner */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white text-center">
        <Clock className="h-12 w-12 mx-auto mb-2 text-gau-msa-gold" />
        <h3 className="text-lg font-semibold">Next Prayer</h3>
        <p className="text-3xl font-bold mt-2">{nextPrayer}</p>
        <p className="text-sm opacity-80 mt-1">Time to prepare for prayer</p>
      </div>

      {/* Prayer Times Grid */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-6 bg-gau-msa-primary text-white">
          {prayerIcons.map((prayer) => (
            <div key={prayer.name} className="p-4 text-center">
              <prayer.icon className="h-6 w-6 mx-auto mb-1 text-gau-msa-gold" />
              <span className="text-xs font-semibold">{prayer.name}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-gray-200">
          <div className="p-4 text-center font-bold text-gau-msa-primary">{times.fajr}</div>
          <div className="p-4 text-center font-bold text-gau-msa-primary">{times.sunrise}</div>
          <div className="p-4 text-center font-bold text-gau-msa-primary">{times.dhuhr}</div>
          <div className="p-4 text-center font-bold text-gau-msa-primary">{times.asr}</div>
          <div className="p-4 text-center font-bold text-gau-msa-primary">{times.maghrib}</div>
          <div className="p-4 text-center font-bold text-gau-msa-primary">{times.isha}</div>
        </div>
      </div>

      {/* Islamic Quote */}
      <div className="bg-gau-msa-light rounded-2xl p-6 text-center">
        <p className="font-arabic text-2xl text-gau-msa-primary">
          وَأَقِمِ الصَّلَاةَ لِذِكْرِي
        </p>
        <p className="text-gray-600 mt-2">"And establish prayer for My remembrance"</p>
        <p className="text-sm text-gray-500 mt-1">Surah Taha, Verse 14</p>
      </div>
    </div>
  );
};

export default PrayerTimes;