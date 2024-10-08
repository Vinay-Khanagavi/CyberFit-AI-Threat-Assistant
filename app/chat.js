'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there, kiddo! I'm Super Hero CyberFit, here to fight digital dangers! Ready to learn how to stay safe online?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    console.log("Messages 1: ", message) // TODO: remove later

    if (!message.trim() || isLoading) return;
    setIsLoading(true)

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
    setMessage('')

    console.log("Messages 2:", messages)
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({messages: [...messages, {role: 'user', content: message}]}),
      })
    
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
    
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
    
      let assistantResponse = '';
    
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        assistantResponse += text;
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          if (newMessages[newMessages.length - 1].role === 'assistant') {
            newMessages[newMessages.length - 1].content = assistantResponse;
          } else {
            newMessages.push({ role: 'assistant', content: assistantResponse });
          }
          return newMessages;
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    console.log("Message 3: ", messages)
  }, [messages])

  return (
    <Stack display="flex" justifyContent="center" alignItems="center" width="100vw" height="100vh" >
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor='#B3DEE2'
    >
      <Stack
        direction="column"
        width="70%"
        height="100%"
        padding="20px"
        margin='20px'
        backgroundColor='white'
        borderRadius={10}
        spacing={2}
        overflow="hidden"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.4)"
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          padding={1}
        >
          {messages.map((message, index) => (
            <Box
            key={index}
            display="flex"
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
            alignItems="center" 
          >
            {message.role === 'assistant' && (
              <Box
                component="img"
                src="/hello.png" 
                alt="Assistant"
                sx={{
                  width: 55, 
                  height: 55,
                  marginRight: 1, 
                }}
              />
            )}
            
            <Box
              bgcolor={
                message.role === 'assistant'
                  ? '#4C504D'
                  : '#06a177'
              }
              color="white"
              borderRadius={message.role === 'assistant' 
                  ? '16px 16px 16px 0px' 
                  : '16px 16px 0px 16px'}
              p={3}
            >
              {message.content}
            </Box>
            
            {message.role === 'user' && (
              <Box
                component="img"
                src="/userAvatar.png" 
                alt="User"
                sx={{
                  width: 55,
                  height: 55,
                  marginLeft: 1, 
                }}
              />
            )}
          </Box>
          
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            sx={{
                borderRadius: '30px', 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  '&:hover fieldset': {
                    borderColor: '#048c66', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#048c66',

                  },
                },
              }}
          />
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}
          sx={{
            borderRadius: '15px',
            backgroundColor: '#232625', 
            '&:hover': {
              backgroundColor: '#9bd9ad',
            },
          }}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
    </Stack>
  )
}