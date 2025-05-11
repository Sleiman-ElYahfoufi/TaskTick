import React, { useState } from 'react'
import LoginForm from '../../components/AuthComponents/LoginForm/LoginForm'
import SignupForm from '../../components/AuthComponents/SignupForm/SignupForm'
import './Auth.css'
import AuthImage from '../../assets/AuthImage.png'

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const handleSwitchToSignup = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }

  return (
    <div className={`auth-page ${isLogin ? 'login-mode' : 'signup-mode'}`}>
      <div className="auth-left">
        {isLogin && <LoginForm onSwitchToSignup={handleSwitchToSignup} />}
      </div>
     
    </div>
  )
}

export default Auth