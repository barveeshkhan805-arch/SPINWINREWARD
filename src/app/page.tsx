import { redirect } from 'next/navigation';

// This page is a server component that automatically redirects to the /earn page.
// This avoids client-side rendering for a simple redirect and resolves build issues.
export default function Home() {
  redirect('/earn');
  // Since redirect() throws an error, this component will not return anything.
  // This is the expected behavior for server-side redirects.
}
