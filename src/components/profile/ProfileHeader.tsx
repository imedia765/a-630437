import { CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  title?: string;
}

const ProfileHeader = ({ title = "Member Profile" }: ProfileHeaderProps) => {
  return (
    <CardHeader className="border-b border-white/5 pb-6">
      <CardTitle className="text-white flex items-center gap-2">
        <span className="text-dashboard-accent1">{title}</span>
      </CardTitle>
    </CardHeader>
  );
};

export default ProfileHeader;