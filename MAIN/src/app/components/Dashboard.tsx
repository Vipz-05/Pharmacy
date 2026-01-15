import { AlertCircle, TrendingUp, Package, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
];

const categoryData = [
  { name: "Antibiotics", value: 35 },
  { name: "Pain Relief", value: 25 },
  { name: "Vitamins", value: 20 },
  { name: "Others", value: 20 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

const expiringMedicines = [
  { name: "Amoxicillin 500mg", batch: "BT2401", expiry: "2026-02-15", stock: 45 },
  { name: "Ibuprofen 400mg", batch: "BT2402", expiry: "2026-03-20", stock: 120 },
  { name: "Paracetamol 500mg", batch: "BT2403", expiry: "2026-04-10", stock: 200 },
];

const lowStockItems = [
  { name: "Aspirin 75mg", current: 15, min: 50, status: "critical" },
  { name: "Metformin 500mg", current: 35, min: 100, status: "low" },
  { name: "Lisinopril 10mg", current: 60, min: 150, status: "low" },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of pharmacy operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-500">Low Stock Alerts</CardTitle>
            <Package className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">8</div>
            <p className="text-xs text-gray-500 mt-1">Items need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-500">Expiring Soon</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">12</div>
            <p className="text-xs text-gray-500 mt-1">Within 60 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-500">Today's Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$2,847</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <p className="text-xs text-green-600">+12.5% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-500">Prescriptions</CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">34</div>
            <p className="text-xs text-gray-500 mt-1">Pending fulfillment</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {item.current} | Min: {item.min}
                    </p>
                  </div>
                  <Badge variant={item.status === "critical" ? "destructive" : "secondary"}>
                    {item.status === "critical" ? "Critical" : "Low"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiring Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringMedicines.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Batch: {item.batch} | Stock: {item.stock}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Expires</p>
                    <p className="text-sm">{item.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
