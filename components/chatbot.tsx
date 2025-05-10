"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X } from "lucide-react"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your FarmIQ assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])

    // Simulate bot response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Thanks for your message! Our team is working on implementing a full AI assistant. For now, please contact our support team for further assistance.",
        },
      ])
    }, 1000)

    setInput("")
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-[#2c5d34] hover:bg-[#1e3f24] shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="sr-only">Toggle chat</span>
      </Button>

      {/* Chatbot window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 md:w-96 shadow-xl z-50 border-[#d8e6c0]">
          <CardHeader className="bg-[#2c5d34] text-white rounded-t-lg py-3">
            <CardTitle className="text-base flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              FarmIQ Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 max-h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      message.role === "user" ? "bg-[#2c5d34] text-white" : "bg-[#e6f0d8] text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-[#2c5d34] hover:bg-[#1e3f24]">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
