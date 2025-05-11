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
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="**************"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="form-submit-row">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>
          <button type="submit" className="auth-button compact">
            SIGN IN
          </button>
        </div>
      </form>
      
     
    </div>
  )
}

export default LoginForm