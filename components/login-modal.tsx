"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Leaf, User, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

export default function LoginModal({ isOpen, onClose, defaultTab = "login" }: LoginModalProps) {
  const { login, register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginRole, setLoginRole] = useState<"farmer" | "customer">("farmer")
  const [loginError, setLoginError] = useState("")

  // Register form state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerRole, setRegisterRole] = useState<"farmer" | "customer">("farmer")
  const [registerError, setRegisterError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }

    console.log("Logging in with:", { email: loginEmail, role: loginRole })
    const success = await login(loginEmail, loginPassword, loginRole)

    if (success) {
      onClose()
    } else {
      setLoginError("Invalid email or password")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError("Please fill in all fields")
      return
    }

    console.log("Registering with:", { name: registerName, email: registerEmail, role: registerRole })
    const success = await register(registerName, registerEmail, registerPassword, registerRole)

    if (success) {
      onClose()
    } else {
      setRegisterError("Registration failed. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-[#2c5d34]">Welcome to FarmIQ</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#2c5d34] data-[state=active]:text-white">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-[#2c5d34] data-[state=active]:text-white">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup
                    value={loginRole}
                    onValueChange={(value) => setLoginRole(value as "farmer" | "customer")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="farmer" id="login-farmer" />
                      <Label htmlFor="login-farmer" className="flex items-center">
                        <Leaf className="h-4 w-4 mr-1" />
                        Farmer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="login-customer" />
                      <Label htmlFor="login-customer" className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Customer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {loginError && <p className="text-sm text-red-500">{loginError}</p>}

                <Button type="submit" className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <a href="#" className="text-[#2c5d34] hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>I want to register as:</Label>
                  <RadioGroup
                    value={registerRole}
                    onValueChange={(value) => setRegisterRole(value as "farmer" | "customer")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="farmer" id="register-farmer" />
                      <Label htmlFor="register-farmer" className="flex items-center">
                        <Leaf className="h-4 w-4 mr-1" />
                        Farmer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="register-customer" />
                      <Label htmlFor="register-customer" className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Customer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {registerError && <p className="text-sm text-red-500">{registerError}</p>}

                <Button type="submit" className="w-full bg-[#2c5d34] hover:bg-[#1e3f24]" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-center text-xs text-gray-500">
                  By registering, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
