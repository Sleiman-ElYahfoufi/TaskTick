import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import '../AuthForms.css'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="signup-form">
     
    </div>
  )
}

export default SignupForm