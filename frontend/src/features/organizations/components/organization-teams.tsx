"use client";

import { useState, useEffect } from "react";
import { organization } from "@/lib/auth/auth-client";
import { Team } from "better-auth/plugins";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsersRound, Plus, Trash2, Calendar } from "lucide-react";

interface OrganizationTeamsProps {
  organizationId: string;
}

export function OrganizationTeams({
  organizationId,
}: OrganizationTeamsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadTeams();
  }, [organizationId]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await organization.listTeams({
        query: { organizationId },
      });
      if (result.data) {
        setTeams(result.data);
      } else if (result.error) {
        setError(result.error.message || "Failed to load teams");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load teams");
      } else {
        setError("Failed to load teams");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;

    try {
      setCreating(true);
      setError("");
      type OrganizationWithTeams = typeof organization & {
        createTeam: (params: {
          organizationId: string;
          name: string;
        }) => Promise<{ data: Team; error: Error | null }>;
      };
      const orgWithTeams = organization as OrganizationWithTeams;

      const result = await orgWithTeams.createTeam({
        organizationId,
        name: newTeamName,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create team");
      } else {
        setNewTeamName("");
        setIsDialogOpen(false);
        loadTeams();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create team");
      } else {
        setError("Failed to create team");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      setDeletingId(teamId);
      setError("");
      type OrganizationWithTeams = typeof organization & {
        removeTeam: (params: {
          organizationId: string;
          teamId: string;
        }) => Promise<{ data: Team; error: Error | null }>;
      };
      const orgWithTeams = organization as OrganizationWithTeams;

      const result = await orgWithTeams.removeTeam({
        organizationId,
        teamId,
      });

      if (result.error) {
        setError(result.error.message || "Failed to delete team");
      } else {
        loadTeams();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to delete team");
      } else {
        setError("Failed to delete team");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Teams</h3>
          <p className="text-sm text-muted-foreground">
            Organize members into teams
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                Create a new team within this organization
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="teamName" className="text-sm font-medium">
                  Team Name
                </label>
                <Input
                  id="teamName"
                  type="text"
                  placeholder="Engineering Team"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Team"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <UsersRound className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No teams yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create teams to organize your members
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UsersRound className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(team.createdAt instanceof Date ? team.createdAt : new Date(team.createdAt))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id)}
                      disabled={deletingId === team.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
