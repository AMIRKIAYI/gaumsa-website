import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import {
  AlertCircle,
  Hash,
  BookOpen,
  GraduationCap,
  Phone,
  Loader2,
  User,
  Shield,
} from 'lucide-react';

interface ProfileCompletionModalProps {
  onComplete: () => void;
}

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Business Administration',
  'Education',
  'Islamic Studies',
  'Economics',
  'Finance and Accounting',
  'Communication Studies',
  'Journalism and Media',
  'Graphic Design',
  'Event Management',
  'Project Management',
  'Islamic Law',
  'Islamic Theology',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate Student'];

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  onComplete,
}) => {
  const { user, token, setUser } = useAuth();
  const [formData, setFormData] = useState({
    reg_no: user?.reg_no || '',
    department: user?.department || '',
    year_of_study: user?.year_of_study || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.updateProfile(token!, formData);

      if (res.success) {
        // Update the user in context
        if (setUser && user) {
          setUser({
            ...user,
            reg_no: formData.reg_no,
            department: formData.department,
            year_of_study: formData.year_of_study,
            phone: formData.phone,
            profile_completed: true,
          });
        }
        onComplete();
      } else {
        setError(res.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white p-4 md:p-6 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                Complete Your Profile
              </h2>
              <p className="text-xs md:text-sm text-amber-100 mt-0.5">
                Required to continue using GAUMSA
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start space-x-2">
            <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Welcome, <strong>{user?.full_name}</strong>! Before you can use
              GAUMSA, we need a few more details so the registrar can verify
              your membership.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            {/* Reg No */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Registration Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="reg_no"
                  required
                  value={formData.reg_no}
                  onChange={handleChange}
                  placeholder="E101/702/23"
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                Your university registration number
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="">Select your department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Year of Study *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <select
                  name="year_of_study"
                  required
                  value={formData.year_of_study}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="">Select year of study</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712345678"
                  inputMode="tel"
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white py-3 md:py-3.5 rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  <span>Complete Profile</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;