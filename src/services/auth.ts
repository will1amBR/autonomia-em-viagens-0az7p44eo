import pb from '@/lib/pocketbase/client'

export interface PBUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'police'
  phone?: string
  emergency_passcode?: string
  duressMethod?: 'hold_3s' | 'volume_key' | 'secret_code'
  duressSecretCode?: string
  lastOnlineAt?: string
  lastLocationApprox?: string
  avatar?: string
  created?: string
  updated?: string
}

export const authService = {
  getCurrentUser(): PBUser | null {
    if (!pb.authStore.isValid || !pb.authStore.record) {
      return null
    }
    const rec = pb.authStore.record
    return {
      id: rec.id,
      email: rec.email,
      name: rec.name || rec.email.split('@')[0],
      role: (rec.role as 'user' | 'admin' | 'police') || 'user',
      phone: rec.phone,
      emergency_passcode: rec.emergency_passcode,
      duressMethod: (rec.duress_method as any) || 'volume_key',
      duressSecretCode: rec.duress_secret_code || '',
      lastOnlineAt: rec.last_online_at || '',
      lastLocationApprox: rec.last_location_approx || '',
      avatar: rec.avatar || '',
      created: rec.created,
      updated: rec.updated,
    }
  },

  async login(email: string, password: string): Promise<PBUser> {
    const authData = await pb.collection('users').authWithPassword(email.trim(), password)
    const rec = authData.record

    // Asynchronously log presence and update last_online_at
    try {
      const now = new Date().toISOString()
      pb.collection('presence_logs').create({
        user_id: rec.id,
        event_type: 'login',
        timestamp: now,
        device_info: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 120) : '',
      }).catch(() => {})
      pb.collection('users').update(rec.id, {
        last_online_at: now,
      }).catch(() => {})
    } catch { /* intentionally ignored */ }

    return {
      id: rec.id,
      email: rec.email,
      name: rec.name || rec.email.split('@')[0],
      role: (rec.role as 'user' | 'admin' | 'police') || 'user',
      phone: rec.phone || '',
      emergency_passcode: rec.emergency_passcode || '',
      duressMethod: (rec.duress_method as any) || 'volume_key',
      duressSecretCode: rec.duress_secret_code || '',
      lastOnlineAt: rec.last_online_at || '',
      lastLocationApprox: rec.last_location_approx || '',
      avatar: rec.avatar || '',
      created: rec.created,
      updated: rec.updated,
    }
  },

  async register(params: {
    email: string
    password: string
    passwordConfirm: string
    name: string
    phone?: string
    role?: 'user' | 'admin' | 'police'
    duress_method?: string
    duress_secret_code?: string
  }): Promise<PBUser> {
    const rec = await pb.collection('users').create({
      email: params.email.trim(),
      password: params.password,
      passwordConfirm: params.passwordConfirm,
      name: params.name,
      phone: params.phone || '',
      role: params.role || 'user',
      duress_method: params.duress_method || 'volume_key',
      duress_secret_code: params.duress_secret_code || '',
    })
    // Auto login after registration
    await pb.collection('users').authWithPassword(params.email.trim(), params.password)
    return {
      id: rec.id,
      email: rec.email,
      name: rec.name || rec.email.split('@')[0],
      role: (rec.role as 'user' | 'admin' | 'police') || 'user',
      phone: rec.phone || '',
      emergency_passcode: rec.emergency_passcode || '',
      duressMethod: (rec.duress_method as any) || 'volume_key',
      duressSecretCode: rec.duress_secret_code || '',
      avatar: rec.avatar || '',
      created: rec.created,
      updated: rec.updated,
    }
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    await pb.collection('users').requestPasswordReset(email.trim())
    return true
  },

  async updateProfile(
    id: string,
    data: Partial<{
      name: string
      phone: string
      emergency_passcode: string
      duress_method?: string
      duress_secret_code?: string
      last_online_at?: string
      last_location_approx?: string
    }>,
  ): Promise<PBUser> {
    const rec = await pb.collection('users').update(id, data)
    return {
      id: rec.id,
      email: rec.email,
      name: rec.name,
      role: (rec.role as 'user' | 'admin' | 'police') || 'user',
      phone: rec.phone,
      emergency_passcode: rec.emergency_passcode,
      duressMethod: (rec.duress_method as any) || 'volume_key',
      duressSecretCode: rec.duress_secret_code || '',
      lastOnlineAt: rec.last_online_at || '',
      lastLocationApprox: rec.last_location_approx || '',
      avatar: rec.avatar || '',
      created: rec.created,
      updated: rec.updated,
    }
  },

  async changePassword(
    id: string,
    oldPassword: string,
    password: string,
    passwordConfirm: string,
  ): Promise<boolean> {
    await pb.collection('users').update(id, {
      oldPassword,
      password,
      passwordConfirm,
    })
    return true
  },

  async deleteAccount(id: string): Promise<boolean> {
    await pb.collection('users').delete(id)
    pb.authStore.clear()
    return true
  },

  logout() {
    pb.authStore.clear()
  },
}
