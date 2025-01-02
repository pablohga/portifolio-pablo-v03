import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VerificationResult {
  email: string;
  status: string;
  error?: string;
}

export function VerifySubscriptionsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  async function handleVerify() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions/verify", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to verify subscriptions");
      }

      const data = await response.json();
      setResults(data.updates);
      setShowResults(true);

      toast({
        title: "Success",
        description: "Subscription verification completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify subscriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        className="gap-2 mb-6"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Verify Subscriptions
      </Button>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Verification Results</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.email}</TableCell>
                  <TableCell>{result.status}</TableCell>
                  <TableCell>{result.error || '-'}</TableCell>
                </TableRow>
              ))}
              {results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No results to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}