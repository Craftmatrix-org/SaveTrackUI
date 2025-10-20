import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/lib/token";
import type { AccountItem } from "@/types/account";
import axios from "axios";
import { useEffect, useState } from "react";
import { CreateAccount } from "./crud/create";
import { CreditCard, Wallet, Building2, DollarSign, Plus, TrendingUp, Eye, EyeOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const getAccountIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'bank': return Building2;
    case 'credit': return CreditCard;
    case 'cash': 
    case 'wallet':
    default: return Wallet;
  }
};

const getAccountTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'bank': return 'bg-blue-500';
    case 'credit': return 'bg-purple-500';
    case 'cash':
    case 'wallet':
    default: return 'bg-green-500';
  }
};

export const Account = () => {
  const token = getCookie("token");
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!token) return;
    
    const getData = async () => {
      try {
        const response = await axios.get<AccountItem[]>(
          `${import.meta.env.VITE_API_URL}/api/v2/Account`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        setAccounts(response.data);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + (account.total || 0), 0);

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => setShowBalances(!showBalances)}
            className="gap-2"
          >
            {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </Button>
          <CreateAccount />
        </div>
      </div>

      {/* Summary Card */}
      {accounts.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-sm font-medium">Total Balance</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {showBalances ? formatCurrency(totalBalance) : "••••••"}
                </CardTitle>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Accounts Grid */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const IconComponent = getAccountIcon(account.type || '');
            const colorClass = getAccountTypeColor(account.type || '');
            
            return (
              <Card key={account.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${colorClass} text-white`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                          {account.label}
                        </CardTitle>
                        <CardDescription className="text-sm capitalize">
                          {account.type || 'Account'}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Balance</p>
                      <p className="text-xl font-bold">
                        {showBalances ? formatCurrency(account.total || 0) : "••••••"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No accounts yet</h3>
                <p className="text-muted-foreground">Start by adding your first financial account</p>
              </div>
              <CreateAccount />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Mobile */}
      {isMobile && accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 flex-col gap-1">
                <Plus className="w-4 h-4" />
                <span className="text-xs">Add Transaction</span>
              </Button>
              <Button variant="outline" className="h-12 flex-col gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Transfer</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
