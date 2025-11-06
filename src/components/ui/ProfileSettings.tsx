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
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email (Read-only) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          value={userEmail}
          className="input input-bordered"
          disabled
        />
        <label className="label">
          <span className="label-text-alt">Your email address cannot be changed</span>
        </label>
      </div>

      {/* Display Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Display Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`input input-bordered ${errors.fullName ? 'input-error' : ''}`}
          maxLength={100}
        />
        {errors.fullName && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.fullName}</span>
          </label>
        )}
      </div>

      {/* Username */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          placeholder="Enter a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`input input-bordered ${errors.username ? 'input-error' : ''}`}
          maxLength={30}
        />
        {errors.username && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.username}</span>
          </label>
        )}
      </div>

      {/* Bio */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bio</span>
          <span className="label-text-alt">{bio.length}/500</span>
        </label>
        <textarea
          className={`textarea textarea-bordered h-24 ${errors.bio ? 'textarea-error' : ''}`}
          placeholder="Tell us about yourself"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
        />
        {errors.bio && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.bio}</span>
          </label>
        )}
      </div>

      {/* Profile Visibility */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Public Profile</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
        <label className="label">
          <span className="label-text-alt">Allow others to view your profile</span>
        </label>
      </div>

      {/* Actions */}
      <div className="card-actions justify-end mt-6">
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
