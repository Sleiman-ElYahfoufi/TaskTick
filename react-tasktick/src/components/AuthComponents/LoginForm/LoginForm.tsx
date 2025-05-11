import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import '../AuthForms.css'

interface LoginFormProps {
  onSwitchToSignup: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="login-form">
      <h2>Join & Use the Best Growing Project Manager</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="johndoe@email.com"
            required
          />
        </div>
        
        
        
      
      </form>
      
     
    </div>
  )
}

export default LoginForm