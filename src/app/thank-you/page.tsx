export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Obrigado pela sua compra!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Estamos muito felizes em ter você conosco. Em breve você receberá um email com as próximas instruções.
          </p>
        </div>
        <div className="mt-4">
          <a
            href="/login"
            className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Área da equipa (login)
          </a>
        </div>
      </div>
    </div>
  )
} 