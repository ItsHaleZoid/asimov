export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
        <p className="text-white/70">
          Sorry, we couldn't sign you in. Please try again.
        </p>
        <a 
          href="/signin" 
          className="inline-block px-6 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  )
}