'use client'

import { useState } from 'react'
import { changePassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PasswordForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setValidationError('')

    // Validation
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match')
      setLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const result = await changePassword(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPassword('')
      setConfirmPassword('')
      // Reset form
      e.currentTarget.reset()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
          minLength={6}
          className="bg-zinc-800 border-zinc-700"
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 6 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          required
          minLength={6}
          className="bg-zinc-800 border-zinc-700"
        />
      </div>

      {validationError && (
        <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500 border border-red-500/20">
          {validationError}
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 text-black hover:bg-yellow-600 w-full sm:w-auto"
      >
        {loading ? 'Changing Password...' : 'Change Password'}
      </Button>
    </form>
  )
}
