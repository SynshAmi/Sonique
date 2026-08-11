import { useRouter } from '../hooks/useRouter';
import { IdentityDashboard } from '../pages/IdentityDashboard';
import { CompatibilityScreen } from '../pages/CompatibilityScreen';
import { AccountScreen } from '../pages/AccountScreen';
import { Navbar } from './Navbar';

export const AuthenticatedApp = ({ profile }: { profile: any }) => {
  const { currentPath } = useRouter();

  let content = <IdentityDashboard profile={profile} />;

  if (currentPath.startsWith('/compatibility')) {
    content = <CompatibilityScreen />;
  } else if (currentPath.startsWith('/account')) {
    content = <AccountScreen />;
  }
  // Default to IdentityDashboard for / or /identity

  return (
    <div className="bg-sonique-bg text-white font-hanken">
      <Navbar />
      {/* pt-16 md:pt-20 matches Navbar height to prevent content from hiding under the fixed nav */}
      <main className="pt-16 md:pt-20">
        {content}
      </main>
    </div>
  );
};
