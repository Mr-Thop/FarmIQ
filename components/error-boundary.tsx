"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import ErrorPage from "./error-page"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} reset={() => this.setState({ hasError: false, error: null })} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
