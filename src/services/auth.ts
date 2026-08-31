import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export interface PBUser {
  id: string
  email: string
  name: string
  role?: 'user' | 'admin'
  phone?: string
  emergency_passcode?: string
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
      role: (rec.role as 'user' | 'admin') || 'user',
      phone: rec.phone || '',
      emergency_passcode: rec.emergency_passcode || '',
      avatar: rec.avatar || '',
      created: rec.created,
      updated: rec.updated,
    }
  },

  async login(email: string, password: string): Promise<PBUser> {
    const authData = await pb.collection('users').authWithPassword(email.trim(), password)
    const rec = authData.record
    return {
      id: rec.id,
      email: rec.email,
      name: rec.name || rec.email.split('@')[0],
      role: (rec.role as 'user' | 'admin') || 'user',
      phone: rec.phone || '',
      emergency_passcode: rec.emergency_passcode || '',
      avatar: rec.avatar || '',
    }
  },

  async register(params: {
    email: string
    password: string
    passwordConfirm: string
    name: string
    phone?: string
    role?: 'user' | 'admin'
  }): Promise<PBUser> {
    const rec = await pb.collection('users').create({
      email: params.email.trim(),
      password: params.password,
      passwordConfirm: params.passwordConfirm,
      name: params.name,
      phone: params.phone || '',
      role: params.role || 'user',
    })
    // auto login after registration
    await pb.collection('users').authWithPassword(params.email.trim(), params.password)
    return {
      id: rec.id,
      email: rec.email,
      name: rec.name || rec.email.split('@')[0],
      role: (rec.role as 'user' | 'admin') || 'user',
      phone: rec.phone || '',
      emergency_passcode: rec.emergency_passcode || '',
    }
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    await pb.collection('users').requestPasswordReset(email.trim())
    return true
  },

  async updateProfile(
    id: string,
    data: Partial<{ name: string; phone: string; emergency_passcode: string }>,
  ): Promise<PBUser> {
    const rec = await pb.collection('users').update(id, data)
    return {
      id: rec.id,
      email: rec.email,
      name: rec.name,
      role: rec.role as 'user' | 'admin',
      phone: rec.phone,
      emergency_passcode: rec.emergency_passcode,
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
