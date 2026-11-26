import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    batch: '3P14',
    customBatch: '',
    department: 'Computer Science & Engineering'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim().toLowerCase().endsWith('@thapar.edu')) {
      return setError('Registration is restricted to official @thapar.edu institutional email addresses.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    const effectiveBatch = formData.role === 'STUDENT'
      ? (formData.batch === 'OTHER' ? (formData.customBatch?.trim() || '3P14') : formData.batch)
      : '';

    setLoading(true);
    const res = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      batch: effectiveBatch,
      department: formData.department
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-thapar-600 to-thapar-500 text-white flex items-center justify-center shadow-lg shadow-thapar-500/25 group-hover:scale-105 transition-transform">
            <School className="w-6 h-6" />
          </div>
        </Link>
        
        <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Your Account
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Join the Thapar Classroom Availability Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-8 shadow-xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Rajesh Sharma"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-thapar-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. 1024160126@thapar.edu or faculty@thapar.edu"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-thapar-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-thapar-500 transition-colors"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY_ORGANISATION">Faculty / Organisation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Department / Branch
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. CSED, COE, ECE"
                  className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-thapar-500 transition-colors"
                />
              </div>
            </div>

            {/* Student Batch Selection - Identity for Teacher Broadcasts */}
            {formData.role === 'STUDENT' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                    Select Your Academic Batch
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    Required for Broadcasts
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-darkcard border border-emerald-200 dark:border-emerald-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="3P14">3P14 (CSE Group 14)</option>
                    <option value="3CO1">3CO1 (COE Group 1)</option>
                    <option value="3CO2">3CO2 (COE Group 2)</option>
                    <option value="3CO3">3CO3 (COE Group 3)</option>
                    <option value="3CO4">3CO4 (COE Group 4)</option>
                    <option value="3CO5">3CO5 (COE Group 5)</option>
                    <option value="3CO6">3CO6 (COE Group 6)</option>
                    <option value="3ENC1">3ENC1 (ENC Group 1)</option>
                    <option value="OTHER">Custom / Other Batch</option>
                  </select>

                  {formData.batch === 'OTHER' ? (
                    <input
                      type="text"
                      name="customBatch"
                      required
                      value={formData.customBatch}
                      onChange={handleChange}
                      placeholder="Type batch e.g. 3P15"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-darkcard border border-emerald-200 dark:border-emerald-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    />
                  ) : (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 self-center">
                      Assigned to <strong>Batch {formData.batch}</strong> for schedule & teacher pings.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-thapar-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-thapar-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-thapar-600 hover:bg-thapar-700 text-white font-extrabold text-xs shadow-lg shadow-thapar-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
              <UserPlus className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-thapar-600 dark:text-thapar-400 hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
