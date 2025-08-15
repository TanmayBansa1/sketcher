import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1>Sign In</h1>
      <SignIn signUpUrl='/sign-up' withSignUp />
    </div>
  );
}