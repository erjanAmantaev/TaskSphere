import api from './api';

interface AccountInfo {
  username: string;
  email: string;
  account_created: string;
  theme: string;
  language: string;
  is_2fa_enabled: boolean;
  profile_picture: string | null;
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface ChangeUsernameData {
  new_username: string;
}

interface ChangeEmailData {
  new_email: string;
  password: string;
}

interface PreferencesData {
  theme?: string;
  language?: string;
}

interface DeleteAccountData {
  password: string;
}

export const settingsService = {
  getAccountInfo: async (): Promise<AccountInfo> => {
    const response = await api.get('/users/settings/account/');
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<any> => {
    const response = await api.post('/users/settings/change-password/', data);
    return response.data;
  },

  changeUsername: async (data: ChangeUsernameData): Promise<any> => {
    const response = await api.post('/users/settings/change-username/', data);
    return response.data;
  },

  changeEmail: async (data: ChangeEmailData): Promise<any> => {
    const response = await api.post('/users/settings/change-email/', data);
    return response.data;
  },

  updatePreferences: async (data: PreferencesData): Promise<any> => {
    const response = await api.patch('/users/settings/preferences/', data);
    return response.data;
  },

  uploadProfilePicture: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    const response = await api.post('/users/settings/profile-picture/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProfilePicture: async (): Promise<any> => {
    const response = await api.delete('/users/settings/profile-picture/delete/');
    return response.data;
  },

  deleteAccount: async (data: DeleteAccountData): Promise<any> => {
    const response = await api.post('/users/settings/delete-account/', data);
    return response.data;
  },
};
