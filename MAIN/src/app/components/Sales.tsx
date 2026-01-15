import { useState } from "react";
import { Plus, Trash2, Printer, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";

interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

const mockMedicines = [
  { id: "MED001", name: "Amoxicillin 500mg", price: 0.45, stock: 450 },
  { id: "MED002", name: "Ibuprofen 400mg", price: 0.25, stock: 1200 },
  { id: "MED003", name: "Paracetamol 500mg", price: 0.15, stock: 2000 },
  { id: "MED004", name: "Metformin 500mg", price: 0.35, stock: 800 },
  { id: "MED005", name: "Lisinopril 10mg", price: 0.55, stock: 350 },
  { id: "MED006", name: "Aspirin 75mg", price: 0.20, stock: 600 },
];

const recentSales = [
  { id: "INV-2024-0145", date: "2024-12-28 14:23", customer: "John Doe", items: 3, total: 45.50 },
  { id: "INV-2024-0144", date: "2024-12-28 13:15", customer: "Jane Smith", items: 2, total: 28.75 },
  { id: "INV-2024-0143", date: "2024-12-28 12:40", customer: "Robert Johnson", items: 5, total: 62.30 },
];

export function Sales() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchMedicine, setSearchMedicine] = useState("");

  const addSaleItem = () => {
    setSaleItems([
      ...saleItems,
      { medicineId: "", medicineName: "", quantity: 1, unitPrice: 0, discount: 0 },
    ]);
  };

  const removeSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateSaleItem = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...saleItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSaleItems(newItems);
  };

  const calculateItemTotal = (item: SaleItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    return subtotal - discountAmount;
  };

  const calculateSubtotal = () => {
    return saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateDiscount = () => {
    return saleItems.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + (subtotal * (item.discount / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleMedicineSelect = (index: number, medicineId: string) => {
    const medicine = mockMedicines.find((m) => m.id === medicineId);
    if (medicine) {
      updateSaleItem(index, "medicineId", medicineId);
      updateSaleItem(index, "medicineName", medicine.name);
      updateSaleItem(index, "unitPrice", medicine.price);
    }
  };

  const handleCheckout = () => {
    alert("Invoice generated successfully!");
    setSaleItems([]);
    setCustomerName("");
    setPaymentMethod("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Sales & Billing</h1>
        <p className="text-gray-500 mt-1">Point of sale and invoice generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* POS Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>New Sale</CardTitle>
                <Button size="sm" onClick={addSaleItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer Name</Label>
                    <Input
                      id="customer"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="mobile">Mobile Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {saleItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
                    No items in cart. Click "Add Item" to start a sale.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {saleItems.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="col-span-5 space-y-1">
                          <Label className="text-xs">Medicine</Label>
                          <Select
                            value={item.medicineId}
                            onValueChange={(value) => handleMedicineSelect(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select medicine" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockMedicines.map((med) => (
                                <SelectItem key={med.id} value={med.id}>
                                  {med.name} - ${med.price.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Qty</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || ""}
                            onChange={(e) =>
                              updateSaleItem(index, "quantity", parseInt(e.target.value) || 1)
                            }
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Price</Label>
                          <Input value={`$${item.unitPrice.toFixed(2)}`} disabled />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Disc %</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount || ""}
                            onChange={(e) =>
                              updateSaleItem(index, "discount", parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSaleItem(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Total Summary */}
          {saleItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-red-600">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-2xl">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="outline" onClick={() => setSaleItems([])}>
                      Clear
                    </Button>
                    <Button onClick={handleCheckout}>
                      <Printer className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Sales & Quick Search */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Medicine Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchMedicine}
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mockMedicines
                    .filter((med) =>
                      med.name.toLowerCase().includes(searchMedicine.toLowerCase())
                    )
                    .map((med) => (
                      <div
                        key={med.id}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          const newIndex = saleItems.length;
                          addSaleItem();
                          setTimeout(() => handleMedicineSelect(newIndex, med.id), 0);
                        }}
                      >
                        <p className="text-sm">{med.name}</p>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>${med.price.toFixed(2)}</span>
                          <span>Stock: {med.stock}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">{sale.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{sale.customer}</p>
                        <p className="text-xs text-gray-500">{sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">${sale.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{sale.items} items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
