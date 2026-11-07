import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import Input from '../components/common/Input.jsx';
import Textarea from '../components/common/Textarea.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import { User, Mail, Shield, Save } from 'lucide-react';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useNotification();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(user?.bio || 'Full-Stack Developer passionate about clean architectures and databases.');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({ firstName, lastName, bio });
      toast.success('Profile preferences updated successfully!');
    } catch {
      toast.error('Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#27324A]/60">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#A78BFA]" />
          Account Profile & Settings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your personal details, email preferences, and tech stack profile.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#151C31] border border-[#27324A] space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#A78BFA] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#7C5CFC]/25">
            {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{firstName} {lastName}</h3>
            <p className="text-xs text-[#94A3B8]">{user?.email}</p>
            <div className="mt-1.5">
              <Badge variant="purple" size="xs" dot>
                {user?.role || 'student'}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[#27324A]/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Input
            label="Email Address"
            value={user?.email || ''}
            disabled
            helperText="Contact system administration to change verified email."
          />

          <Textarea
            label="Professional Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
