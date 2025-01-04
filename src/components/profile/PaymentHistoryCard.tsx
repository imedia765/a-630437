import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, CreditCard, History, AlertOctagon, PoundSterling } from "lucide-react";
import ProfileHeader from "./ProfileHeader";

const PaymentHistoryCard = () => {
  // Placeholder data - will be replaced with real data later
  const paymentHistory = {
    yearlyPayment: {
      amount: 40,
      status: 'pending',
      dueDate: '2024-12-31'
    },
    emergencyCollections: [
      {
        amount: 20,
        date: '2024-02-15',
        reason: 'Community Support Fund'
      }
    ]
  };

  return (
    <Card className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300 mt-6">
      <ProfileHeader title="Payment History" />
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Yearly Payment Section */}
          <div className="space-y-2">
            <p className="text-dashboard-muted text-sm">Annual Membership Fee</p>
            <div className="bg-white/5 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-dashboard-accent2">
                  <PoundSterling className="w-4 h-4" />
                  <span className="text-lg font-medium">40.00</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  paymentHistory.yearlyPayment.status === 'paid' 
                    ? 'bg-dashboard-accent3/20 text-dashboard-accent3'
                    : 'bg-dashboard-warning/20 text-dashboard-warning'
                }`}>
                  {paymentHistory.yearlyPayment.status === 'paid' ? 'Paid' : 'Due'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-dashboard-text text-sm">
                <CalendarIcon className="w-4 h-4 text-dashboard-muted" />
                <span>Due by: December 31, 2024</span>
              </div>
            </div>
          </div>

          {/* Emergency Collections Section */}
          <div className="space-y-2">
            <p className="text-dashboard-muted text-sm">Emergency Collections</p>
            <div className="space-y-2">
              {paymentHistory.emergencyCollections.map((collection, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-dashboard-warning" />
                      <span className="text-dashboard-text">{collection.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-dashboard-accent2">
                      <PoundSterling className="w-4 h-4" />
                      <span>{collection.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-dashboard-text text-sm">
                    <CalendarIcon className="w-4 h-4 text-dashboard-muted" />
                    <span>Collected on: {new Date(collection.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="space-y-2">
            <p className="text-dashboard-muted text-sm">Payment Methods</p>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-dashboard-accent1" />
                <span className="text-dashboard-text">Cash or Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryCard;