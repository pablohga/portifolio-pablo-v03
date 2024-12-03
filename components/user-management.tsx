"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChangePasswordDialog } from "./user-management/change-password-dialog";
import { EditProfileDialog } from "./user-management/edit-profile-dialog";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionTier } from "@/types/subscription";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  image?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error();

      await fetchUsers();
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  }

  async function handleSubscriptionChange(userId: string, newTier: SubscriptionTier) {
    try {
      const response = await fetch(`/api/users/${userId}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionTier: newTier }),
      });

      if (!response.ok) throw new Error();

      await fetchUsers();
      toast({
        title: "Success",
        description: "Subscription tier updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription tier",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      await fetchUsers();
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  }

  const isCurrentUserAdmin = session?.user?.role === 'admin';

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {isCurrentUserAdmin ? (
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  {isCurrentUserAdmin ? (
                    <Select
                      value={user.subscriptionTier}
                      onValueChange={(value) => 
                        handleSubscriptionChange(user._id, value as SubscriptionTier)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    user.subscriptionTier
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsProfileDialogOpen(true);
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsPasswordDialogOpen(true);
                      }}
                    >
                      Change Password
                    </Button>
                    {isCurrentUserAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <ChangePasswordDialog
            userId={selectedUser._id}
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          />
          <EditProfileDialog
            user={selectedUser}
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
            onUpdate={fetchUsers}
          />
        </>
      )}
    </div>
  );
}