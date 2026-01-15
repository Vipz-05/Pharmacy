import { useState } from "react";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface PurchaseOrder {
  id: string;
  orderDate: string;
  supplierId: string;
  supplierName: string;
  status: "pending" | "approved" | "received" | "cancelled";
  totalAmount: number;
  itemCount: number;
}

interface POItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO2024001",
    orderDate: "2024-12-28",
    supplierId: "SUP001",
    supplierName: "MediSupply Co.",
    status: "pending",
    totalAmount: 12500,
    itemCount: 5,
  },
  {
    id: "PO2024002",
    orderDate: "2024-12-25",
    supplierId: "SUP002",
    supplierName: "PharmaDirect Ltd.",
    status: "approved",
    totalAmount: 8750,
    itemCount: 3,
  },
  {
    id: "PO2024003",
    orderDate: "2024-12-20",
    supplierId: "SUP001",
    supplierName: "MediSupply Co.",
    status: "received",
    totalAmount: 15200,
    itemCount: 8,
  },
];

const mockSuppliers = [
  { id: "SUP001", name: "MediSupply Co." },
  { id: "SUP002", name: "PharmaDirect Ltd." },
  { id: "SUP003", name: "HealthPharma Inc." },
];

const mockMedicines = [
  { id: "MED001", name: "Amoxicillin 500mg", price: 0.35 },
  { id: "MED002", name: "Ibuprofen 400mg", price: 0.18 },
  { id: "MED003", name: "Paracetamol 500mg", price: 0.10 },
  { id: "MED004", name: "Metformin 500mg", price: 0.28 },
];

export function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [poItems, setPoItems] = useState<POItem[]>([]);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      approved: "default",
      received: "default",
      cancelled: "destructive",
    };
    return variants[status] || "default";
  };

  const addPOItem = () => {
    setPoItems([...poItems, { medicineId: "", medicineName: "", quantity: 0, unitPrice: 0 }]);
  };

  const removePOItem = (index: number) => {
    setPoItems(poItems.filter((_, i) => i !== index));
  };

  const updatePOItem = (index: number, field: keyof POItem, value: any) => {
    const newItems = [...poItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setPoItems(newItems);
  };

  const calculateTotal = () => {
    return poItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Purchase Orders</h1>
          <p className="text-gray-500 mt-1">Manage supplier orders and deliveries</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell>{order.itemCount} items</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Select supplier and add items to create a new purchase order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input id="orderDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPOItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {poItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                  No items added yet. Click "Add Item" to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {poItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-5 space-y-1">
                        <Label className="text-xs">Medicine</Label>
                        <Select
                          value={item.medicineId}
                          onValueChange={(value) => {
                            const medicine = mockMedicines.find(m => m.id === value);
                            if (medicine) {
                              updatePOItem(index, "medicineId", value);
                              updatePOItem(index, "medicineName", medicine.name);
                              updatePOItem(index, "unitPrice", medicine.price);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select medicine" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockMedicines.map((med) => (
                              <SelectItem key={med.id} value={med.id}>
                                {med.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) => updatePOItem(index, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice || ""}
                          onChange={(e) => updatePOItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Total</Label>
                        <Input
                          value={`$${(item.quantity * item.unitPrice).toFixed(2)}`}
                          disabled
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePOItem(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end p-3 bg-gray-100 rounded-lg">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl">${calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
