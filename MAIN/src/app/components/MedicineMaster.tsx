import { useState } from "react";
import { Plus, Search, Edit, Power } from "lucide-react";
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

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  strength: string;
  form: string;
  price: number;
  status: "active" | "inactive";
}

const mockMedicines: Medicine[] = [
  {
    id: "MED001",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    manufacturer: "PharmaCorp",
    strength: "500mg",
    form: "Capsule",
    price: 0.45,
    status: "active",
  },
  {
    id: "MED002",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "Pain Relief",
    manufacturer: "MediLabs",
    strength: "400mg",
    form: "Tablet",
    price: 0.25,
    status: "active",
  },
  {
    id: "MED003",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "Pain Relief",
    manufacturer: "HealthCare Inc",
    strength: "500mg",
    form: "Tablet",
    price: 0.15,
    status: "active",
  },
  {
    id: "MED004",
    name: "Metformin",
    genericName: "Metformin HCl",
    category: "Diabetes",
    manufacturer: "BioMed",
    strength: "500mg",
    form: "Tablet",
    price: 0.35,
    status: "active",
  },
  {
    id: "MED005",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "Cardiovascular",
    manufacturer: "CardioHealth",
    strength: "10mg",
    form: "Tablet",
    price: 0.55,
    status: "inactive",
  },
];

export function MedicineMaster() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingMedicine(null);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med.id === id
          ? { ...med, status: med.status === "active" ? "inactive" : "active" }
          : med
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Medicine Master</h1>
          <p className="text-gray-500 mt-1">Manage medicine inventory and details</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search medicines..."
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
              <TableHead>Medicine ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Generic Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Form</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.id}</TableCell>
                <TableCell>{medicine.name}</TableCell>
                <TableCell className="text-gray-500">{medicine.genericName}</TableCell>
                <TableCell>{medicine.category}</TableCell>
                <TableCell>{medicine.strength}</TableCell>
                <TableCell>{medicine.form}</TableCell>
                <TableCell>${medicine.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={medicine.status === "active" ? "default" : "secondary"}>
                    {medicine.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(medicine)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(medicine.id)}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
            </DialogTitle>
            <DialogDescription>
              {editingMedicine
                ? "Update medicine information"
                : "Add a new medicine to the master list"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name</Label>
              <Input id="name" defaultValue={editingMedicine?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="generic">Generic Name</Label>
              <Input id="generic" defaultValue={editingMedicine?.genericName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue={editingMedicine?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                  <SelectItem value="Diabetes">Diabetes</SelectItem>
                  <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="Vitamins">Vitamins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" defaultValue={editingMedicine?.manufacturer} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strength">Strength</Label>
              <Input id="strength" defaultValue={editingMedicine?.strength} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form">Form</Label>
              <Select defaultValue={editingMedicine?.form}>
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Capsule">Capsule</SelectItem>
                  <SelectItem value="Syrup">Syrup</SelectItem>
                  <SelectItem value="Injection">Injection</SelectItem>
                  <SelectItem value="Cream">Cream</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Unit Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                defaultValue={editingMedicine?.price}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingMedicine ? "Update" : "Add"} Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
