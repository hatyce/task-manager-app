export default function RegisterForm(){
  
  return(
    <div className="flex min-h-full flex-col justify-center py-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
            <div className="mt-2">
              <input className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
            <div className="mt-2">
              <input className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-100">Confirm Password</label>
            <div className="mt-2">
              <input className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"/>
            </div>
          </div>
          <div>
            <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold text-white
            focus-visible:outline-2 focus-visible:outline-indigo-500">Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}