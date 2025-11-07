import { useState } from 'react';
import { Button } from './Button';

interface ProfileSettingsProps {
  userEmail: string;
  initialName?: string;
  initialBio?: string;
  initialUsername?: string;
  initialIsPublic?: boolean;
}

export default function ProfileSettings({
  userEmail,
  initialName = '',
  initialBio = '',
  initialUsername = '',
  initialIsPublic = false,
}: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [username, setUsername] = useState(initialUsername);
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    bio?: string;
    username?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (fullName && fullName.length > 100) {
      newErrors.fullName = 'Name is too long (max 100 characters)';
    }

    if (bio && bio.length > 500) {
      newErrors.bio = 'Bio is too long (max 500 characters)';
    }

    if (username) {
      if (username.length < 3 || username.length > 30) {
        newErrors.username = 'Username must be between 3 and 30 characters';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          bio: bio,
          username: username || null,
          is_public: isPublic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to initial values
    setFullName(initialName);
    setBio(initialBio);
    setUsername(initialUsername);
    setIsPublic(initialIsPublic);
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Email (Read-only) */}
      <div className="form-control">
        <label className="form-label">
          Email
        </label>
        <input
          type="email"
          value={userEmail}
          className="form-input opacity-60 cursor-not-allowed"
          disabled
        />
        <div className="form-hint mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Your email address cannot be changed</span>
        </div>
      </div>

      {/* Display Name */}
      <div className="form-control">
        <label className="form-label">
          Display Name
          <span className="form-label-optional">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`form-input ${errors.fullName ? 'error' : ''}`}
          maxLength={100}
        />
        {errors.fullName && (
          <div className="error-message mt-2">
            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.fullName}</span>
          </div>
        )}
      </div>

      {/* Username */}
      <div className="form-control">
        <label className="form-label">
          Username
          <span className="form-label-optional">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Enter a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`form-input ${errors.username ? 'error' : ''}`}
          maxLength={30}
        />
        {errors.username && (
          <div className="error-message mt-2">
            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.username}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="form-control">
        <div className="flex justify-between items-center mb-2">
          <label className="form-label mb-0">
            Bio
            <span className="form-label-optional">(optional)</span>
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{bio.length}/500</span>
        </div>
        <textarea
          className={`form-textarea h-24 ${errors.bio ? 'error' : ''}`}
          placeholder="Tell us about yourself"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
        />
        {errors.bio && (
          <div className="error-message mt-2">
            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.bio}</span>
          </div>
        )}
      </div>

      {/* Profile Visibility */}
      <div className="form-control">
        <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors">
          <div>
            <div className="form-label mb-1">Public Profile</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Allow others to view your profile</div>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-2 focus:ring-primary/20"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="form-actions mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          loadingText="Saving..."
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
