export const validatePassword = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push("Min 8 characters")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Need uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Need lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Need a number")
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Need special char (!@#$%^&*)")
  }

  return errors
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validateUserName = (userName) => {
  if (userName.length < 3) return "Min 3 characters"
  if (!/^[a-zA-Z0-9_]+$/.test(userName)) return "Only letters, numbers, underscore"
  return ""
}
