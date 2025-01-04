import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MemberProfileCard from './MemberProfileCard';
import PaymentHistoryCard from './profile/PaymentHistoryCard';
import { Button } from "@/components/ui/button";

interface DashboardViewProps {
  onLogout: () => void;
}

const DashboardView = ({ onLogout }: DashboardViewProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await queryClient.invalidateQueries();
      await supabase.auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const { data: memberProfile, isError } = useQuery({
    queryKey: ['memberProfile'],
    queryFn: async () => {
      console.log('Fetching member profile...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user logged in');

      const { data: { user } } = await supabase.auth.getUser();
      const memberNumber = user?.user_metadata?.member_number;
      
      if (!memberNumber) {
        console.error('No member number found in user metadata');
        throw new Error('Member number not found');
      }

      console.log('Fetching member with number:', memberNumber);
      
      let query = supabase
        .from('members')
        .select('*');
      
      query = query.or(`member_number.eq.${memberNumber},auth_user_id.eq.${session.user.id}`);
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching member:', error);
        toast({
          variant: "destructive",
          title: "Error fetching member profile",
          description: error.message
        });
        throw error;
      }

      if (!data) {
        console.error('No member found with number:', memberNumber);
        toast({
          variant: "destructive",
          title: "Member not found",
          description: "Could not find your member profile"
        });
        throw new Error('Member not found');
      }
      
      return data;
    },
  });

  return (
    <>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium mb-2 text-white">Dashboard</h1>
          <p className="text-dashboard-text">Welcome back!</p>
        </div>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="border-white/10 hover:bg-white/5 text-dashboard-text"
        >
          Logout
        </Button>
      </header>
      
      <div className="grid gap-6">
        <MemberProfileCard memberProfile={memberProfile} />
        <PaymentHistoryCard />
      </div>
    </>
  );
};

export default DashboardView;