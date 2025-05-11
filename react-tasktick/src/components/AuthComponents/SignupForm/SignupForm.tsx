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
      <h2>Join & Use the Best Growing Project Manager</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="johndadev"
            required
          />
        </div>
        
           </form>
      
    
    </div>
  )
}

export default SignupForm