import { apolloClient } from '@/lib/graphql/apollo';
import type { LoginInput, RegisterInput, User } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { REGISTER_MUTATION } from "@/lib/graphql/mutations/Register"
import { LOGIN_MUTATION } from "@/lib/graphql/mutations/Login"

type RegisterMutationData ={
    register: {
        token: string
        refreshToken: string
        user: User
    }
}

type LoginMutationData = {
    login: {
        token: string
        refreshToken: string
        user: User
    }
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (data: LoginInput) => Promise<boolean>
    register: (data: RegisterInput) => Promise<boolean>
    logout: () => void
    updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
    persist<AuthState>(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (loginData: LoginInput) => {
                try {
                    const { data } = await apolloClient.mutate<LoginMutationData, { data: LoginInput }>({
                        mutation: LOGIN_MUTATION,
                        variables: {
                            data: {
                                email: loginData.email,
                                password: loginData.password,
                            }
                        },
                    })

                    if (data?.login) {
                        const { token, user } = data.login

                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt,
                            },
                            token: token,
                            isAuthenticated: true,
                        })
                        return true
                    }

                    return false
                } catch (error) {
                    throw error
                }
            },

            register: async (registerData: RegisterInput) => {
                try {
                    const { data } = await apolloClient.mutate<RegisterMutationData, { data: RegisterInput }>({
                        mutation: REGISTER_MUTATION,
                        variables: {
                            data: {
                                name: registerData.name,
                                email: registerData.email,
                                password: registerData.password,
                            }
                        },
                    })

                    if(data?.register) {
                        const { token, user } = data.register

                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt,
                            },
                            token: token,
                            isAuthenticated: true,
                        })

                        return true

                    }
                    return false
                } catch (error) {
                    throw error  
                }
            },
            logout: () => {
                set({ user: null, token: null, isAuthenticated: false })
                apolloClient.clearStore()
            },
            updateUser: (userData: Partial<User>) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null
                }))
            },
        }),
        {
            name: "auth-storage",
        }
    )
)