import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { Database } from '../supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if user exists in our users table
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .eq('auth_provider', 'email')
            .single()

          if (error || !user) {
            return null
          }

          // Verify password
          if (!user.password_hash) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password_hash)
          if (!isValid) {
            return null
          }

          // Check if user is active
          if (!user.is_active) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            image: user.avatar_url,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists with this Google ID
          let { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', account.providerAccountId)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking user:', error)
            return false
          }

          // If user doesn't exist with Google ID, check by email
          if (!existingUser) {
            const { data: emailUser, error: emailError } = await supabase
              .from('users')
              .select('*')
              .eq('email', user.email!)
              .single()

            if (emailError && emailError.code !== 'PGRST116') {
              console.error('Error checking email user:', emailError)
              return false
            }

            if (emailUser) {
              // Update existing user with Google ID
              const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({
                  google_id: account.providerAccountId,
                  auth_provider: 'google',
                  full_name: user.name,
                  avatar_url: user.image,
                  email_verified: true,
                })
                .eq('id', emailUser.id)
                .select()
                .single()

              if (updateError) {
                console.error('Error updating user:', updateError)
                return false
              }
              
              // Set the database UUID as the user ID
              user.id = updatedUser.id
            } else {
              // Create new user
              const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({
                  email: user.email!,
                  full_name: user.name,
                  avatar_url: user.image,
                  auth_provider: 'google',
                  google_id: account.providerAccountId,
                  email_verified: true,
                  is_active: true,
                })
                .select()
                .single()

              if (insertError) {
                console.error('Error creating user:', insertError)
                return false
              }
              
              // Set the database UUID as the user ID
              user.id = newUser.id
            }
          } else {
            // User exists, set the database UUID as the user ID
            user.id = existingUser.id
          }

          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
