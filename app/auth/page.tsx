"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
import { RegisterForm } from "@/components/auth/register-form"
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}