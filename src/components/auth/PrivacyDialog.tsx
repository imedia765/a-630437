import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyDialog = ({ open, onOpenChange }: PrivacyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pakistan Welfare Association Membership Terms</DialogTitle>
          <DialogDescription>V.4 December 2024</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="space-y-4">
            <h3 className="font-semibold">1. Members Eligibility</h3>
            <p>Only Muslims can be members of Pakistan Welfare Association (PWA).</p>

            <h3 className="font-semibold">2. Membership Fee</h3>
            <p>Any new members must pay a membership fee plus the collection amount for that calendar year. Currently the membership fee is £150 as of January 2024. This may change with inflation and is reviewed periodically to reflect the costs incurred.</p>

            <h3 className="font-semibold">3. Dependents Registration</h3>
            <p>All members will be given a membership number and will need to register their dependents so that the PWA Committee can gain an accurate picture of the actual number of people covered. Dependents include stepchildren and adopted children.</p>

            {/* ... Additional sections ... */}
            <p className="mt-6 font-semibold">By becoming a member of the Pakistan Welfare Association, you agree to abide by these terms and conditions outlined above.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyDialog;