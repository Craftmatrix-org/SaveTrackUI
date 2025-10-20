import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "@/lib/token";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TransactionItem } from "@/types/transaction";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpDown, Plus, Eye, EyeOff } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  count?: number;
  [key: string]: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const Records = () => {
  const token = getCookie("token");
  const isMobile = useIsMobile();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAmounts, setShowAmounts] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    const fetchTransactions = async () => {
      try {
        const response = await axios.get<TransactionItem[]>(
          `${import.meta.env.VITE_API_URL}/api/v2/Transaction`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

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
    });
  };

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.isPositive)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => !t.isPositive)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

  // Prepare chart data
  const categoryData = transactions
    .filter(t => !t.isPositive)
    .reduce((acc, transaction) => {
      const category = transaction.categoryID || 'Uncategorized';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryChartData: ChartData[] = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Monthly trend data
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.createdAt).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expenses: 0 };
    }
    if (transaction.isPositive) {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { name: string; income: number; expenses: number }>);

  const monthlyChartData = Object.values(monthlyData).slice(-6);

  // Recent transactions (last 7 days)
  const recent = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, isMobile ? 5 : 10);

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <p className="text-muted-foreground">Track your income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => setShowAmounts(!showAmounts)}
            className="gap-2"
          >
            {showAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAmounts ? "Hide" : "Show"}
          </Button>
          <Button size={isMobile ? "sm" : "default"} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {showAmounts ? formatCurrency(totalIncome) : "••••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {showAmounts ? formatCurrency(totalExpenses) : "••••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -1.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${netBalance >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className={`h-4 w-4 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {showAmounts ? formatCurrency(netBalance) : "••••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current period balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Mobile Optimized */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          {!isMobile && <TabsTrigger value="trends">Trends</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
              <CardDescription>Compare your income and expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={isMobile ? "h-48" : "h-64"}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                    <YAxis tickFormatter={(value) => `$${value}`} fontSize={isMobile ? 10 : 12} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Your spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={isMobile ? "h-48" : "h-64"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => 
                          isMobile ? `${((percent as number) * 100).toFixed(0)}%` 
                          : `${name} ${((percent as number) * 100).toFixed(0)}%`
                        }
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Your highest spending categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryChartData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium truncate max-w-[120px]">{category.name}</span>
                      </div>
                      <span className="text-sm font-bold">
                        {showAmounts ? formatCurrency(category.value) : "••••••"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {!isMobile && (
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>Track your spending patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.3}
                        name="Expenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>Recent Transactions</CardTitle>
            </div>
            {!isMobile && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recent.map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-3 border rounded-lg ${isMobile ? 'flex-col gap-2' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpDown className={`w-4 h-4 ${transaction.isPositive ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="font-medium text-sm">{transaction.description || 'Transaction'}</span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.categoryID || 'Uncategorized'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
                <div className={`font-bold text-sm ${transaction.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.isPositive ? '+' : '-'}
                  {showAmounts ? formatCurrency(transaction.amount) : "••••••"}
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Start by adding your first transaction</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};