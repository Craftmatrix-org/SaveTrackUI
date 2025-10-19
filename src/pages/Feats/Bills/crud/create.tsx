import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getCookie } from "@/lib/token";
import type { CreateBillRequest, BillItem } from "@/types/bill";
import type { AccountItem } from "@/types/account";
import axios from "axios";

interface CreateBillProps {
  onBillCreated: (bill: BillItem) => void;
  accounts: AccountItem[];
}

export const CreateBill = ({ onBillCreated, accounts }: CreateBillProps) => {
  const token = getCookie("token");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBillRequest>({
    title: "",
    description: "",
    amount: 0,
    dueDate: "",
    category: "",
    isRecurring: false,
    recurringType: "monthly",
    recurringInterval: 1,
    accountId: 0,
  });

  const handleSubmit = async () => {
    if (!token || !formData.title || !formData.amount || !formData.dueDate || !formData.accountId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post<BillItem>(
        `${import.meta.env.VITE_API_URL}/api/v2/Bill`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onBillCreated(response.data);
      setFormData({
        title: "",
        description: "",
        amount: 0,
        dueDate: "",
        category: "",
        isRecurring: false,
        recurringType: "monthly",
        recurringInterval: 1,
        accountId: 0,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create bill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Add New Bill
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Bill</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new bill to track your recurring or one-time payments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Bill Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Electric Bill, Rent"
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Utilities, Housing"
            />
          </div>

          <div>
            <Label htmlFor="account">Account</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, accountId: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional notes about this bill"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recurring">Recurring Bill</Label>
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
            />
          </div>

          {formData.isRecurring && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="recurringType">Recurring Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, recurringType: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.recurringType === "custom" && (
                <div>
                  <Label htmlFor="recurringInterval">Interval (days)</Label>
                  <Input
                    id="recurringInterval"
                    type="number"
                    value={formData.recurringInterval}
                    onChange={(e) => setFormData({ ...formData, recurringInterval: parseInt(e.target.value) || 1 })}
                    placeholder="30"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Bill"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};