import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New User | CFO Dashboard',
  description: 'Create a new user account for the CFO dashboard system',
};

export default function NewUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
