import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/lib/token";
import type { BillItem } from "@/types/bill";
import type { AccountItem } from "@/types/account";
import axios from "axios";
import { useEffect, useState } from "react";
import { CreateBill } from "./crud/create";
import { Calendar, Clock, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";

export const Bills = () => {
  const token = getCookie("token");
  const [bills, setBills] = useState<BillItem[]>([]);
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    const fetchData = async () => {
      try {
        const [billsResponse, accountsResponse] = await Promise.all([
          axios.get<BillItem[]>(`${import.meta.env.VITE_API_URL}/api/v2/Bill`, {
            headers: { Authorization: `${token}` },
          }),
          axios.get<AccountItem[]>(`${import.meta.env.VITE_API_URL}/api/v2/Account`, {
            headers: { Authorization: `${token}` },
          }),
        ]);
        setBills(billsResponse.data);
        setAccounts(accountsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleBillCreated = (newBill: BillItem) => {
    setBills([...bills, newBill]);
  };

  const handleMarkAsPaid = async (billId: number) => {
    if (!token) return;
    
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v2/Bill/${billId}/pay`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );
      setBills(bills.map(bill => 
        bill.id === billId ? { ...bill, isPaid: true } : bill
      ));
    } catch (error) {
      console.error("Failed to mark bill as paid:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getBillStatusColor = (bill: BillItem) => {
    if (bill.isPaid) return "bg-green-100 text-green-800";
    if (bill.isOverdue) return "bg-red-100 text-red-800";
    if (bill.daysTillDue <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getBillStatusText = (bill: BillItem) => {
    if (bill.isPaid) return "Paid";
    if (bill.isOverdue) return "Overdue";
    if (bill.daysTillDue <= 3) return "Due Soon";
    return "Upcoming";
  };

  const getBillIcon = (bill: BillItem) => {
    if (bill.isPaid) return <CheckCircle className="w-4 h-4" />;
    if (bill.isOverdue) return <AlertTriangle className="w-4 h-4" />;
    if (bill.daysTillDue <= 3) return <Clock className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingBills = bills.filter(bill => !bill.isPaid && !bill.isOverdue);
  const overdueBills = bills.filter(bill => bill.isOverdue && !bill.isPaid);
  const paidBills = bills.filter(bill => bill.isPaid);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bills</h1>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {bills.filter(b => !b.isPaid).length} pending
          </span>
        </div>
      </div>

      <CreateBill onBillCreated={handleBillCreated} accounts={accounts} />

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Overdue Bills ({overdueBills.length})
          </h2>
          {overdueBills.map((bill) => (
            <Card key={bill.id} className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getBillIcon(bill)}
                      <h3 className="font-semibold">{bill.title}</h3>
                      <Badge className={getBillStatusColor(bill)}>
                        {getBillStatusText(bill)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{bill.category}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Due: {formatDate(bill.dueDate)}</span>
                      <span className="font-semibold text-lg text-gray-900">
                        {formatCurrency(bill.amount)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsPaid(bill.id)}
                    className="ml-4"
                  >
                    Mark Paid
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Bills ({upcomingBills.length})
          </h2>
          {upcomingBills.map((bill) => (
            <Card key={bill.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getBillIcon(bill)}
                      <h3 className="font-semibold">{bill.title}</h3>
                      <Badge className={getBillStatusColor(bill)}>
                        {getBillStatusText(bill)}
                      </Badge>
                      {bill.isRecurring && (
                        <Badge variant="outline" className="text-xs">
                          {bill.recurringType}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{bill.category}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Due: {formatDate(bill.dueDate)}</span>
                      <span>In {bill.daysTillDue} days</span>
                      <span className="font-semibold text-lg text-gray-900">
                        {formatCurrency(bill.amount)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsPaid(bill.id)}
                    className="ml-4"
                  >
                    Mark Paid
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Paid Bills ({paidBills.length})
          </h2>
          <div className="grid gap-2">
            {paidBills.slice(0, 5).map((bill) => (
              <Card key={bill.id} className="opacity-75">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{bill.title}</span>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                    <span className="font-semibold">{formatCurrency(bill.amount)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {paidBills.length > 5 && (
              <p className="text-center text-sm text-gray-500 py-2">
                + {paidBills.length - 5} more paid bills
              </p>
            )}
          </div>
        </div>
      )}

      {bills.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No bills yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first bill to track payments and due dates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};