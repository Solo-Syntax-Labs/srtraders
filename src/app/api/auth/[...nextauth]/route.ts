import { NextRequest } from 'next/server'
import NextAuth from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler
