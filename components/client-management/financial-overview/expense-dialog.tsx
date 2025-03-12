import { useState } from "react";
import { 
  Dialog, 
  DialogOverlay, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExpenseDialogProps {
  setShowExpenseDialog: (show: boolean) => void;
  open: boolean; // Added open prop

}

export function ExpenseDialog({ setShowExpenseDialog, open }: ExpenseDialogProps) {

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // TODO: Implement expense submission logic
    console.log("Expense submitted:", { amount, date, category, description });
  };

  return (
    <Dialog open={open}>

      <DialogOverlay />
      <DialogContent>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogDescription>
          <div>
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </DialogDescription>
        <DialogClose>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>

        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
