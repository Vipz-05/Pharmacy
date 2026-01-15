import { useState } from "react";
import { Search, AlertTriangle, Package } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "./ui/utils";

interface InventoryItem {
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufacturer: string;
  location: string;
  costPrice: number;
}

const mockInventory: InventoryItem[] = [
  {
    medicineId: "MED001",
    medicineName: "Amoxicillin 500mg",
    batchNumber: "BT2401",
    quantity: 450,
    expiryDate: "2026-02-15",
    manufacturer: "PharmaCorp",
    location: "A-101",
    costPrice: 0.35,
  },
  {
    medicineId: "MED002",
    medicineName: "Ibuprofen 400mg",
    batchNumber: "BT2402",
    quantity: 1200,
    expiryDate: "2026-03-20",
    manufacturer: "MediLabs",
    location: "A-102",
    costPrice: 0.18,
  },
  {
    medicineId: "MED003",
    medicineName: "Paracetamol 500mg",
    batchNumber: "BT2403",
    quantity: 2000,
    expiryDate: "2026-04-10",
    manufacturer: "HealthCare Inc",
    location: "A-103",
    costPrice: 0.10,
  },
  {
    medicineId: "MED001",
    medicineName: "Amoxicillin 500mg",
    batchNumber: "BT2301",
    quantity: 120,
    expiryDate: "2026-01-25",
    manufacturer: "PharmaCorp",
    location: "A-101",
    costPrice: 0.35,
  },
  {
    medicineId: "MED004",
    medicineName: "Metformin 500mg",
    batchNumber: "BT2404",
    quantity: 35,
    expiryDate: "2026-06-15",
    manufacturer: "BioMed",
    location: "B-201",
    costPrice: 0.28,
  },
  {
    medicineId: "MED005",
    medicineName: "Lisinopril 10mg",
    batchNumber: "BT2405",
    quantity: 60,
    expiryDate: "2026-07-20",
    manufacturer: "CardioHealth",
    location: "B-202",
    costPrice: 0.42,
  },
];

function getExpiryStatus(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return { status: "expired", label: "Expired", variant: "destructive" };
  if (daysUntilExpiry < 30) return { status: "critical", label: "Critical", variant: "destructive" };
  if (daysUntilExpiry < 60) return { status: "warning", label: "Warning", variant: "secondary" };
  return { status: "good", label: "Good", variant: "default" };
}

function getStockStatus(quantity: number) {
  if (quantity < 50) return { status: "critical", variant: "destructive" };
  if (quantity < 100) return { status: "low", variant: "secondary" };
  return { status: "adequate", variant: "default" };
}

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    
    const expiryStatus = getExpiryStatus(item.expiryDate).status;
    if (filterStatus === "expiring") {
      return matchesSearch && (expiryStatus === "critical" || expiryStatus === "warning");
    }
    if (filterStatus === "low-stock") {
      return matchesSearch && item.quantity < 100;
    }
    
    return matchesSearch;
  });

  const totalValue = filteredInventory.reduce(
    (sum, item) => sum + item.quantity * item.costPrice,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Inventory Management</h1>
        <p className="text-gray-500 mt-1">Batch-wise stock view with expiry tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Batches</p>
              <p className="text-2xl mt-1">{filteredInventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl mt-1">${totalValue.toFixed(2)}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl mt-1">
                {mockInventory.filter(
                  (item) =>
                    getExpiryStatus(item.expiryDate).status === "critical" ||
                    getExpiryStatus(item.expiryDate).status === "warning"
                ).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by medicine or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Expiry Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Batch Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item, index) => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              const stockStatus = getStockStatus(item.quantity);
              const batchValue = item.quantity * item.costPrice;

              return (
                <TableRow
                  key={index}
                  className={cn(
                    expiryStatus.status === "critical" && "bg-red-50",
                    expiryStatus.status === "warning" && "bg-yellow-50"
                  )}
                >
                  <TableCell>
                    <div>
                      <p>{item.medicineName}</p>
                      <p className="text-xs text-gray-500">{item.manufacturer}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.batchNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}</span>
                      {stockStatus.status !== "adequate" && (
                        <Badge variant={stockStatus.variant as any} className="text-xs">
                          {stockStatus.status}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>
                    <Badge variant={expiryStatus.variant as any}>
                      {expiryStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                  <TableCell>${batchValue.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
